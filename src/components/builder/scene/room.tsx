export function Room() {
  return (
    <g>
      {/* wall + floor */}
      <rect x="0" y="0" width="900" height="430" className="fill-muted" opacity="0.45" />
      <rect x="0" y="430" width="900" height="190" fill="#d9b48c" />
      {[470, 510, 550, 590].map((y) => (
        <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#c8a276" strokeWidth="2" opacity="0.5" />
      ))}
      {/* baseboard */}
      <rect x="0" y="422" width="900" height="10" className="fill-border" />

      <Window />
      <WallArt />

      {/* rug */}
      <ellipse cx="450" cy="548" rx="315" ry="56" fill="#ecdfc9" />
      <ellipse cx="450" cy="548" rx="272" ry="42" fill="none" stroke="#dccbae" strokeWidth="3" strokeDasharray="10 8" />

      {/* soft shadow under furniture */}
      <ellipse cx="450" cy="530" rx="250" ry="24" fill="#6b543a" opacity="0.16" />
    </g>
  );
}

function Window() {
  return (
    <g>
      <rect x="64" y="64" width="240" height="260" rx="14" fill="#f7f2e9" />
      <clipPath id="windowClip">
        <rect x="76" y="76" width="216" height="236" rx="8" />
      </clipPath>
      <g clipPath="url(#windowClip)">
        <rect x="76" y="76" width="216" height="236" fill="url(#skyGrad)" />
        <circle cx="248" cy="122" r="24" fill="#ffd27a" />
        {/* sea */}
        <rect x="76" y="252" width="216" height="60" fill="#7cc3cf" opacity="0.9" />
        {/* palm silhouettes */}
        <g stroke="#2e6b4f" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M150 312 q6 -42 -6 -78" />
          <path d="M144 234 q-22 -14 -38 -6" />
          <path d="M144 234 q-6 -24 -24 -30" />
          <path d="M144 234 q14 -20 34 -18" />
          <path d="M144 234 q24 -8 36 6" />
        </g>
        <g stroke="#2e6b4f" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M196 312 q4 -30 -4 -56" />
          <path d="M192 256 q-16 -10 -28 -4" />
          <path d="M192 256 q-4 -18 -18 -22" />
          <path d="M192 256 q12 -14 26 -12" />
        </g>
      </g>
      {/* mullions */}
      <rect x="180" y="76" width="8" height="236" fill="#f7f2e9" />
      <rect x="76" y="188" width="216" height="8" fill="#f7f2e9" />
      {/* sill */}
      <rect x="56" y="318" width="256" height="10" rx="4" fill="#efe7d8" />
    </g>
  );
}

function WallArt() {
  return (
    <g>
      <rect x="652" y="80" width="168" height="128" rx="10" fill="#f7f2e9" />
      <rect x="664" y="92" width="144" height="104" rx="6" fill="#dcebe9" />
      <path d="M664 176 l42 -44 30 30 24 -20 48 54" fill="none" stroke="#6b8f71" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="772" cy="116" r="12" fill="#e8a25c" />
    </g>
  );
}
