"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const WALL = "#f1eae0";
const BASEBOARD = "#e0d5c3";
const FLOOR = "#cfa87c";
const FRAME = "#f7f2e9";

function makeWindowView() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 280;
  const ctx = canvas.getContext("2d")!;

  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, "#9fd6e8");
  sky.addColorStop(1, "#e8f6f3");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 256, 200);

  ctx.fillStyle = "#ffd27a";
  ctx.beginPath();
  ctx.arc(200, 52, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#7cc3cf";
  ctx.fillRect(0, 200, 256, 80);

  ctx.strokeStyle = "#2e6b4f";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  const palm = (x: number, y: number, s: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(6, -34, -4, -58);
    ctx.stroke();
    const top = { x: -4, y: -58 };
    const leaves = [
      [-26, -10],
      [-16, -26],
      [16, -26],
      [26, -8],
      [0, -20],
    ];
    for (const [dx, dy] of leaves) {
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.quadraticCurveTo(top.x + dx * 0.6, top.y + dy * 0.8, top.x + dx, top.y + dy + 8);
      ctx.stroke();
    }
    ctx.restore();
  };
  palm(70, 275, 1);
  palm(130, 278, 0.7);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function fadeWalls(
  groupRef: React.RefObject<THREE.Group | null>,
  behind: boolean,
) {
  if (!groupRef.current) return;
  groupRef.current.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      const mat = child.material;
      if (!mat.transparent) mat.transparent = true;
      const target = behind ? 0.2 : 1;
      mat.opacity += (target - mat.opacity) * 0.15;
      mat.depthWrite = mat.opacity > 0.95;
      mat.needsUpdate = true;
    }
  });
}

export function Room() {
  const viewTexture = useMemo(() => makeWindowView(), []);
  const { camera } = useThree();
  const backWallsRef = useRef<THREE.Group>(null);
  const leftWallRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const cam = camera.position;
    fadeWalls(backWallsRef, cam.z < -2.05);
    fadeWalls(leftWallRef, cam.x < -2.55);
  });

  return (
    <group>
      {/* floor */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[5, 0.1, 4]} />
        <meshStandardMaterial color={FLOOR} roughness={0.85} />
      </mesh>

      {/* back wall segments (window opening x -1.9..-0.7, y 0.7..2.0) */}
      <group ref={backWallsRef}>
        <mesh position={[-2.2, 1.3, -2.05]}>
          <boxGeometry args={[0.6, 2.6, 0.1]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        <mesh position={[0.9, 1.3, -2.05]}>
          <boxGeometry args={[3.2, 2.6, 0.1]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        <mesh position={[-1.3, 0.35, -2.05]}>
          <boxGeometry args={[1.2, 0.7, 0.1]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        <mesh position={[-1.3, 2.3, -2.05]}>
          <boxGeometry args={[1.2, 0.6, 0.1]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        {/* back baseboard */}
        <mesh position={[0, 0.04, -1.98]}>
          <boxGeometry args={[5, 0.08, 0.02]} />
          <meshStandardMaterial color={BASEBOARD} />
        </mesh>
      </group>

      {/* left wall */}
      <group ref={leftWallRef}>
        <mesh position={[-2.55, 1.3, -0.05]}>
          <boxGeometry args={[0.1, 2.6, 4.1]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        {/* left baseboard */}
        <mesh position={[-2.48, 0.04, -0.05]}>
          <boxGeometry args={[0.02, 0.08, 4.1]} />
          <meshStandardMaterial color={BASEBOARD} />
        </mesh>
      </group>

      {/* window frame + view */}
      <mesh position={[-1.3, 1.35, -2.11]}>
        <planeGeometry args={[1.2, 1.3]} />
        <meshBasicMaterial map={viewTexture} />
      </mesh>
      <mesh position={[-1.3, 2.02, -1.99]}>
        <boxGeometry args={[1.3, 0.05, 0.06]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>
      <mesh position={[-1.3, 0.68, -1.99]}>
        <boxGeometry args={[1.3, 0.05, 0.06]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>
      <mesh position={[-1.92, 1.35, -1.99]}>
        <boxGeometry args={[0.05, 1.4, 0.06]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>
      <mesh position={[-0.68, 1.35, -1.99]}>
        <boxGeometry args={[0.05, 1.4, 0.06]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>
      {/* mullions */}
      <mesh position={[-1.3, 1.35, -1.98]}>
        <boxGeometry args={[0.035, 1.3, 0.04]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>
      <mesh position={[-1.3, 1.35, -1.98]}>
        <boxGeometry args={[1.2, 0.035, 0.04]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>
      {/* sill */}
      <mesh position={[-1.3, 0.65, -1.94]}>
        <boxGeometry args={[1.36, 0.05, 0.16]} />
        <meshStandardMaterial color={FRAME} />
      </mesh>

      {/* wall shelf */}
      <group position={[-0.15, 1.62, -1.94]}>
        <mesh>
          <boxGeometry args={[1.1, 0.04, 0.22]} />
          <meshStandardMaterial color="#c99e6f" roughness={0.7} />
        </mesh>
        <mesh position={[-0.35, 0.09, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.1, 16]} />
          <meshStandardMaterial color="#b25a3c" roughness={0.8} />
        </mesh>
        <mesh position={[-0.35, 0.17, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#4c8f57" roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 0.035, 0]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.16, 0.03, 0.12]} />
          <meshStandardMaterial color="#7a6fd0" roughness={0.8} />
        </mesh>
        <mesh position={[0.05, 0.065, 0]} rotation={[0, -0.1, 0]}>
          <boxGeometry args={[0.14, 0.03, 0.11]} />
          <meshStandardMaterial color="#e8913f" roughness={0.8} />
        </mesh>
        <mesh position={[0.38, 0.08, 0]}>
          <cylinderGeometry args={[0.045, 0.035, 0.12, 16]} />
          <meshStandardMaterial color="#e0d5c3" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
