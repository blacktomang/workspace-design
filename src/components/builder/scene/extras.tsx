/** Single monitor on the desk, centered. Variant matches `monitorId`. */
export function Monitors({ id }: { id: string }) {
  if (id === "acc-monitor-49-gaming") return <GamingMonitor />;
  return <StandardMonitor />;
}

function StandardMonitor() {
  return (
    <g className="scene-pop">
      <ellipse cx="450" cy="352" rx="20" ry="5" fill="#26262c" />
      <rect x="445" y="322" width="10" height="30" fill="#26262c" />
      <rect x="375" y="226" width="150" height="98" rx="9" fill="#26262c" />
      <rect x="383" y="234" width="134" height="82" rx="4" fill="url(#screenGrad)" />
      {/* code on screen */}
      <g fill="#9fe8c9" opacity="0.75">
        <rect x="394" y="246" width="44" height="5" rx="2" />
        <rect x="394" y="258" width="64" height="5" rx="2" />
        <rect x="394" y="270" width="30" height="5" rx="2" />
      </g>
      {/* screen glow in dark mode */}
      <rect
        x="383"
        y="234"
        width="134"
        height="82"
        rx="4"
        className="fill-primary opacity-0 dark:opacity-15"
      />
    </g>
  );
}

/** 49" curved ultra-wide — wider panel, flat base stand, accent LED. */
function GamingMonitor() {
  return (
    <g className="scene-pop">
      {/* flat base plate + neck */}
      <rect x="398" y="348" width="104" height="6" rx="3" fill="#16181b" />
      <rect x="445" y="316" width="10" height="34" fill="#16181b" />
      {/* ultra-wide curved panel */}
      <rect x="335" y="220" width="230" height="100" rx="10" fill="#1a1b1e" />
      <rect x="343" y="228" width="214" height="84" rx="5" fill="url(#screenGradGaming)" />
      {/* game HUD bars */}
      <g fill="#ffb3cd" opacity="0.7">
        <rect x="362" y="244" width="58" height="6" rx="3" />
        <rect x="362" y="258" width="88" height="6" rx="3" />
        <rect x="362" y="272" width="40" height="6" rx="3" />
      </g>
      {/* accent status LED */}
      <circle cx="450" cy="316" r="2.5" fill="#ff0055" />
      {/* screen glow in dark mode */}
      <rect
        x="343"
        y="228"
        width="214"
        height="84"
        rx="5"
        className="fill-primary opacity-0 dark:opacity-15"
      />
    </g>
  );
}

/** Tall desk lamp — stem reaches above the monitor so light shines over it. */
export function DeskLamp() {
  return (
    <g className="scene-pop">
      {/* light cone — brighter in dark mode, wider for taller lamp */}
      <polygon points="610,238 552,352 668,352" fill="#ffd98a" className="opacity-15 dark:opacity-30" />
      <ellipse cx="618" cy="352" rx="20" ry="5" fill="#33323a" />
      {/* tall stem */}
      <line x1="618" y1="350" x2="650" y2="190" stroke="#33323a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="650" cy="190" r="6" fill="#33323a" />
      {/* horizontal arm */}
      <line x1="650" y1="190" x2="600" y2="170" stroke="#33323a" strokeWidth="6" strokeLinecap="round" />
      {/* shade + bulb */}
      <polygon points="578,148 606,156 614,178 586,170" fill="#33323a" />
      <circle cx="591" cy="164" r="6" fill="#ffd98a" />
    </g>
  );
}

/** Ergonomic laptop stand with an open laptop. */
export function LaptopStand() {
  return (
    <g className="scene-pop">
      {/* stand base */}
      <ellipse cx="310" cy="352" rx="18" ry="4" fill="#8a939a" />
      <rect x="304" y="332" width="12" height="20" rx="2" fill="#8a939a" />
      {/* laptop base (keyboard deck, tilted) */}
      <g transform="translate(310 328) rotate(-12)">
        <rect x="-48" y="0" width="96" height="8" rx="2" fill="#c0c4c8" />
        {/* keyboard */}
        <rect x="-38" y="2" width="52" height="3" rx="1" fill="#2e3138" />
        {/* trackpad */}
        <rect x="-12" y="6" width="16" height="2" rx="1" fill="#a0a4a8" />
      </g>
      {/* screen */}
      <g transform="translate(310 310) rotate(32)">
        <rect x="-48" y="-32" width="96" height="64" rx="3" fill="#1c1c20" />
        <rect x="-42" y="-28" width="84" height="52" rx="2" fill="#7a6fd0" opacity="0.3" />
        {/* code lines on screen */}
        <g fill="#d4c8f0" opacity="0.6">
          <rect x="-38" y="-22" width="30" height="3" rx="1" />
          <rect x="-38" y="-16" width="50" height="3" rx="1" />
          <rect x="-38" y="-10" width="20" height="3" rx="1" />
        </g>
      </g>
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
