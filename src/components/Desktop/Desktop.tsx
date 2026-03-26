import { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import Widgets from './Widgets';
import './Desktop.css';

const Spline = lazy(() => import('@splinetool/react-spline'));


interface DesktopIcon {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const desktopIcons: DesktopIcon[] = [
  {
    id: 'about',
    label: 'About Me',
    icon: (
      <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="10" fill="url(#di-about)"/>
        <circle cx="21" cy="16" r="6" fill="rgba(255,255,255,0.92)"/>
        <path d="M9 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="rgba(255,255,255,0.92)" strokeWidth="2.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="di-about" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="10" fill="url(#di-projects)"/>
        <rect x="8" y="15" width="26" height="19" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <rect x="8" y="9" width="12" height="8" rx="2" fill="rgba(255,255,255,0.85)"/>
        <path d="M8 20h26" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
        <path d="M13 26l4-3 4 4 4-3 4 3" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="di-projects" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6"/><stop offset="1" stopColor="#06b6d4"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="10" fill="url(#di-skills)"/>
        <circle cx="21" cy="21" r="11" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
        <circle cx="21" cy="21" r="11" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeDasharray="22 46" strokeLinecap="round"/>
        <circle cx="21" cy="21" r="4.5" fill="rgba(255,255,255,0.9)"/>
        <defs>
          <linearGradient id="di-skills" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4"/><stop offset="1" stopColor="#22c55e"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: (
      <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="10" fill="url(#di-terminal)"/>
        <rect x="7" y="10" width="28" height="22" rx="4" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <path d="M12 17l5 4-5 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 25h10" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
        <defs>
          <linearGradient id="di-terminal" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b"/><stop offset="1" stopColor="#0f172a"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="10" fill="url(#di-contact)"/>
        <rect x="7" y="12" width="28" height="19" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <path d="M7 17l14 9 14-9" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="di-contact" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899"/><stop offset="1" stopColor="#7c3aed"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

const BASE_SIZE = 52;
const MAX_SIZE  = 72;
const RADIUS    = 120;

export default function Desktop() {
  const { openWindow, windows } = useWindows();
  const [mouseY, setMouseY]       = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasOpenWindows = windows.some(w => !w.isMinimized);

  const isOpen = (id: string) => windows.some(w => w.appId === id && !w.isMinimized);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseY(e.clientY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseY(null);
    setHoveredId(null);
  }, []);

  const getIconSize = useCallback((index: number): number => {
    if (mouseY === null) return BASE_SIZE;
    const el = itemRefs.current[index];
    if (!el) return BASE_SIZE;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const dist = Math.abs(mouseY - centerY);
    if (dist > RADIUS) return BASE_SIZE;
    const ratio = dist / RADIUS;
    const scale = 1 + ((MAX_SIZE / BASE_SIZE) - 1) * Math.pow(Math.cos((ratio * Math.PI) / 2), 1.4);
    return BASE_SIZE * scale;
  }, [mouseY]);

  return (
    <div className="desktop">

      {/* Widgets */}
      <Widgets />

      {/* Spline robot — centered, in front of shader, behind windows */}
      <div className="desktop-spline">
        <Suspense fallback={null}>
          <Spline scene="https://prod.spline.design/cpL-FiPDUMIkOZ-q/scene.splinecode" />
        </Suspense>
      </div>

      {/* Desktop icons — right column */}
      <div
        className="desktop-icons"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {desktopIcons.map((item, index) => {
          const size = getIconSize(index);
          const open = isOpen(item.id);
          return (
            <div
              key={item.id}
              ref={el => { itemRefs.current[index] = el; }}
              className="desktop-icon-slot"
            >
              <div
                className="desktop-icon"
                style={{ marginBottom: `${(size - BASE_SIZE) * 0.5}px` }}
                onClick={() => openWindow(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {hoveredId === item.id && (
                  <div className="desktop-icon-tooltip">{item.label}</div>
                )}
                <div className="desktop-icon-img" style={{ width: size, height: size }}>
                  {item.icon}
                </div>
                <span
                  className="desktop-icon-label"
                  style={{ opacity: hoveredId === item.id ? 0 : 1 }}
                >
                  {item.label}
                </span>
                {open && <div className="desktop-icon-dot" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Name card — bottom-right corner */}
      {!hasOpenWindows && (
        <div className="desktop-greeting">
          <h1>Amrit Sinha</h1>
          <p>SAP Hybris Backend Dev &middot; AI Tools Enthusiast</p>
          <p className="greeting-hint">Click an icon or use the dock below</p>
        </div>
      )}
    </div>
  );
}
