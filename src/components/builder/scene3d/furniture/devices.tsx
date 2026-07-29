"use client";

import { RoundedBox } from "@react-three/drei";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";
import { DESK_CENTER, DESK_TOP_Y } from "./desks";
import { Clickable } from "./clickable";

const SCREEN_COLORS = ["#46b39a", "#e8913f", "#7a6fd0"];

const MONITOR_LAYOUTS: Record<number, { x: number; ry: number }[]> = {
  1: [{ x: 0.2, ry: 0 }],
  2: [
    { x: -0.15, ry: 0.22 },
    { x: 0.55, ry: -0.22 },
  ],
  3: [
    { x: -0.42, ry: 0.38 },
    { x: 0.2, ry: 0 },
    { x: 0.82, ry: -0.38 },
  ],
};

export function Monitors({ count }: { count: number }) {
  const setAccessoryQty = useWorkspaceStore((s) => s.setAccessoryQty);
  const spots = MONITOR_LAYOUTS[Math.min(count, 3)] ?? [];

  const cycle = () => setAccessoryQty("acc-monitor", (count % 3) + 1);

  return (
    <Clickable onSwap={cycle} label="monitors">
      <group>
        {spots.map((s, i) => (
          <Monitor
            key={`${count}-${s.x}`}
            position={[s.x, DESK_TOP_Y, DESK_CENTER[2] - 0.12]}
            rotationY={s.ry}
            accent={SCREEN_COLORS[i % SCREEN_COLORS.length]}
            delay={i * 0.09}
            layoutKey={count}
          />
        ))}
      </group>
    </Clickable>
  );
}

function Monitor({
  position,
  rotationY,
  accent,
  delay,
  layoutKey,
}: {
  position: [number, number, number];
  rotationY: number;
  accent: string;
  delay: number;
  layoutKey: number;
}) {
  const ref = usePopIn(layoutKey, delay);
  return (
    <group ref={ref} position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[0.2, 0.015, 0.16]} radius={0.005} position={[0, 0.008, 0]}>
        <meshStandardMaterial color="#1c1c20" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.03]} />
        <meshStandardMaterial color="#1c1c20" roughness={0.4} />
      </mesh>
      <RoundedBox args={[0.62, 0.36, 0.025]} radius={0.008} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#1c1c20" roughness={0.4} />
      </RoundedBox>
      {/* glowing screen */}
      <mesh position={[0, 0.4, 0.014]}>
        <planeGeometry args={[0.58, 0.32]} />
        <meshStandardMaterial
          color="#0d1714"
          emissive={accent}
          emissiveIntensity={0.85}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/** Smart LED bar lamp with a warm light strip + point light */
export function Lamp() {
  const ref = usePopIn("lamp");
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);
  return (
    <Clickable onSwap={() => removeAccessory("acc-lamp")} label="lamp">
      <group ref={ref} position={[DESK_CENTER[0] + 0.58, DESK_TOP_Y, DESK_CENTER[2] - 0.12]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.07, 0.075, 0.02, 24]} />
          <meshStandardMaterial color="#26262b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
          <meshStandardMaterial color="#26262b" roughness={0.4} />
        </mesh>
        <RoundedBox args={[0.3, 0.025, 0.035]} radius={0.01} position={[-0.13, 0.435, 0]}>
          <meshStandardMaterial color="#26262b" roughness={0.4} />
        </RoundedBox>
        {/* light strip */}
        <mesh position={[-0.13, 0.42, 0]}>
          <boxGeometry args={[0.26, 0.006, 0.02]} />
          <meshStandardMaterial
            color="#ffe3a3"
            emissive="#ffe3a3"
            emissiveIntensity={1.6}
          />
        </mesh>
        <pointLight
          position={[-0.13, 0.36, 0.08]}
          intensity={2.2}
          distance={1.6}
          decay={2}
          color="#ffd489"
        />
      </group>
    </Clickable>
  );
}

/** Wireless keyboard + mouse + the mandatory coffee mug */
export function KeyboardSet() {
  const ref = usePopIn("keyboard");
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);
  return (
    <Clickable onSwap={() => removeAccessory("acc-keyboard")} label="keyboard">
      <group ref={ref} position={[DESK_CENTER[0], DESK_TOP_Y, DESK_CENTER[2] + 0.28]}>
        <RoundedBox args={[0.36, 0.018, 0.12]} radius={0.006} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#26262b" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.021, 0]}>
          <boxGeometry args={[0.32, 0.004, 0.08]} />
          <meshStandardMaterial color="#3a3a40" roughness={0.6} />
        </mesh>
        <RoundedBox args={[0.055, 0.02, 0.09]} radius={0.01} position={[0.32, 0.012, 0]}>
          <meshStandardMaterial color="#26262b" roughness={0.5} />
        </RoundedBox>
        {/* mug */}
        <group position={[-0.42, 0, -0.12]}>
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.035, 0.032, 0.09, 16]} />
            <meshStandardMaterial color="#e8913f" roughness={0.5} />
          </mesh>
          <mesh position={[0.045, 0.05, 0]}>
            <torusGeometry args={[0.02, 0.006, 8, 16]} />
            <meshStandardMaterial color="#e8913f" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </Clickable>
  );
}
