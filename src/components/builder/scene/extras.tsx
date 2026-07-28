const MONITOR_LAYOUTS: Record<number, { x: number; r: number }[]> = {
  1: [{ x: 450, r: 0 }],
  2: [
    { x: 388, r: 6 },
    { x: 512, r: -6 },
  ],
  3: [
    { x: 322, r: 9 },
    { x: 450, r: 0 },
    { x: 578, r: -9 },
  ],
};

export function Monitors({ count }: { count: number }) {
  const spots = MONITOR_LAYOUTS[Math.min(count, 3)] ?? [];
  return (
    <g>
      {spots.map((s, i) => (
        <g
          key={`${count}-${s.x}`}
          transform={`rotate(${s.r} ${s.x} 352)`}
          className="scene-pop"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <ellipse cx={s.x} cy="352" rx="20" ry="5" fill="#26262c" />
          <rect x={s.x - 5} y="322" width="10" height="30" fill="#26262c" />
          <rect x={s.x - 75} y="226" width="150" height="98" rx="9" fill="#26262c" />
          <rect x={s.x - 67} y="234" width="134" height="82" rx="4" fill="url(#screenGrad)" />
          {/* code on screen */}
          <g fill="#9fe8c9" opacity="0.75">
            <rect x={s.x - 56} y="246" width="44" height="5" rx="2" />
            <rect x={s.x - 56} y="258" width="64" height="5" rx="2" />
            <rect x={s.x - 56} y="270" width="30" height="5" rx="2" />
          </g>
          {/* screen glow in dark mode */}
          <rect
            x={s.x - 67}
            y="234"
            width="134"
            height="82"
            rx="4"
            className="fill-primary opacity-0 dark:opacity-15"
          />
        </g>
      ))}
    </g>
  );
}

export function DeskLamp() {
  return (
    <g className="scene-pop">
      {/* light cone — brighter in dark mode */}
      <polygon points="596,238 552,352 656,352" fill="#ffd98a" className="opacity-15 dark:opacity-30" />
      <ellipse cx="618" cy="352" rx="20" ry="5" fill="#33323a" />
      <line x1="618" y1="350" x2="652" y2="282" stroke="#33323a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="652" cy="282" r="6" fill="#33323a" />
      <line x1="652" y1="282" x2="606" y2="238" stroke="#33323a" strokeWidth="6" strokeLinecap="round" />
      {/* shade + bulb */}
      <polygon points="584,214 612,222 620,246 592,238" fill="#33323a" />
      <circle cx="597" cy="233" r="6" fill="#ffd98a" />
    </g>
  );
}

const LEAF_PATH =
  "M0 0 C-22 -6 -30 -34 -8 -52 C4 -62 18 -52 16 -36 C14 -18 8 -6 0 0 Z";

export function Plant() {
  return (
    <g className="scene-pop">
      {/* stems */}
      <g stroke="#3f7d4e" strokeWidth="4" strokeLinecap="round" fill="none">
        <line x1="705" y1="468" x2="705" y2="402" />
        <line x1="705" y1="468" x2="688" y2="414" />
        <line x1="705" y1="468" x2="722" y2="410" />
      </g>
      {/* leaves, gently swaying */}
      <g className="scene-sway">
        <path d={LEAF_PATH} transform="translate(705 400) scale(1.15)" fill="#3f7d4e" />
      </g>
      <g className="scene-sway" style={{ animationDelay: "-1.5s" }}>
        <path d={LEAF_PATH} transform="translate(688 412) rotate(-35) scale(0.9)" fill="#57a05e" />
      </g>
      <g className="scene-sway" style={{ animationDelay: "-3s" }}>
        <path d={LEAF_PATH} transform="translate(722 408) rotate(30) scale(0.95)" fill="#4c8f57" />
      </g>
      {/* pot */}
      <path d="M680 472 h50 l-6 52 h-38 z" fill="#c96f4a" />
      <rect x="676" y="464" width="58" height="12" rx="4" fill="#b25a3c" />
    </g>
  );
}

export function KeyboardSet() {
  return (
    <g className="scene-pop">
      {/* mug */}
      <rect x="372" y="342" width="14" height="14" rx="3" fill="#e8a25c" />
      <path d="M386 346 q8 3 0 8" fill="none" stroke="#e8a25c" strokeWidth="3" />
      {/* keyboard */}
      <rect x="410" y="350" width="88" height="13" rx="3" fill="#f3efe6" stroke="#d9d2c2" />
      <rect x="417" y="355" width="74" height="3" rx="1.5" fill="#d9d2c2" />
      {/* mouse */}
      <ellipse cx="530" cy="356" rx="11" ry="7" fill="#f3efe6" stroke="#d9d2c2" />
    </g>
  );
}
