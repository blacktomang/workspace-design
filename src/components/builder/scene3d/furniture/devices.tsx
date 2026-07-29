"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";
import { DESK_CENTER, DESK_TOP_Y } from "./desks";
import { GamingMonitorModel } from "./gaming-monitor";

const SCREEN_COLORS = ["#46b39a", "#ff0055"];

function makeScreenTexture(accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 283;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const g = ctx.createLinearGradient(0, 0, 512, 283);
  g.addColorStop(0, accent);
  g.addColorStop(1, "#1a3d34");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 283);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 283);
    ctx.stroke();
  }
  for (let y = 0; y < 283; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Brand text
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "600 52px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("monis.rent", 256, 142);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Single monitor positioned at desk center. */
export function Monitors({ id }: { id: string }) {
  const isGamingUltraWide = id === "acc-monitor-49-gaming";

  return (
    <MonitorModel
      position={[DESK_CENTER[0], DESK_TOP_Y, DESK_CENTER[2] - 0.12]}
      accent={isGamingUltraWide ? SCREEN_COLORS[1] : SCREEN_COLORS[0]}
      ultrawide={isGamingUltraWide}
      gaming={isGamingUltraWide}
    />
  );
}

function MonitorModel({
  position,
  accent,
  ultrawide,
  gaming,
}: {
  position: [number, number, number];
  accent: string;
  ultrawide: boolean;
  gaming?: boolean;
}) {
  const ref = usePopIn("monitor");

  const monitorWidth = ultrawide ? 0.78 : 0.58;
  const monitorHeight = ultrawide ? 0.28 : 0.32;
  const bezelThickness = 0.025;
  const screenTex = useMemo(() => makeScreenTexture(accent), [accent]);

  if (gaming) {
    // Procedural curved ultra-wide gaming monitor (origin at base level)
    return (
      <group ref={ref} position={position}>
        <GamingMonitorModel accent={accent} />
      </group>
    );
  }

  return (
    <group ref={ref} position={position}>
      {/* Display assembly group */}
      <group>
        {/* Bezel frame */}
        <RoundedBox
          args={[monitorWidth + bezelThickness * 2, monitorHeight + bezelThickness * 2, 0.03]}
          radius={0.008}
          position={[0, 0.52, 0]}
        >
          <meshStandardMaterial color="#1c1c20" roughness={0.4} metalness={0.1} />
        </RoundedBox>

        {/* Screen panel - slightly inset */}
        <mesh position={[0, 0.52, 0.016]}>
          <planeGeometry args={[monitorWidth, monitorHeight]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>
      </group>

      {/* Stand assembly */}
      <group>
        {/* Circular base plate — sits flush on the desk */}
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.12, 0.125, 0.025, 32]} />
          <meshStandardMaterial color="#1c1c20" roughness={0.35} metalness={0.15} />
        </mesh>

        {/* Neck column — connects base to VESA bracket */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.045, 0.28, 0.04]} />
          <meshStandardMaterial color="#1c1c20" roughness={0.4} />
        </mesh>

        {/* Tilt/swivel joint at top of neck */}
        <mesh position={[0, 0.295, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.025, 16]} />
          <meshStandardMaterial color="#2a2a2f" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* VESA mounting bracket on the back of the display */}
        <RoundedBox
          args={[0.1, 0.1, 0.015]}
          radius={0.004}
          position={[0, 0.33, -0.022]}
        >
          <meshStandardMaterial color="#2a2a2f" roughness={0.5} />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Tall LED bar lamp — light shines over the monitor screen. */
export function Lamp() {
  const ref = usePopIn("lamp");
  const hasMonitor = useWorkspaceStore(
    (s) => (s.accessories["acc-monitor-27"] ?? 0) + (s.accessories["acc-monitor-34"] ?? 0) > 0
  );

  // Position to the right of the monitor, tall enough to clear the screen
  const lampX = hasMonitor ? DESK_CENTER[0] + 0.62 : DESK_CENTER[0] + 0.68;

  return (
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
  );
}

/** Ergonomic laptop stand with an open laptop on it. */
export function LaptopStand() {
  const ref = usePopIn("laptop-stand");

  return (
    <group ref={ref} position={[DESK_CENTER[0] - 0.7, DESK_TOP_Y, DESK_CENTER[2] + 0.18]}>
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
  );
}

/** Wireless keyboard + mouse + the mandatory coffee mug */
export function KeyboardSet() {
  const ref = usePopIn("keyboard");
  return (
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
  );
}
