"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { ChairModel } from "./furniture/chairs";
import { DeskModel } from "./furniture/desks";
import { KeyboardSet, Lamp, Monitors } from "./furniture/devices";
import { Plant } from "./furniture/plant";
import { Poster } from "./furniture/poster";
import { Room } from "./room";

/**
 * The orbitable 3D workspace. Reads the shared zustand store, so it stays in
 * sync with the catalog panel and re-renders with pop animations on change.
 */
export default function CanvasInner() {
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const accessories = useWorkspaceStore((s) => s.accessories);

  const [interacted, setInteracted] = useState(false);

  const monitorCount = Math.min(accessories["acc-monitor"] ?? 0, 3);
  const hasLamp = (accessories["acc-lamp"] ?? 0) > 0;
  const hasPlant = (accessories["acc-plant"] ?? 0) > 0;
  const hasKeyboard = (accessories["acc-keyboard"] ?? 0) > 0;
  const hasPoster = (accessories["acc-poster"] ?? 0) > 0;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3.4, 2.3, 4.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* soft warm interior lighting */}
      <hemisphereLight args={["#fff5e6", "#8a7a66", 0.55]} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} />
      <directionalLight position={[-3, 3, -2]} intensity={0.25} />
      <ambientLight intensity={0.15} />

      <Room />
      <DeskModel id={deskId} />
      <ChairModel id={chairId} />
      {monitorCount > 0 && <Monitors count={monitorCount} />}
      {hasLamp && <Lamp />}
      {hasKeyboard && <KeyboardSet />}
      {hasPlant && <Plant />}
      {hasPoster && <Poster />}

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.4}
        scale={9}
        blur={2.2}
        far={3}
        resolution={512}
      />

      <OrbitControls
        makeDefault
        target={[0.2, 0.72, -0.1]}
        enablePan={false}
        minDistance={2.2}
        maxDistance={7.5}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 - 0.04}
        autoRotate={!interacted}
        autoRotateSpeed={0.7}
        enableDamping
        dampingFactor={0.08}
        onStart={() => setInteracted(true)}
      />
    </Canvas>
  );
}
