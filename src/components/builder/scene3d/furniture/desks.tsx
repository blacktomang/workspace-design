"use client";

import { RoundedBox } from "@react-three/drei";
import { DESKS, useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";
import { Clickable } from "./clickable";

export const DESK_TOP_Y = 0.73;
export const DESK_CENTER: [number, number, number] = [0.2, 0, -1.65];

/** Desk that swaps variant with a pop animation; click cycles options. */
export function DeskModel({ id }: { id: string }) {
  const ref = usePopIn(id);
  const setDesk = useWorkspaceStore((s) => s.setDesk);

  const cycle = () => {
    const idx = DESKS.findIndex((d) => d.id === id);
    setDesk(DESKS[(idx + 1) % DESKS.length].id);
  };

  return (
    <Clickable onSwap={cycle} label="desk">
      <group ref={ref}>
        {id === "desk-standing" ? (
          <StandingDesk />
        ) : id === "desk-compact" ? (
          <CompactDesk />
        ) : (
          <WoodDesk />
        )}
      </group>
    </Clickable>
  );
}

/** Electrical Adjustable Desk — black top, T-legs (monis' hero product) */
function StandingDesk() {
  return (
    <group>
      <RoundedBox
        args={[1.4, 0.04, 0.7]}
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

/** Classic Office Desk — oak top, four legs, drawer unit */
function WoodDesk() {
  return (
    <group>
      <RoundedBox
        args={[1.4, 0.04, 0.7]}
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
        args={[1.1, 0.035, 0.6]}
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
