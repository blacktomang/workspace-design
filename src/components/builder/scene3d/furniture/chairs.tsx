"use client";

import { RoundedBox } from "@react-three/drei";
import { CHAIRS, useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";
import { Clickable } from "./clickable";

const CHAIR_POS: [number, number, number] = [0.2, 0, 0.45];

export function ChairModel({ id }: { id: string }) {
  const ref = usePopIn(id);
  const setChair = useWorkspaceStore((s) => s.setChair);

  const cycle = () => {
    const idx = CHAIRS.findIndex((c) => c.id === id);
    setChair(CHAIRS[(idx + 1) % CHAIRS.length].id);
  };

  return (
    <Clickable onSwap={cycle} label="chair">
      <group ref={ref} position={CHAIR_POS} rotation={[0, Math.PI, 0]}>
        {id === "chair-task" ? (
          <TaskChair />
        ) : id === "chair-stool" ? (
          <StudioStool />
        ) : (
          <ErgoChair />
        )}
      </group>
    </Clickable>
  );
}

function CasterBase({ color }: { color: string }) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.13, 0.06, 0]}>
              <boxGeometry args={[0.26, 0.025, 0.05]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            <mesh position={[0.26, 0.03, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.32, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Ergonomic Office Chair — black mesh, headrest, lumbar accent */
function ErgoChair() {
  return (
    <group>
      <CasterBase color="#26262b" />
      <RoundedBox args={[0.48, 0.07, 0.46]} radius={0.02} position={[0, 0.47, 0]}>
        <meshStandardMaterial color="#2e3138" roughness={0.7} />
      </RoundedBox>
      {/* armrests */}
      {[-0.26, 0.26].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.56, -0.05]}>
            <boxGeometry args={[0.04, 0.16, 0.04]} />
            <meshStandardMaterial color="#26262b" roughness={0.5} />
          </mesh>
          <RoundedBox args={[0.05, 0.025, 0.22]} radius={0.01} position={[x, 0.655, -0.02]}>
            <meshStandardMaterial color="#26262b" roughness={0.5} />
          </RoundedBox>
        </group>
      ))}
      {/* backrest + lumbar accent */}
      <RoundedBox args={[0.46, 0.55, 0.05]} radius={0.03} position={[0, 0.94, -0.22]} rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color="#2e3138" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.1, 0.055]} radius={0.02} position={[0, 0.82, -0.205]} rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color="#4c9a7f" roughness={0.6} />
      </RoundedBox>
      {/* headrest */}
      <RoundedBox args={[0.24, 0.11, 0.045]} radius={0.03} position={[0, 1.32, -0.26]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#2e3138" roughness={0.7} />
      </RoundedBox>
    </group>
  );
}

/** Bali Breeze Task Chair — light frame, teal mesh back */
function TaskChair() {
  return (
    <group>
      <CasterBase color="#8a939a" />
      <RoundedBox args={[0.48, 0.07, 0.46]} radius={0.02} position={[0, 0.47, 0]}>
        <meshStandardMaterial color="#9aa3aa" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.44, 0.52, 0.05]} radius={0.03} position={[0, 0.92, -0.22]} rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color="#6fa89e" roughness={0.7} />
      </RoundedBox>
      {[0.78, 0.9, 1.02].map((y) => (
        <mesh key={y} position={[0, y, -0.192]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.36, 0.015, 0.01]} />
          <meshStandardMaterial color="#5f8f88" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** Studio Stool — round wooden seat, splayed legs, foot ring */
function StudioStool() {
  return (
    <group>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.14, 0.22, Math.sin(a) * 0.14]}
            rotation={[Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18]}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.46, 8]} />
            <meshStandardMaterial color="#8a5a33" roughness={0.6} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.01, 8, 32]} />
        <meshStandardMaterial color="#8a5a33" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.23, 0.21, 0.05, 24]} />
        <meshStandardMaterial color="#c68b4e" roughness={0.6} />
      </mesh>
    </group>
  );
}
