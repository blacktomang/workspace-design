"use client";

import { RoundedBox } from "@react-three/drei";
import { usePopIn } from "../use-pop-in";

export const DESK_TOP_Y = 0.73;
export const DESK_CENTER: [number, number, number] = [0.2, 0, -1.65];

/** Desk that swaps variant with a pop animation. */
export function DeskModel({ id }: { id: string }) {
  const ref = usePopIn(id);

  return (
    <group ref={ref}>
        {id === "desk-standing" ? (
          <MotorizedStandingDesk />
        ) : id === "desk-compact" ? (
          <CompactDesk />
        ) : (
          <WoodDesk />
        )}
      </group>
  );
}

/** Electrical Adjustable Desk — black top, T-legs (monis' hero product) */
function StandingDesk() {
  return (
    <group>
      <RoundedBox
        args={[1.8, 0.04, 0.7]}
        radius={0.01}
        creaseAngle={0.02}
        position={[DESK_CENTER[0], DESK_TOP_Y - 0.02, DESK_CENTER[2]]}
      >
        <meshStandardMaterial color="#202024" roughness={0.5} />
      </RoundedBox>
      {[-0.55, 0.55].map((dx) => (
        <group key={dx} position={[DESK_CENTER[0] + dx, 0, DESK_CENTER[2]]}>
          <mesh position={[0, 0.345, 0]}>
            <boxGeometry args={[0.07, 0.69, 0.07]} />
            <meshStandardMaterial color="#26262b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.07, 0.03, 0.55]} />
            <meshStandardMaterial color="#26262b" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* controller */}
      <mesh position={[DESK_CENTER[0] + 0.42, DESK_TOP_Y - 0.05, DESK_CENTER[2] + 0.3]}>
        <boxGeometry args={[0.12, 0.02, 0.06]} />
        <meshStandardMaterial color="#3a3a40" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Motorized Standing Desk Pro — premium dual-motor with digital display, grommets, side basket */
function MotorizedStandingDesk() {
  return (
    <group>
      {/* Desktop with rounded profile */}
      <RoundedBox
        args={[1.8, 0.04, 0.7]}
        radius={0.01}
        creaseAngle={0.02}
        position={[DESK_CENTER[0], DESK_TOP_Y - 0.02, DESK_CENTER[2]]}
      >
        <meshStandardMaterial color="#1E1E20" roughness={0.45} metalness={0.05} />
      </RoundedBox>

      {/* Left cable grommet ring */}
      <mesh position={[DESK_CENTER[0] - 0.35, DESK_TOP_Y - 0.0125, DESK_CENTER[2] - 0.2]}>
        <cylinderGeometry args={[0.024, 0.02, 0.028, 32]} />
        <meshStandardMaterial color="#151517" roughness={0.3} />
      </mesh>
      {/* Right cable grommet ring */}
      <mesh position={[DESK_CENTER[0] + 0.35, DESK_TOP_Y - 0.0125, DESK_CENTER[2] - 0.2]}>
        <cylinderGeometry args={[0.024, 0.02, 0.028, 32]} />
        <meshStandardMaterial color="#151517" roughness={0.3} />
      </mesh>

      {/* Under-frame crossbar */}
      <mesh position={[DESK_CENTER[0], DESK_TOP_Y - 0.03, DESK_CENTER[2] - 0.08]}>
        <boxGeometry args={[1.05, 0.035, 0.05]} />
        <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Mounting brackets */}
      <mesh position={[DESK_CENTER[0] - 0.5, DESK_TOP_Y - 0.02, DESK_CENTER[2] - 0.08]}>
        <boxGeometry args={[0.08, 0.02, 0.48]} />
        <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[DESK_CENTER[0] + 0.5, DESK_TOP_Y - 0.02, DESK_CENTER[2] - 0.08]}>
        <boxGeometry args={[0.08, 0.02, 0.48]} />
        <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Telescoping leg assemblies (left and right) */}
      {[-0.5, 0.5].map((legX) => (
        <group key={legX} position={[DESK_CENTER[0] + legX, 0, DESK_CENTER[2]]}>
          {/* Top collar housing */}
          <mesh position={[0, 0.67, 0]}>
            <boxGeometry args={[0.11, 0.06, 0.08]} />
            <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
          </mesh>
          {/* Outer silver column */}
          <mesh position={[0, 0.51, 0]}>
            <boxGeometry args={[0.07, 0.28, 0.07]} />
            <meshStandardMaterial color="#C0C4C8" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Inner silver column */}
          <mesh position={[0, 0.23, 0]}>
            <boxGeometry args={[0.06, 0.28, 0.06]} />
            <meshStandardMaterial color="#C0C4C8" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Foot connector bracket */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
          </mesh>
          {/* Foot base bar */}
          <mesh position={[0, 0.045, 0]}>
            <boxGeometry args={[0.08, 0.03, 0.68]} />
            <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
          </mesh>
          {/* Leveling pads (front and rear) */}
          <mesh position={[0, 0.012, 0.28]}>
            <cylinderGeometry args={[0.022, 0.025, 0.016, 16]} />
            <meshStandardMaterial color="#151517" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.012, -0.28]}>
            <cylinderGeometry args={[0.022, 0.025, 0.016, 16]} />
            <meshStandardMaterial color="#151517" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Digital control panel */}
      <mesh position={[DESK_CENTER[0] + 0.45, DESK_TOP_Y - 0.03, DESK_CENTER[2] + 0.32]}>
        <boxGeometry args={[0.13, 0.035, 0.055]} />
        <meshStandardMaterial color="#151517" roughness={0.3} />
      </mesh>
      {/* Control screen glass */}
      <mesh position={[DESK_CENTER[0] + 0.45, DESK_TOP_Y - 0.03, DESK_CENTER[2] + 0.348]}>
        <planeGeometry args={[0.12, 0.028]} />
        <meshPhysicalMaterial
          color="#0A0B0D"
          roughness={0.1}
          transmission={0.1}
          ior={1.52}
          thickness={0.002}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* UI backlight glow */}
      <mesh position={[DESK_CENTER[0] + 0.45, DESK_TOP_Y - 0.03, DESK_CENTER[2] + 0.349]}>
        <planeGeometry args={[0.11, 0.025]} />
        <meshStandardMaterial
          color="#E0E8FF"
          emissive="#60A0FF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Side wire basket holder (left) */}
      <mesh position={[DESK_CENTER[0] - 0.58, DESK_TOP_Y - 0.05, DESK_CENTER[2]]}>
        <boxGeometry args={[0.04, 0.03, 0.04]} />
        <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[DESK_CENTER[0] - 0.58, DESK_TOP_Y - 0.09, DESK_CENTER[2]]}>
        <boxGeometry args={[0.08, 0.03, 0.16]} />
        <meshStandardMaterial color="#18181A" roughness={0.35} metalness={0.2} />
      </mesh>
    </group>
  );
}

/** Classic Office Desk — oak top, four legs, drawer unit */
function WoodDesk() {
  return (
    <group>
      <RoundedBox
        args={[1.8, 0.04, 0.7]}
        radius={0.01}
        position={[DESK_CENTER[0], DESK_TOP_Y - 0.02, DESK_CENTER[2]]}
      >
        <meshStandardMaterial color="#c99e6f" roughness={0.65} />
      </RoundedBox>
      {[
        [-0.62, -0.28],
        [0.62, -0.28],
        [-0.62, 0.28],
        [0.62, 0.28],
      ].map(([dx, dz]) => (
        <mesh
          key={`${dx}${dz}`}
          position={[DESK_CENTER[0] + dx, 0.345, DESK_CENTER[2] + dz]}
        >
          <boxGeometry args={[0.05, 0.69, 0.05]} />
          <meshStandardMaterial color="#41372f" roughness={0.6} />
        </mesh>
      ))}
      {/* drawer unit */}
      <mesh position={[DESK_CENTER[0] + 0.42, 0.44, DESK_CENTER[2]]}>
        <boxGeometry args={[0.38, 0.5, 0.6]} />
        <meshStandardMaterial color="#b98a5f" roughness={0.7} />
      </mesh>
      {[0.52, 0.36].map((y) => (
        <mesh key={y} position={[DESK_CENTER[0] + 0.42, y, DESK_CENTER[2] + 0.306]}>
          <boxGeometry args={[0.22, 0.015, 0.012]} />
          <meshStandardMaterial color="#8a5a33" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** Compact Nomad Desk — white top, hairpin legs */
function CompactDesk() {
  return (
    <group>
      <RoundedBox
        args={[1.8, 0.035, 0.6]}
        radius={0.01}
        position={[DESK_CENTER[0], DESK_TOP_Y - 0.0175, DESK_CENTER[2]]}
      >
        <meshStandardMaterial color="#efe9dc" roughness={0.6} />
      </RoundedBox>
      {[
        [-0.48, -0.24, 0.06, 0.05],
        [0.48, -0.24, -0.06, 0.05],
        [-0.48, 0.24, 0.06, -0.05],
        [0.48, 0.24, -0.06, -0.05],
      ].map(([dx, dz, rz, rx]) => (
        <mesh
          key={`${dx}${dz}`}
          position={[DESK_CENTER[0] + dx, 0.35, DESK_CENTER[2] + dz]}
          rotation={[rx, 0, rz]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.71, 8]} />
          <meshStandardMaterial color="#3a352f" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
