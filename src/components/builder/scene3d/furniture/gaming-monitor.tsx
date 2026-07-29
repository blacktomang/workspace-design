"use client";

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useTexture, useVideoTexture } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";

/**
 * Curved Ultra-Wide Gaming Monitor with Flat Base Stand.
 * Procedural model ported from the standalone three.js prototype.
 * Origin is at the base (floor level) so pop-in grows from the desk surface.
 * Footprint: ~1.18 wide, ~0.52 tall, screen faces +Z.
 */

type Smoothing = "linear" | "catmull-rom";

function sampleExtrudeProfile(
  values: number[],
  smoothing: Smoothing,
  curveSegments: number
): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i < values.length; i += 2) {
    points.push(new THREE.Vector2(values[i], values[i + 1]));
  }
  if (smoothing === "linear" || points.length < 3) return points;
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(p.x, p.y, 0)),
    true,
    "centripetal"
  );
  const sampled = curve.getSpacedPoints(Math.max(curveSegments, points.length));
  sampled.pop();
  return sampled.map((p) => new THREE.Vector2(p.x, p.y));
}

function createExtrudeShape(
  profile: number[],
  holes: number[][],
  smoothing: Smoothing,
  curveSegments: number
): THREE.Shape {
  const shape = new THREE.Shape(
    sampleExtrudeProfile(profile, smoothing, curveSegments)
  );
  for (const hole of holes) {
    shape.holes.push(
      new THREE.Path(sampleExtrudeProfile(hole, smoothing, curveSegments))
    );
  }
  return shape;
}

function createExtrudeGeometry(
  profile: number[],
  holes: number[][],
  length: number,
  bevelSize: number,
  bevelThickness: number,
  bevelSegments: number,
  depthSegments: number,
  curveSegments: number,
  smoothing: Smoothing
): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(
    createExtrudeShape(profile, holes, smoothing, curveSegments),
    {
      depth: length,
      steps: depthSegments,
      curveSegments,
      bevelEnabled: bevelSize > 0,
      bevelSize,
      bevelThickness: Math.min(bevelThickness, length / 2),
      bevelSegments: bevelSize > 0 ? bevelSegments : 0,
    }
  );
  geo.translate(0, 0, -length / 2);
  return geo;
}

function sampleSweepProfile(
  values: number[],
  smoothing: Smoothing,
  curveSegments: number
): THREE.Vector2[] {
  let points: THREE.Vector2[] = [];
  for (let i = 0; i < values.length; i += 2) {
    points.push(new THREE.Vector2(values[i], values[i + 1]));
  }
  if (smoothing === "catmull-rom" && points.length >= 3) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p.x, p.y, 0)),
      true,
      "centripetal"
    );
    const sampled = curve.getSpacedPoints(
      Math.max(curveSegments, points.length)
    );
    sampled.pop();
    points = sampled.map((p) => new THREE.Vector2(p.x, p.y));
  }
  if (THREE.ShapeUtils.isClockWise(points)) points.reverse();
  return points;
}

function sampleSweepSeries(
  values: number[],
  tupleSize: number,
  t: number,
  fallback: number[]
): number[] {
  const count = values.length / tupleSize;
  if (count === 0) return fallback;
  if (count === 1) return values.slice(0, tupleSize);
  const scaled = Math.min(t, 1) * (count - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(lower + 1, count - 1);
  const alpha = scaled - lower;
  return Array.from({ length: tupleSize }, (_, off) =>
    THREE.MathUtils.lerp(
      values[lower * tupleSize + off],
      values[upper * tupleSize + off],
      alpha
    )
  );
}

function createSweepGeometry(
  profileValues: number[],
  pathValues: number[],
  closed: boolean,
  curveSegments: number,
  smoothing: Smoothing,
  sectionScales: number[],
  sectionTwists: number[],
  sectionProfiles: number[][]
): THREE.BufferGeometry {
  const pathPoints: THREE.Vector3[] = [];
  for (let i = 0; i < pathValues.length; i += 3) {
    pathPoints.push(
      new THREE.Vector3(pathValues[i], pathValues[i + 1], pathValues[i + 2])
    );
  }
  const pathCurve = new THREE.CatmullRomCurve3(pathPoints, closed, "centripetal");
  const frames = pathCurve.computeFrenetFrames(curveSegments, closed);
  const profiles = (
    sectionProfiles.length > 0 ? sectionProfiles : [profileValues]
  ).map((v) => sampleSweepProfile(v, smoothing, curveSegments));
  const sectionCount = closed ? curveSegments : curveSegments + 1;
  const profileCount = profiles[0].length;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let s = 0; s < sectionCount; s++) {
    const t = s / curveSegments;
    const center = pathCurve.getPointAt(t);
    const scale = sampleSweepSeries(sectionScales, 2, t, [1, 1]);
    const [twist] = sampleSweepSeries(sectionTwists, 1, t, [0]);
    const cos = Math.cos(twist);
    const sin = Math.sin(twist);
    const spi = Math.min(t, 1) * (profiles.length - 1);
    const lp = Math.floor(spi);
    const up = Math.min(lp + 1, profiles.length - 1);
    const pa = spi - lp;
    const profile = profiles[lp].map(
      (p, idx) =>
        new THREE.Vector2(
          THREE.MathUtils.lerp(p.x, profiles[up][idx].x, pa),
          THREE.MathUtils.lerp(p.y, profiles[up][idx].y, pa)
        )
    );
    const normal = frames.normals[s].clone();
    const binormal = frames.binormals[s].clone();
    const localX = normal
      .clone()
      .multiplyScalar(cos)
      .addScaledVector(binormal, sin);
    const localY = binormal
      .clone()
      .multiplyScalar(cos)
      .addScaledVector(normal, -sin);

    profile.forEach((p, pi) => {
      const v = center
        .clone()
        .addScaledVector(localX, p.x * scale[0])
        .addScaledVector(localY, p.y * scale[1]);
      positions.push(v.x, v.y, v.z);
      uvs.push(pi / profileCount, t);
    });
  }

  const sideCount = closed ? sectionCount : sectionCount - 1;
  for (let s = 0; s < sideCount; s++) {
    const ns = (s + 1) % sectionCount;
    for (let p = 0; p < profileCount; p++) {
      const np = (p + 1) % profileCount;
      const a = s * profileCount + p;
      const b = ns * profileCount + p;
      const c = ns * profileCount + np;
      const d = s * profileCount + np;
      indices.push(a, b, d, b, c, d);
    }
  }

  if (!closed) {
    const st = THREE.ShapeUtils.triangulateShape(profiles[0], []);
    const et = THREE.ShapeUtils.triangulateShape(
      profiles[profiles.length - 1],
      []
    );
    const eo = (sectionCount - 1) * profileCount;
    st.forEach(([a, b, c]) => indices.push(c, b, a));
    et.forEach(([a, b, c]) => indices.push(eo + a, eo + b, eo + c));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Thin curved ribbon that follows the profile curve exactly, with zero fill
 * thickness - used for the wallpaper panel so it hugs the shell's front face.
 */
function createCurvedPanelGeometry(
  profileValues: number[],
  height: number,
  curveSegments: number
): THREE.BufferGeometry {
  const raw: THREE.Vector3[] = [];
  for (let i = 0; i < profileValues.length; i += 2) {
    raw.push(new THREE.Vector3(profileValues[i], profileValues[i + 1], 0));
  }
  const curve = new THREE.CatmullRomCurve3(raw, false, "centripetal");
  const sampled = curve.getSpacedPoints(curveSegments);
  const cols = sampled.length;
  const halfH = height / 2;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  [0, 1].forEach((t) => {
    const z = THREE.MathUtils.lerp(-halfH, halfH, t);
    for (let c = 0; c < cols; c++) {
      positions.push(sampled[c].x, sampled[c].y, z);
      uvs.push(c / (cols - 1), t);
    }
  });
  for (let c = 0; c < cols - 1; c++) {
    indices.push(c, c + cols, c + 1, c + cols, c + 1 + cols, c + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createInstanceMatrix(
  position: [number, number, number],
  rotation: [number, number, number],
  scale: [number, number, number]
): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3().fromArray(position),
    new THREE.Quaternion().setFromEuler(
      new THREE.Euler(rotation[0], rotation[1], rotation[2], "XYZ")
    ),
    new THREE.Vector3().fromArray(scale)
  );
}

function createProjectedDecalGeometry(
  target: THREE.Mesh,
  node: THREE.Object3D,
  projectorSize: [number, number, number]
): THREE.BufferGeometry {
  const pos = node.getWorldPosition(new THREE.Vector3());
  const ori = new THREE.Euler().setFromQuaternion(
    node.getWorldQuaternion(new THREE.Quaternion()),
    "XYZ"
  );
  const ws = node.getWorldScale(new THREE.Vector3());
  const geo = new DecalGeometry(
    target,
    pos,
    ori,
    new THREE.Vector3(
      projectorSize[0] * ws.x,
      projectorSize[1] * ws.y,
      projectorSize[2] * ws.z
    )
  );
  geo.applyMatrix4(node.matrixWorld.clone().invert());
  return geo;
}

function buildMonitor(
  wallpaperTexture: THREE.Texture,
  accent: string
): THREE.Group {
  const monitorRoot = new THREE.Group();
  monitorRoot.name = "Curved Ultra-Wide Gaming Monitor with Flat Base Stand";

  // ── Materials ──
  const matPlastic = new THREE.MeshStandardMaterial({
    color: "#1A1B1E",
    roughness: 0.5,
    metalness: 0.05,
    envMapIntensity: 1,
  });

  const matMetalColumn = new THREE.MeshStandardMaterial({
    color: "#181A1D",
    roughness: 0.3,
    metalness: 0.8,
    envMapIntensity: 1.5,
  });

  const matMetalBase = new THREE.MeshStandardMaterial({
    color: "#16181B",
    roughness: 0.25,
    metalness: 0.85,
    envMapIntensity: 1.5,
  });

  const matLogo = new THREE.MeshStandardMaterial({
    color: "#80848E",
    roughness: 0.4,
    metalness: 0.1,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
  });

  const matRubber = new THREE.MeshStandardMaterial({
    color: "#111214",
    roughness: 0.8,
    metalness: 0,
    envMapIntensity: 0.8,
  });

  // ── Groups (Hierarchy) ──
  const displayAssembly = new THREE.Group();
  displayAssembly.name = "Display Screen Assembly";
  displayAssembly.position.fromArray([0, 0.34, -0.02]);
  displayAssembly.rotation.set(0.03, 0, 0, "XYZ");

  const bezelFrame = new THREE.Group();
  bezelFrame.name = "Bezel Frame Assembly";

  const rearMountAssembly = new THREE.Group();
  rearMountAssembly.name = "Rear Mount & Articulation Assembly";
  rearMountAssembly.position.fromArray([0, 0, -0.04]);

  const standAssembly = new THREE.Group();
  standAssembly.name = "Desk Stand Assembly";

  // ── Rear Housing ──
  const rearHousing = new THREE.Group();
  rearHousing.name = "Rear Housing Curved Shell";
  rearHousing.position.fromArray([0, 0, -0.008]);
  rearHousing.rotation.set(Math.PI / 2, 0, 0, "XYZ");

  const rearHousingGeometry = createExtrudeGeometry(
    [
      -0.59, 0.008, -0.516, -0.01, -0.442, -0.027, -0.368, -0.041, -0.295,
      -0.052, -0.221, -0.061, -0.147, -0.067, -0.074, -0.071, 0, -0.072, 0.074,
      -0.071, 0.147, -0.067, 0.221, -0.061, 0.295, -0.052, 0.368, -0.041,
      0.442, -0.027, 0.516, -0.01, 0.59, 0.008, 0.59, 0.01, 0.516, 0.005,
      0.442, -0.002, 0.368, -0.008, 0.295, -0.012, 0.221, -0.016, 0.147,
      -0.019, 0.074, -0.021, 0, -0.022, -0.074, -0.021, -0.147, -0.019, -0.221,
      -0.016, -0.295, -0.012, -0.368, -0.008, -0.442, -0.002, -0.516, 0.005,
      -0.59, 0.01,
    ],
    [],
    0.355,
    0.005,
    0.005,
    6,
    4,
    64,
    "catmull-rom"
  );
  const rearHousingMesh = new THREE.Mesh(rearHousingGeometry, matPlastic);
  rearHousingMesh.castShadow = true;
  rearHousingMesh.receiveShadow = true;
  rearHousing.add(rearHousingMesh);

  // ── Wallpaper Front Panel ──
  // FRONT curve of the rear housing profile (center y=-0.022). The rear
  // curve (center y=-0.072) would hide the panel inside the solid shell.
  const wallpaperFrontPanel = new THREE.Group();
  wallpaperFrontPanel.name = "Wallpaper Front Panel";

  const wallpaperCurveGeo = [
    0.59, 0.01, 0.516, 0.005, 0.442, -0.002, 0.368, -0.008, 0.295, -0.012,
    0.221, -0.016, 0.147, -0.019, 0.074, -0.021, 0, -0.022, -0.074, -0.021,
    -0.147, -0.019, -0.221, -0.016, -0.295, -0.012, -0.368, -0.008, -0.442,
    -0.002, -0.516, 0.005, -0.59, 0.01,
  ];

  const wallpaperFrontGeometry = createCurvedPanelGeometry(
    wallpaperCurveGeo,
    0.34,
    64
  );
  // In the parent's rotated frame, local +Z points world-down and the curve
  // runs right-to-left, so flip both U and V so the image reads upright.
  {
    const uvAttr = wallpaperFrontGeometry.getAttribute(
      "uv"
    ) as THREE.BufferAttribute;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setXY(i, 1 - uvAttr.getX(i), 1 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;
  }

  const wallpaperFrontMesh = new THREE.Mesh(
    wallpaperFrontGeometry,
    new THREE.MeshStandardMaterial({
      map: wallpaperTexture,
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0,
      emissive: "#ffffff",
      emissiveMap: wallpaperTexture,
      emissiveIntensity: 0.8,
      envMapIntensity: 0.3,
      side: THREE.DoubleSide,
    })
  );
  wallpaperFrontMesh.castShadow = false;
  wallpaperFrontMesh.receiveShadow = true;
  wallpaperFrontPanel.add(wallpaperFrontMesh);
  // No extra rotation: the panel uses the same geometry convention as the
  // housing's extrude. Offset 0.007 clears the housing's 0.005 bevel.
  wallpaperFrontPanel.position.set(0, 0.007, 0);
  rearHousing.add(wallpaperFrontPanel);

  // ── Bottom Chin Bezel ──
  const bottomChinBezel = new THREE.Group();
  bottomChinBezel.name = "Bottom Chin Bezel Strip";

  const bottomChinGeometry = createSweepGeometry(
    [-0.006, -0.01, 0.006, -0.01, 0.006, 0.01, -0.006, 0.01],
    [
      -0.59, -0.18, 0, -0.516, -0.18, -0.018, -0.442, -0.18, -0.035, -0.368,
      -0.18, -0.049, -0.295, -0.18, -0.06, -0.221, -0.18, -0.069, -0.147,
      -0.18, -0.075, -0.074, -0.18, -0.079, 0, -0.18, -0.08, 0.074, -0.18,
      -0.079, 0.147, -0.18, -0.075, 0.221, -0.18, -0.069, 0.295, -0.18, -0.06,
      0.368, -0.18, -0.049, 0.442, -0.18, -0.035, 0.516, -0.18, -0.018, 0.59,
      -0.18, 0,
    ],
    false,
    64,
    "catmull-rom",
    [],
    [],
    []
  );
  const bottomChinMesh = new THREE.Mesh(bottomChinGeometry, matPlastic);
  bottomChinMesh.castShadow = true;
  bottomChinMesh.receiveShadow = true;
  bottomChinBezel.add(bottomChinMesh);

  // ── Top Bezel ──
  const topBezel = new THREE.Group();
  topBezel.name = "Top Bezel Outer Trim";

  const topBezelGeometry = createSweepGeometry(
    [-0.004, -0.004, 0.004, -0.004, 0.004, 0.004, -0.004, 0.004],
    [
      -0.59, 0.18, 0, -0.516, 0.18, -0.018, -0.442, 0.18, -0.035, -0.368,
      0.18, -0.049, -0.295, 0.18, -0.06, -0.221, 0.18, -0.069, -0.147, 0.18,
      -0.075, -0.074, 0.18, -0.079, 0, 0.18, -0.08, 0.074, 0.18, -0.079,
      0.147, 0.18, -0.075, 0.221, 0.18, -0.069, 0.295, 0.18, -0.06, 0.368,
      0.18, -0.049, 0.442, 0.18, -0.035, 0.516, 0.18, -0.018, 0.59, 0.18, 0,
    ],
    false,
    64,
    "catmull-rom",
    [],
    [],
    []
  );
  const topBezelMesh = new THREE.Mesh(topBezelGeometry, matPlastic);
  topBezelMesh.castShadow = true;
  topBezelMesh.receiveShadow = true;
  topBezel.add(topBezelMesh);

  // ── Left / Right Bezels ──
  const leftBezel = new THREE.Group();
  leftBezel.name = "Left Bezel Outer Trim";
  leftBezel.position.fromArray([-0.588, 0, 0.002]);
  leftBezel.rotation.set(0, -0.28, 0, "XYZ");
  const leftBezelMesh = new THREE.Mesh(
    new RoundedBoxGeometry(0.008, 0.362, 0.012, 4, 0.002),
    matPlastic
  );
  leftBezelMesh.castShadow = true;
  leftBezelMesh.receiveShadow = true;
  leftBezel.add(leftBezelMesh);

  const rightBezel = new THREE.Group();
  rightBezel.name = "Right Bezel Outer Trim";
  rightBezel.position.fromArray([0.588, 0, 0.002]);
  rightBezel.rotation.set(0, 0.28, 0, "XYZ");
  const rightBezelMesh = new THREE.Mesh(
    new RoundedBoxGeometry(0.008, 0.362, 0.012, 4, 0.002),
    matPlastic
  );
  rightBezelMesh.castShadow = true;
  rightBezelMesh.receiveShadow = true;
  rightBezel.add(rightBezelMesh);

  // ── Logo Decal Group ──
  const logoDecalGroup = new THREE.Group();
  logoDecalGroup.name = "Brand Logo Graphic Mark";
  logoDecalGroup.position.fromArray([0, -0.18, 0.082]);

  // ── Rear Mount Housing ──
  const rearMountHousing = new THREE.Group();
  rearMountHousing.name = "Central VESA Rear Hub Cover";
  rearMountHousing.position.fromArray([0, 0, -0.02]);
  const rearMountHousingMesh = new THREE.Mesh(
    new RoundedBoxGeometry(0.18, 0.18, 0.05, 6, 0.015),
    matPlastic
  );
  rearMountHousingMesh.castShadow = true;
  rearMountHousingMesh.receiveShadow = true;
  rearMountHousing.add(rearMountHousingMesh);

  // ── Stand Pivot ──
  const standPivot = new THREE.Group();
  standPivot.name = "Stand Articulation Hinge Pivot";
  standPivot.position.fromArray([0, 0, -0.055]);
  standPivot.rotation.set(Math.PI / 2, 0, 0, "XYZ");
  const standPivotMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.04, 32),
    matMetalColumn
  );
  standPivotMesh.castShadow = true;
  standPivotMesh.receiveShadow = true;
  standPivot.add(standPivotMesh);

  // ── Stand Column ──
  const standColumn = new THREE.Group();
  standColumn.name = "Stand Vertical Column";
  standColumn.position.fromArray([0, 0, -0.1]);
  const standColumnGeometry = createExtrudeGeometry(
    [-0.045, 0.01, 0.045, 0.01, 0.045, 0.29, -0.045, 0.29],
    [[-0.025, 0.07, 0.025, 0.07, 0.025, 0.13, -0.025, 0.13]],
    0.06,
    0.003,
    0.003,
    4,
    1,
    32,
    "linear"
  );
  const standColumnMesh = new THREE.Mesh(standColumnGeometry, matMetalColumn);
  standColumnMesh.castShadow = true;
  standColumnMesh.receiveShadow = true;
  standColumn.add(standColumnMesh);

  // ── Cable Management ──
  const cableManagement = new THREE.Group();
  cableManagement.name = "Cable Pass-Through";
  cableManagement.position.fromArray([0, 0.1, -0.1]);
  const cableManagementMesh = new THREE.Mesh(
    new RoundedBoxGeometry(0.054, 0.064, 0.062, 4, 0.008),
    matRubber
  );
  cableManagementMesh.castShadow = true;
  cableManagementMesh.receiveShadow = true;
  cableManagement.add(cableManagementMesh);

  // ── Base Plate ──
  const basePlate = new THREE.Group();
  basePlate.name = "Flat Base Metal Plate";
  basePlate.position.fromArray([0, 0.005, -0.05]);
  const basePlateMesh = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.008, 0.22, 4, 0.004),
    matMetalBase
  );
  basePlateMesh.castShadow = true;
  basePlateMesh.receiveShadow = true;
  basePlate.add(basePlateMesh);

  // ── Rubber Feet ──
  const rubberFeet = new THREE.Group();
  rubberFeet.name = "Rubber Feet";
  rubberFeet.position.fromArray([0, 0.0015, -0.05]);
  const feetMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.03, 0.003, 0.03),
    matRubber,
    4
  );
  (
    [
      [-0.19, 0, 0.09],
      [0.19, 0, 0.09],
      [-0.19, 0, -0.09],
      [0.19, 0, -0.09],
    ] as [number, number, number][]
  ).forEach((p, i) =>
    feetMesh.setMatrixAt(i, createInstanceMatrix(p, [0, 0, 0], [1, 1, 1]))
  );
  feetMesh.instanceMatrix.needsUpdate = true;
  rubberFeet.add(feetMesh);

  // ── Base Collar ──
  const baseCollar = new THREE.Group();
  baseCollar.name = "Base Column Joint Collar";
  baseCollar.position.fromArray([0, 0.011, -0.1]);
  const baseCollarMesh = new THREE.Mesh(
    new RoundedBoxGeometry(0.1, 0.006, 0.07, 4, 0.002),
    matMetalColumn
  );
  baseCollarMesh.castShadow = true;
  baseCollarMesh.receiveShadow = true;
  baseCollar.add(baseCollarMesh);

  // ── Power Joystick ──
  // Chin bezel sweep path is at z=-0.08 when x=0 (screen curvature).
  const powerButton = new THREE.Group();
  powerButton.name = "Power Joystick";
  powerButton.position.fromArray([0, -0.198, -0.08]);
  const matButton = new THREE.MeshStandardMaterial({
    color: "#3A3D44",
    roughness: 0.35,
    metalness: 0.6,
    envMapIntensity: 1.5,
  });
  const powerButtonMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.009, 0.018, 24),
    matButton
  );
  powerButtonMesh.castShadow = true;
  powerButtonMesh.receiveShadow = true;
  powerButton.add(powerButtonMesh);

  // ── Status LED (accent-colored) ──
  const statusLed = new THREE.Group();
  statusLed.name = "Status LED";
  statusLed.position.fromArray([0.05, -0.18, -0.072]);
  const matLed = new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 3,
    roughness: 0.2,
    metalness: 0,
  });
  const statusLedMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.004, 0.004),
    matLed
  );
  statusLed.add(statusLedMesh);

  // ── Assemble Scene Graph ──
  monitorRoot.add(displayAssembly);
  monitorRoot.add(standAssembly);

  displayAssembly.add(bezelFrame);
  displayAssembly.add(rearMountAssembly);
  displayAssembly.add(rearHousing);
  displayAssembly.add(powerButton);
  displayAssembly.add(statusLed);

  bezelFrame.add(bottomChinBezel);
  bezelFrame.add(topBezel);
  bezelFrame.add(leftBezel);
  bezelFrame.add(rightBezel);

  bottomChinBezel.add(logoDecalGroup);

  rearMountAssembly.add(rearMountHousing);
  rearMountAssembly.add(standPivot);

  standAssembly.add(standColumn);
  standAssembly.add(cableManagement);
  standAssembly.add(basePlate);
  standAssembly.add(rubberFeet);
  standAssembly.add(baseCollar);

  monitorRoot.updateMatrixWorld(true);

  // ── Logo Decal ──
  const logoDecalGeometry = createProjectedDecalGeometry(
    bottomChinMesh,
    logoDecalGroup,
    [0.08, 0.015, 0.02]
  );
  logoDecalGroup.add(new THREE.Mesh(logoDecalGeometry, matLogo));

  return monitorRoot;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => m.dispose());
    }
  });
}

function GamingMonitorInner({ accent }: { accent: string }) {
  
  const wallpaper = useVideoTexture("/ads.mp4");
  wallpaper.colorSpace = THREE.SRGBColorSpace;

  const model = useMemo(() => buildMonitor(wallpaper, accent), [wallpaper, accent]);

  useEffect(() => () => disposeObject(model), [model]);

  return <primitive object={model} />;
}

/** Curved ultra-wide gaming monitor (procedural). Origin at floor/base level. */
export function GamingMonitorModel({ accent }: { accent: string }) {
  return (
    <Suspense fallback={null}>
      <GamingMonitorInner accent={accent} />
    </Suspense>
  );
}
