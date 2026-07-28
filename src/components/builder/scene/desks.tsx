export function Desk({ id }: { id: string }) {
  switch (id) {
    case "desk-bamboo":
      return <BambooDesk />;
    case "desk-compact":
      return <CompactDesk />;
    default:
      return <OakDesk />;
  }
}

/** Sunset Oak — warm top, dark legs, drawer unit */
function OakDesk() {
  return (
    <g>
      <rect x="288" y="366" width="14" height="158" rx="4" fill="#41372f" />
      <rect x="598" y="366" width="14" height="158" rx="4" fill="#41372f" />
      {/* drawer unit */}
      <rect x="512" y="376" width="92" height="76" rx="6" fill="#cf9459" />
      <rect x="524" y="390" width="68" height="5" rx="2.5" fill="#8a5a33" />
      <rect x="524" y="416" width="68" height="5" rx="2.5" fill="#8a5a33" />
      {/* top */}
      <rect x="266" y="350" width="368" height="16" rx="6" fill="#d9a066" />
      <rect x="266" y="362" width="368" height="5" rx="2" fill="#bd8450" />
    </g>
  );
}

/** Bamboo standing desk — light top, T-legs with feet */
function BambooDesk() {
  return (
    <g>
      <rect x="258" y="508" width="92" height="13" rx="6" fill="#6e6258" />
      <rect x="550" y="508" width="92" height="13" rx="6" fill="#6e6258" />
      <rect x="294" y="363" width="16" height="112" rx="6" fill="#6e6258" />
      <rect x="590" y="363" width="16" height="112" rx="6" fill="#6e6258" />
      {/* crossbar */}
      <rect x="310" y="470" width="280" height="8" rx="4" fill="#7d7166" />
      {/* top */}
      <rect x="266" y="348" width="368" height="16" rx="6" fill="#e3c98f" />
      <rect x="266" y="360" width="368" height="5" rx="2" fill="#c9ab6d" />
    </g>
  );
}

/** Compact nomad — small white top, hairpin legs */
function CompactDesk() {
  return (
    <g>
      <g stroke="#41372f" strokeWidth="5" strokeLinecap="round">
        <line x1="326" y1="364" x2="314" y2="522" />
        <line x1="348" y1="364" x2="342" y2="522" />
        <line x1="552" y1="364" x2="558" y2="522" />
        <line x1="574" y1="364" x2="586" y2="522" />
      </g>
      <rect x="306" y="350" width="288" height="14" rx="6" fill="#efe9dc" />
      <rect x="306" y="360" width="288" height="4" rx="2" fill="#d8cfba" />
    </g>
  );
}
