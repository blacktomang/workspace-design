"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";
import { Clickable } from "./clickable";
import { DESK_CENTER } from "./desks";

const LEAF_COLORS = ["#3f7d4e", "#57a05e", "#4c8f57"];

/** Monstera in a terracotta pot; leaves sway gently. */
export function Plant() {
  const popRef = usePopIn("plant");
  const swayRef = useRef<Group>(null);
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);

  useFrame(({ clock }) => {
    if (swayRef.current) {
      swayRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.02;
      swayRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.6) * 0.015;
    }
  });

  return (
    <Clickable onSwap={() => removeAccessory("acc-plant")} label="plant">
      <group ref={popRef} position={[DESK_CENTER[0] + 1.15, 0, DESK_CENTER[2] + 0.55]}>
        {/* pot */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.14, 0.11, 0.26, 24]} />
          <meshStandardMaterial color="#c0693f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} />
          <meshStandardMaterial color="#b25a3c" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.02, 24]} />
          <meshStandardMaterial color="#4a3a2c" roughness={1} />
        </mesh>
        {/* swaying leaves */}
        <group ref={swayRef} position={[0, 0.28, 0]}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const tilt = 0.35 + (i % 3) * 0.12;
            const height = 0.3 + (i % 2) * 0.12;
            return (
              <group key={i} rotation={[0, angle, 0]}>
                {/* stem */}
                <mesh position={[0, height / 2, 0]} rotation={[tilt, 0, 0]}>
                  <cylinderGeometry args={[0.007, 0.007, height, 6]} />
                  <meshStandardMaterial color="#3f7d4e" roughness={0.8} />
                </mesh>
                {/* leaf */}
                <mesh
                  position={[
                    0,
                    height * Math.cos(tilt) + 0.06,
                    height * Math.sin(tilt) + 0.05,
                  ]}
                  rotation={[tilt + 0.5, 0, 0]}
                  scale={[0.09, 0.19, 0.02]}
                >
                  <sphereGeometry args={[1, 12, 12]} />
                  <meshStandardMaterial
                    color={LEAF_COLORS[i % LEAF_COLORS.length]}
                    roughness={0.85}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
    </Clickable>
  );
}
