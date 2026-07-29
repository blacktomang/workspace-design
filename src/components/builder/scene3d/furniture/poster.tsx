"use client";

import { RoundedBox, useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { fileToCompressedDataUrl } from "@/lib/image";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { usePopIn } from "../use-pop-in";

const PLANE_W = 0.64;
const PLANE_H = 0.84;

function makePlaceholder() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 336;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 336);
  g.addColorStop(0, "#46b39a");
  g.addColorStop(1, "#7a6fd0");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 336);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("add your", 128, 158);
  ctx.fillText("poster", 128, 188);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Poster() {
  const ref = usePopIn("poster");
  const posterImage = useWorkspaceStore((s) => s.posterImage);
  const setPosterImage = useWorkspaceStore((s) => s.setPosterImage);
  const [loaded, setLoaded] = useState<{ src: string; tex: THREE.Texture } | null>(null);
  const placeholder = useMemo(() => makePlaceholder(), []);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer", "auto");

  useEffect(() => {
    if (!posterImage) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      const planeAspect = PLANE_W / PLANE_H;
      const imgAspect = img.width / img.height;
      if (imgAspect > planeAspect) {
        const sx = planeAspect / imgAspect;
        tex.repeat.set(sx, 1);
        tex.offset.set((1 - sx) / 2, 0);
      } else {
        const sy = imgAspect / planeAspect;
        tex.repeat.set(1, sy);
        tex.offset.set(0, (1 - sy) / 2);
      }
      tex.needsUpdate = true;
      // Free the previous upload's GPU texture before swapping.
      textureRef.current?.dispose();
      textureRef.current = tex;
      setLoaded({ src: posterImage, tex });
    };
    img.src = posterImage;
    return () => {
      cancelled = true;
    };
  }, [posterImage]);

  // Release GPU textures on unmount.
  useEffect(
    () => () => {
      textureRef.current?.dispose();
      placeholder.dispose();
    },
    [placeholder]
  );

  const map =
    posterImage && loaded?.src === posterImage ? loaded.tex : placeholder;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      // Same compression path as the catalog upload — raw dataURLs can
      // exceed the localStorage quota once persisted.
      fileToCompressedDataUrl(file)
        .then(setPosterImage)
        .catch(() => {
          /* unreadable image — keep the current poster */
        });
    };
    input.click();
  };

  return (
    <group
      ref={ref}
      position={[1.45, 1.55, -1.98]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[0.72, 0.92, 0.03]} radius={0.008}>
        <meshStandardMaterial color="#1f1f22" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}
