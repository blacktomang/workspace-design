export function Chair({ id }: { id: string }) {
  switch (id) {
    case "chair-breeze":
      return <BreezeChair />;
    case "chair-studio":
      return <StudioStool />;
    default:
      return <ErgoChair />;
  }
}

function CasterBase({ color }: { color: string }) {
  return (
    <g>
      <g stroke={color} strokeWidth="6" strokeLinecap="round">
        <line x1="450" y1="512" x2="408" y2="536" />
        <line x1="450" y1="512" x2="450" y2="540" />
        <line x1="450" y1="512" x2="492" y2="536" />
      </g>
      <circle cx="408" cy="540" r="6" fill={color} />
      <circle cx="450" cy="544" r="6" fill={color} />
      <circle cx="492" cy="540" r="6" fill={color} />
      <rect x="444" y="470" width="12" height="46" rx="4" fill={color} />
    </g>
  );
}

/** Ergo Flow — high-back task chair with headrest + lumbar accent */
function ErgoChair() {
  return (
    <g>
      <CasterBase color="#2b2b30" />
      <rect x="404" y="446" width="92" height="22" rx="10" fill="#3f4450" />
      {/* armrests */}
      <rect x="396" y="424" width="10" height="26" rx="4" fill="#2b2b30" />
      <rect x="494" y="424" width="10" height="26" rx="4" fill="#2b2b30" />
      <rect x="390" y="416" width="22" height="9" rx="4" fill="#2b2b30" />
      <rect x="488" y="416" width="22" height="9" rx="4" fill="#2b2b30" />
      {/* backrest + lumbar accent */}
      <rect x="414" y="322" width="72" height="128" rx="22" fill="#3f4450" />
      <rect x="414" y="392" width="72" height="16" className="fill-primary" opacity="0.85" />
      {/* headrest */}
      <rect x="426" y="296" width="48" height="24" rx="10" fill="#3f4450" />
    </g>
  );
}

/** Bali Breeze — light frame, breathable mesh back */
function BreezeChair() {
  return (
    <g>
      <CasterBase color="#9aa1a8" />
      <rect x="404" y="446" width="92" height="22" rx="10" fill="#8f979e" />
      {/* mesh back */}
      <rect x="418" y="330" width="64" height="118" rx="20" fill="#7fb3aa" />
      <g stroke="#5f8f88" strokeWidth="3" opacity="0.6">
        <line x1="424" y1="356" x2="476" y2="356" />
        <line x1="424" y1="378" x2="476" y2="378" />
        <line x1="424" y1="400" x2="476" y2="400" />
        <line x1="424" y1="422" x2="476" y2="422" />
      </g>
    </g>
  );
}

/** Studio Stool — simple wooden seat, no back */
function StudioStool() {
  return (
    <g>
      <g stroke="#8a5a33" strokeWidth="6" strokeLinecap="round">
        <line x1="450" y1="468" x2="412" y2="536" />
        <line x1="450" y1="468" x2="434" y2="540" />
        <line x1="450" y1="468" x2="466" y2="540" />
        <line x1="450" y1="468" x2="488" y2="536" />
      </g>
      <ellipse cx="450" cy="506" rx="34" ry="7" fill="none" stroke="#8a5a33" strokeWidth="4" />
      <ellipse cx="450" cy="462" rx="46" ry="14" fill="#c68b4e" />
      <ellipse cx="450" cy="457" rx="42" ry="11" fill="#d9a066" />
    </g>
  );
}
