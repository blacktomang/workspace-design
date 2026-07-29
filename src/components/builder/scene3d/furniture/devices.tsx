"use client";

import { RoundedBox } from "@react-three/drei";
import { MONITOR_IDS, useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";
import { DESK_CENTER, DESK_TOP_Y } from "./desks";
import { Clickable } from "./clickable";

const SCREEN_COLORS = ["#46b39a", "#e8913f"];

/** Single monitor positioned at desk center; cycles between 27" and 34" types. */
export function Monitors({ id }: { id: string }) {
  const setMonitor = useWorkspaceStore((s) => s.setMonitor);
  const cycle = () => {
    const idx = MONITOR_IDS.indexOf(id as typeof MONITOR_IDS[number]);
    setMonitor(MONITOR_IDS[(idx + 1) % MONITOR_IDS.length]);
  };

  const isUltrawide = id === "acc-monitor-34";

  return (
    <Clickable onSwap={cycle} label="monitor">
      <MonitorModel
        position={[DESK_CENTER[0], DESK_TOP_Y, DESK_CENTER[2] - 0.12]}
        accent={isUltrawide ? SCREEN_COLORS[1] : SCREEN_COLORS[0]}
        ultrawide={isUltrawide}
      />
    </Clickable>
  );
}

function MonitorModel({
  position,
  accent,
  ultrawide,
}: {
  position: [number, number, number];
  accent: string;
  ultrawide: boolean;
}) {
  const ref = usePopIn("monitor");
  const sw = ultrawide ? 0.82 : 0.62;
  const sh = ultrawide ? 0.32 : 0.36;
  const screenW = ultrawide ? 0.78 : 0.58;
  const screenH = ultrawide ? 0.28 : 0.32;

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[0.2, 0.015, 0.16]} radius={0.005} position={[0, 0.008, 0]}>
        <meshStandardMaterial color="#1c1c20" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.03]} />
        <meshStandardMaterial color="#1c1c20" roughness={0.4} />
      </mesh>
      <RoundedBox args={[sw, sh, 0.025]} radius={0.008} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#1c1c20" roughness={0.4} />
      </RoundedBox>
      {/* glowing screen */}
      <mesh position={[0, 0.4, 0.014]}>
        <planeGeometry args={[screenW, screenH]} />
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

/** Tall LED bar lamp — light shines over the monitor screen. */
export function Lamp() {
  const ref = usePopIn("lamp");
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);
  const hasMonitor = useWorkspaceStore(
    (s) => (s.accessories["acc-monitor-27"] ?? 0) + (s.accessories["acc-monitor-34"] ?? 0) > 0
  );

  // Position to the right of the monitor, tall enough to clear the screen
  const lampX = hasMonitor ? DESK_CENTER[0] + 0.52 : DESK_CENTER[0] + 0.58;

  return (
    <Clickable onSwap={() => removeAccessory("acc-lamp")} label="lamp">
      <group ref={ref} position={[lampX, DESK_TOP_Y, DESK_CENTER[2] - 0.12]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.07, 0.075, 0.02, 24]} />
          <meshStandardMaterial color="#26262b" roughness={0.4} />
        </mesh>
        {/* tall stem — clears monitor height (~0.76) so light shines over */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.82, 8]} />
          <meshStandardMaterial color="#26262b" roughness={0.4} />
        </mesh>
        <RoundedBox args={[0.3, 0.025, 0.035]} radius={0.01} position={[-0.13, 0.84, 0]}>
          <meshStandardMaterial color="#26262b" roughness={0.4} />
        </RoundedBox>
        {/* light strip */}
        <mesh position={[-0.13, 0.825, 0]}>
          <boxGeometry args={[0.26, 0.006, 0.02]} />
          <meshStandardMaterial
            color="#ffe3a3"
            emissive="#ffe3a3"
            emissiveIntensity={1.6}
          />
        </mesh>
        <pointLight
          position={[-0.13, 0.76, 0.08]}
          intensity={2.2}
          distance={1.6}
          decay={2}
          color="#ffd489"
        />
      </group>
    </Clickable>
  );
}

/** Ergonomic laptop stand with an open laptop on it. */
export function LaptopStand() {
  const ref = usePopIn("laptop-stand");
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);

  return (
    <Clickable onSwap={() => removeAccessory("acc-laptop-stand")} label="laptop stand">
      <group ref={ref} position={[DESK_CENTER[0] - 0.45, DESK_TOP_Y, DESK_CENTER[2] - 0.12]}>
        {/* stand base */}
        <RoundedBox args={[0.28, 0.015, 0.22]} radius={0.005} position={[0, 0.008, 0]}>
          <meshStandardMaterial color="#8a939a" roughness={0.5} metalness={0.6} />
        </RoundedBox>
        {/* support arm */}
        <mesh position={[0, 0.16, -0.04]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.06, 0.28, 0.06]} />
          <meshStandardMaterial color="#8a939a" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* laptop base (keyboard deck, angled) */}
        <group position={[0, 0.32, -0.06]} rotation={[-0.25, 0, 0]}>
          <RoundedBox args={[0.3, 0.018, 0.2]} radius={0.004}>
            <meshStandardMaterial color="#c0c4c8" roughness={0.4} metalness={0.7} />
          </RoundedBox>
          {/* keyboard area */}
          <mesh position={[0, 0.011, 0.03]}>
            <boxGeometry args={[0.22, 0.004, 0.12]} />
            <meshStandardMaterial color="#2e3138" roughness={0.6} />
          </mesh>
          {/* trackpad */}
          <mesh position={[0, 0.011, -0.06]}>
            <boxGeometry args={[0.08, 0.004, 0.05]} />
            <meshStandardMaterial color="#c0c4c8" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
        {/* screen (angled up from base) */}
        <group position={[0, 0.33, -0.1]} rotation={[0.55, 0, 0]}>
          <RoundedBox args={[0.3, 0.2, 0.012]} radius={0.004}>
            <meshStandardMaterial color="#1c1c20" roughness={0.4} />
          </RoundedBox>
          {/* screen glow */}
          <mesh position={[0, 0, 0.008]}>
            <planeGeometry args={[0.27, 0.17]} />
            <meshStandardMaterial
              color="#0d1714"
              emissive="#7a6fd0"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
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
