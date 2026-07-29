export function Desk({ id }: { id: string }) {
  switch (id) {
    case "desk-standing":
      return <BambooDesk />;
    case "desk-motorized-standing":
      return <MotorizedStandingDesk />;
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

/** Motorized Standing Desk Pro — premium black, digital controller, grommets */
function MotorizedStandingDesk() {
  return (
    <g>
      {/* Crossbar connecting legs */}
      <rect x="310" y="470" width="280" height="8" rx="4" fill="#18181A" />
      {/* Upper leg tubes (silver) */}
      <rect x="298" y="363" width="14" height="90" rx="6" fill="#C0C4C8" />
      <rect x="588" y="363" width="14" height="90" rx="6" fill="#C0C4C8" />
      {/* Lower leg tubes (silver telescoping) */}
      <rect x="300" y="453" width="10" height="90" rx="4" fill="#C0C4C8" />
      <rect x="590" y="453" width="10" height="90" rx="4" fill="#C0C4C8" />
      {/* Leg foot connectors */}
      <rect x="294" y="543" width="16" height="6" rx="3" fill="#18181A" />
      <rect x="590" y="543" width="16" height="6" rx="3" fill="#18181A" />
      {/* Foot base bars */}
      <rect x="296" y="549" width="20" height="12" rx="4" fill="#18181A" />
      <rect x="588" y="549" width="20" height="12" rx="4" fill="#18181A" />
      {/* Cable grommet rings on desktop */}
      <circle cx="338" cy="356" r="4" fill="#151517" />
      <circle cx="566" cy="356" r="4" fill="#151517" />
      {/* Main desktop top */}
      <rect x="266" y="348" width="368" height="16" rx="6" fill="#1E1E20" />
      {/* Desktop edge highlight */}
      <rect x="266" y="360" width="368" height="5" rx="2" fill="#2a2a2e" />
      {/* Control panel with screen */}
      <rect x="586" y="332" width="32" height="26" rx="3" fill="#151517" />
      <rect x="588" y="334" width="28" height="14" rx="2" fill="#0A0B0D" />
      <rect x="589" y="335" width="26" height="12" rx="1.5" fill="#E0E8FF" fillOpacity="0.9" />
      {/* Side basket holder (left side) */}
      <rect x="268" y="360" width="6" height="10" fill="#18181A" />
      <rect x="266" y="370" width="10" height="4" fill="#18181A" />
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
