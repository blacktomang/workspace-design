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

function makeLaptopScreenTex() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, 0, 340);
  g.addColorStop(0, "#1a1a30");
  g.addColorStop(0.5, "#16213e");
  g.addColorStop(1, "#0f0f23");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 340);

  ctx.fillStyle = "rgba(122,111,208,0.12)";
  ctx.beginPath();
  ctx.arc(400, 80, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(70,179,154,0.08)";
  ctx.beginPath();
  ctx.arc(120, 260, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(0, 0, 512, 22);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath();
  ctx.roundRect(180, 288, 152, 38, 10);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  [228, 256, 284].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 307, 9, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Tue 14:28", 500, 15);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

const ALUMINUM = { color: "#c8ccd0", roughness: 0.22, metalness: 0.88 };
const ALUMINUM_DARK = { color: "#a0a5aa", roughness: 0.25, metalness: 0.82 };
const ALUMINUM_JOINT = { color: "#8a8f94", roughness: 0.35, metalness: 0.65 };
const ANTHRACITE = { color: "#1a1a1e", roughness: 0.5 };
const KEYCAP = { color: "#2c2d33", roughness: 0.55 };

export function LaptopStand() {
  const ref = usePopIn("laptop-stand");
  const screenTex = useMemo(() => makeLaptopScreenTex(), []);

  return (
    <group ref={ref} position={[DESK_CENTER[0] - 0.7, DESK_TOP_Y, DESK_CENTER[2] + 0.18]}>
      {/* ── Stand ─────────────────────────────────────────────── */}
      {/* Base plate */}
      <RoundedBox args={[0.24, 0.012, 0.19]} radius={0.006} position={[0, 0.006, 0]}>
        <meshStandardMaterial {...ALUMINUM_DARK} />
      </RoundedBox>

      {/* Main column */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.022, 0.028, 0.22, 20]} />
        <meshStandardMaterial {...ALUMINUM_DARK} />
      </mesh>

      {/* Height-adjust collar */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.014, 20]} />
        <meshStandardMaterial {...ALUMINUM_JOINT} />
      </mesh>

      {/* Horizontal arm */}
      <mesh position={[0, 0.25, 0.05]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[0.036, 0.032, 0.11]} />
        <meshStandardMaterial {...ALUMINUM_DARK} />
      </mesh>

      {/* Arm-to-tray joint */}
      <mesh position={[0, 0.28, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.022, 16]} />
        <meshStandardMaterial {...ALUMINUM_JOINT} />
      </mesh>

      {/* Laptop tray */}
      <RoundedBox args={[0.32, 0.008, 0.18]} radius={0.004} position={[0, 0.294, 0.1]}>
        <meshStandardMaterial {...ALUMINUM_DARK} />
      </RoundedBox>

      {/* ── Laptop ────────────────────────────────────────────── */}
      <group position={[0, 0.304, 0.1]}>
        {/* Rubber feet */}
        {[[-0.14, 0.07], [0.14, 0.07], [-0.14, -0.07], [0.14, -0.07]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.003, z]}>
            <cylinderGeometry args={[0.008, 0.008, 0.004, 8]} />
            <meshStandardMaterial color="#222" roughness={0.85} />
          </mesh>
        ))}

        {/* Bottom case */}
        <group position={[0, 0.012, 0]} rotation={[-0.06, 0, 0]}>
          {/* Unibody shell */}
          <RoundedBox args={[0.34, 0.016, 0.21]} radius={0.005}>
            <meshStandardMaterial {...ALUMINUM} />
          </RoundedBox>

          {/* Top deck inset */}
          <mesh position={[0, 0.008, 0]}>
            <boxGeometry args={[0.325, 0.002, 0.195]} />
            <meshStandardMaterial color="#bbb" roughness={0.28} metalness={0.82} />
          </mesh>

          {/* Keyboard well */}
          <mesh position={[0, 0.009, 0.04]}>
            <boxGeometry args={[0.27, 0.004, 0.13]} />
            <meshStandardMaterial color="#18191d" roughness={0.65} />
          </mesh>

          {/* Key rows */}
          {[0.06, 0.042, 0.024, 0.006, -0.012, -0.03].map((z, i) => (
            <mesh key={i} position={[0, 0.012, 0.04 + z]}>
              <boxGeometry args={[0.25, 0.002, 0.013]} />
              <meshStandardMaterial {...KEYCAP} />
            </mesh>
          ))}

          {/* Spacebar */}
          <mesh position={[0, 0.012, 0.02]}>
            <boxGeometry args={[0.08, 0.002, 0.009]} />
            <meshStandardMaterial {...KEYCAP} />
          </mesh>

          {/* Arrow cluster */}
          {[[-0.09, -0.01], [-0.08, -0.02], [-0.1, -0.02]].map(([x, z], i) => (
            <mesh key={`arr${i}`} position={[x, 0.012, 0.04 + z]}>
              <boxGeometry args={[0.014, 0.002, 0.007]} />
              <meshStandardMaterial {...KEYCAP} />
            </mesh>
          ))}

          {/* Trackpad */}
          <mesh position={[0, 0.009, -0.06]}>
            <boxGeometry args={[0.1, 0.003, 0.06]} />
            <meshStandardMaterial color="#c0c4c8" roughness={0.12} metalness={0.35} />
          </mesh>
        </group>

        {/* ── Hinge ──────────────────────────────────────── */}
        <mesh position={[0, 0.018, -0.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.29, 12]} />
          <meshStandardMaterial color="#3a3a40" roughness={0.4} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0.022, -0.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.27, 12]} />
          <meshStandardMaterial color="#2a2a2f" roughness={0.3} metalness={0.55} />
        </mesh>

        {/* ── Screen / Lid ───────────────────────────────── */}
        <group position={[0, 0.018, -0.09]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Lid back cover */}
          <RoundedBox args={[0.34, 0.23, 0.014]} radius={0.005}>
            <meshStandardMaterial {...ALUMINUM} />
          </RoundedBox>

          {/* Bezel frame */}
          <RoundedBox args={[0.32, 0.215, 0.005]} radius={0.003} position={[0, 0, 0.01]}>
            <meshStandardMaterial {...ANTHRACITE} />
          </RoundedBox>

          {/* Screen panel */}
          <mesh position={[0, 0, 0.014]}>
            <planeGeometry args={[0.3, 0.19]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} />
          </mesh>

          {/* Webcam dot */}
          <mesh position={[0, 0.105, 0.017]}>
            <cylinderGeometry args={[0.003, 0.003, 0.001, 8]} />
            <meshStandardMaterial color="#0a0a0f" roughness={0.5} />
          </mesh>
        </group>
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
