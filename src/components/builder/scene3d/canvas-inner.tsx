"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { type ComponentRef, useEffect, useRef } from "react";
import { selectHasMonitor, useWorkspaceStore } from "@/lib/store/workspace-store";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { ChairModel } from "./furniture/chairs";
import { DeskModel } from "./furniture/desks";
import { KeyboardSet, Lamp, LaptopStand, Monitors } from "./furniture/devices";
import { Plant } from "./furniture/plant";
import { Poster } from "./furniture/poster";
import { Room } from "./room";

const DEFAULT_CAMERA: [number, number, number] = [0.2, 1.5, 2.2];
const DEFAULT_TARGET: [number, number, number] = [0.2, 0.9, -1.65];
/** Mobile: the room is taller than wide on portrait, so pull the camera way back. */
const MOBILE_CAMERA: [number, number, number] = [0.2, 1.5, 4.0];
const MOBILE_TARGET: [number, number, number] = [0.2, 0.9, -1.65];
const INROOM_CAMERA: [number, number, number] = [0.2, 1.5, -0.95];
const INROOM_TARGET: [number, number, number] = [0.2, 0.5, -1.65];
const MOBILE_INROOM_CAMERA: [number, number, number] = [0.2, 1.5, 0.2];
const MOBILE_INROOM_TARGET: [number, number, number] = [0.2, 0.5, -1.65];

/** Smooth GSAP camera transition between two positions/targets */
function CameraController() {
  const { camera } = useThree();
  const { isMobile } = useBreakpoint();
  const cameraMode = useWorkspaceStore((s) => s.cameraMode);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const animating = useRef(false);

  useEffect(() => {
    if (animating.current) {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(camera);
    }
    animating.current = true;

    const toPos = cameraMode === "inroom"
      ? isMobile ? MOBILE_INROOM_CAMERA : INROOM_CAMERA
      : isMobile ? MOBILE_CAMERA : DEFAULT_CAMERA;
    const toTarget = cameraMode === "inroom"
      ? isMobile ? MOBILE_INROOM_TARGET : INROOM_TARGET
      : isMobile ? MOBILE_TARGET : DEFAULT_TARGET;

    gsap.to(camera.position, {
      x: toPos[0],
      y: toPos[1],
      z: toPos[2],
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        animating.current = false;
      },
    });

    if (controlsRef.current?.target) {
      gsap.to(controlsRef.current.target, {
        x: toTarget[0],
        y: toTarget[1],
        z: toTarget[2],
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
      });
    }

    const toFov = cameraMode === "inroom" ? 50 : isMobile ? 48 : 38;
    gsap.to(camera, {
      fov: toFov,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }, [cameraMode, isMobile, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={DEFAULT_TARGET}
      enablePan={false}
      enableRotate={cameraMode !== "inroom"}
      enableZoom={true}
      minDistance={2.2}
      maxDistance={7.5}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.04}
      autoRotate={false}
      autoRotateSpeed={0.7}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

/**
 * The orbitable 3D workspace. Reads the shared zustand store, so it stays in
 * sync with the catalog panel and re-renders with pop animations on change.
 */
export default function CanvasInner() {
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const monitorId = useWorkspaceStore((s) => s.monitorId);
  const accessories = useWorkspaceStore((s) => s.accessories);
  const isFullscreen = useWorkspaceStore((s) => s.isFullscreen);
  const selectItem = useWorkspaceStore((s) => s.selectItem);
  const selectedItem = useWorkspaceStore((s) => s.selectedItem);

  const hasMonitor = useWorkspaceStore(selectHasMonitor);
  const hasLamp = (accessories["acc-lamp"] ?? 0) > 0;
  const hasPlant = (accessories["acc-plant"] ?? 0) > 0;
  const hasKeyboard = (accessories["acc-keyboard"] ?? 0) > 0;

  const hasLaptopStand = (accessories["acc-laptop-stand"] ?? 0) > 0;

  const handleClick = isFullscreen
    ? {
        desk: () => selectItem(selectedItem === "desk" ? undefined : "desk"),
        chair: () => selectItem(selectedItem === "chair" ? undefined : "chair"),
        monitor: () => selectItem(selectedItem === "monitor" ? undefined : "monitor"),
      }
    : { desk: () => {}, chair: () => {}, monitor: () => {} };

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: DEFAULT_CAMERA, fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* soft warm interior lighting */}
      <hemisphereLight args={["#fff5e6", "#8a7a66", 0.55]} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} />
      <directionalLight position={[-3, 3, -2]} intensity={0.25} />
      <ambientLight intensity={0.15} />

      <Room />

      {/* Desk — clickable in fullscreen */}
      <group onClick={handleClick.desk}>
        <DeskModel id={deskId} />
      </group>

      {/* Chair — clickable in fullscreen */}
      <group onClick={handleClick.chair}>
        <ChairModel id={chairId} />
      </group>

      {/* Monitor — clickable in fullscreen */}
      {hasMonitor && (
        <group onClick={handleClick.monitor}>
          <Monitors id={monitorId} />
        </group>
      )}

      {hasLamp && <Lamp />}
      {hasKeyboard && <KeyboardSet />}
      {hasPlant && <Plant />}
      <Poster />
      {hasLaptopStand && <LaptopStand />}

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.4}
        scale={9}
        blur={2.2}
        far={3}
        resolution={512}
      />

      <CameraController />
    </Canvas>
  );
}
