// Realistic macOS-style app icons as SVG/CSS components
// Note: no linearGradient url() refs — they cause black-box artifacts when
// multiple SVGs share the same IDs in one document. Solid fills only.

export function FinderIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#3daef5"/>
      <g transform="translate(14, 10)">
        <path d="M46 12 Q20 12 16 38 Q14 52 18 64 Q22 78 34 84 Q40 87 46 87 L46 12Z" fill="#1a6fc4"/>
        <path d="M46 12 Q72 12 76 38 Q78 52 74 64 Q70 78 58 84 Q52 87 46 87 L46 12Z" fill="#e8e8e8"/>
        <ellipse cx="34" cy="42" rx="7" ry="9" fill="white"/>
        <ellipse cx="36" cy="42" rx="4" ry="6" fill="#1a1a3e"/>
        <ellipse cx="37" cy="40" rx="1.5" ry="1.5" fill="white"/>
        <ellipse cx="58" cy="42" rx="7" ry="9" fill="white"/>
        <ellipse cx="60" cy="42" rx="4" ry="6" fill="#1a1a3e"/>
        <ellipse cx="61" cy="40" rx="1.5" ry="1.5" fill="white"/>
        <line x1="46" y1="30" x2="46" y2="68" stroke="rgba(0,0,0,0.25)" strokeWidth="2"/>
        <path d="M30 62 Q38 72 46 68 Q54 72 62 62" fill="none" stroke="#1a1a3e" strokeWidth="3.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

export function ProjectsIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#4a9fe8"/>
      <path d="M18 42 L18 88 Q18 92 22 92 L98 92 Q102 92 102 88 L102 46 Q102 42 98 42 Z" fill="#6eb6f8"/>
      <path d="M18 42 L18 36 Q18 32 22 32 L50 32 Q54 32 56 36 L60 42 Z" fill="#6eb6f8"/>
      <path d="M18 52 L18 88 Q18 93 23 93 L97 93 Q102 93 102 88 L102 52 Z" fill="#9dd0ff"/>
      <path d="M22 52 L98 52 L98 58 Q60 64 22 58 Z" fill="rgba(255,255,255,0.18)"/>
    </svg>
  );
}

export function TerminalIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#1a1a2e"/>
      <rect x="4" y="4" width="112" height="112" rx="23" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <g transform="translate(24, 34)">
        <path d="M8 8 L26 26 L8 44" fill="none" stroke="#4ADE80" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="36" y1="44" x2="64" y2="44" stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

export function SkillsIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#5d7a87"/>
      <g transform="translate(60, 60)">
        <path d="M-8,-36 L8,-36 L10,-26 Q14,-25 17,-22 L26,-28 L36,-18 L28,-12 Q30,-8 30,-4 L40,-2 L40,10 L30,10 Q28,14 26,17 L32,26 L22,36 L14,28 Q10,30 6,30 L4,40 L-8,40 L-10,30 Q-14,28 -18,26 L-26,32 L-36,22 L-28,14 Q-30,10 -30,6 L-40,4 L-40,-8 L-30,-10 Q-28,-14 -26,-18 L-32,-26 L-22,-36 L-14,-28 Q-10,-30 -8,-30 Z" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
        <circle cx="0" cy="0" r="14" fill="#5d7a87"/>
        <circle cx="0" cy="0" r="10" fill="rgba(255,255,255,0.15)"/>
      </g>
    </svg>
  );
}

export function ContactIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#2e9cf5"/>
      <g transform="translate(16, 30)">
        <rect x="4" y="8" width="80" height="52" rx="6" fill="white" opacity="0.95"/>
        <path d="M4 14 L44 42 L84 14" fill="none" stroke="rgba(30,136,229,0.4)" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M10 8 L44 34 L78 8" fill="none" stroke="rgba(30,136,229,0.2)" strokeWidth="2"/>
      </g>
    </svg>
  );
}

export function ChromeIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#fff"/>
      <g transform="translate(14, 14)">
        <circle cx="46" cy="46" r="42" fill="#EA4335"/>
        <path d="M46 4 A42 42 0 0 1 82.4 67 L46 46Z" fill="#FBBC05"/>
        <path d="M82.4 67 A42 42 0 0 1 9.6 67 L46 46Z" fill="#34A853"/>
        <path d="M9.6 67 A42 42 0 0 1 46 4 L46 46Z" fill="#4285F4"/>
        <circle cx="46" cy="46" r="18" fill="#fff"/>
        <circle cx="46" cy="46" r="14" fill="#4285F4"/>
      </g>
    </svg>
  );
}

export function SafariIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#2fa8fa"/>
      <circle cx="60" cy="60" r="40" fill="none" stroke="white" strokeWidth="3" opacity="0.9"/>
      <polygon points="60,22 54,56 60,64 66,56" fill="#FF3B30" opacity="0.9"/>
      <polygon points="60,98 54,64 60,56 66,64" fill="white" opacity="0.9"/>
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
        <line
          key={angle}
          x1={60 + 36 * Math.cos((angle - 90) * Math.PI / 180)}
          y1={60 + 36 * Math.sin((angle - 90) * Math.PI / 180)}
          x2={60 + 40 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={60 + 40 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

export function MusicIcon() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#f0405c"/>
      <g transform="translate(30, 20)">
        <ellipse cx="16" cy="72" rx="14" ry="10" fill="white" opacity="0.95"/>
        <ellipse cx="52" cy="64" rx="14" ry="10" fill="white" opacity="0.95"/>
        <rect x="28" y="8" width="4" height="64" fill="white" opacity="0.95" rx="2"/>
        <rect x="64" y="0" width="4" height="64" fill="white" opacity="0.95" rx="2"/>
        <rect x="28" y="4" width="40" height="10" fill="white" opacity="0.95" rx="3"/>
      </g>
    </svg>
  );
}

export function TrashIcon({ isEmpty = true }: { isEmpty?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect width="120" height="120" rx="26" fill="#7a9aaa"/>
      <g transform="translate(28, 18)">
        <rect x="8" y="8" width="48" height="6" rx="2" fill="white" opacity="0.9"/>
        <rect x="24" y="2" width="16" height="8" rx="3" fill="none" stroke="white" strokeWidth="2.5" opacity="0.9"/>
        <path d="M10 18 L14 82 Q14 86 18 86 L46 86 Q50 86 50 82 L54 18Z" fill="white" opacity="0.85"/>
        <line x1="24" y1="28" x2="24" y2="76" stroke="rgba(96,125,139,0.3)" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="32" y1="28" x2="32" y2="76" stroke="rgba(96,125,139,0.3)" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="40" y1="28" x2="40" y2="76" stroke="rgba(96,125,139,0.3)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
