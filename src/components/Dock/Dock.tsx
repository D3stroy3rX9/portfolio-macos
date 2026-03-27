import { useState, useCallback } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  FinderIcon, ProjectsIcon, TerminalIcon,
  SkillsIcon, ContactIcon, ChromeIcon, SafariIcon,
} from './DockIcons';
import './Dock.css';

interface DockItem {
  id: string;
  label: string;
  appId?: string;
  icon: React.ComponentType;
  isExternal?: string;
}

const dockItems: DockItem[] = [
  { id: 'finder',   label: 'About Me',  appId: 'about',    icon: FinderIcon },
  { id: 'projects', label: 'Projects',  appId: 'projects', icon: ProjectsIcon },
  { id: 'safari',   label: 'Links',     icon: SafariIcon,  isExternal: 'https://github.com/yourusername' },
  { id: 'chrome',   label: 'Resume',    icon: ChromeIcon,  isExternal: 'https://www.linkedin.com/in/amrit001/overlay/1767043411130/single-media-viewer/?profileId=ACoAAChvP5UBbRZnydgP0TCh-QNBxPlKdoRUvmU' },
  { id: 'skills',   label: 'Skills',    appId: 'skills',   icon: SkillsIcon },
  { id: 'terminal', label: 'Terminal',  appId: 'terminal', icon: TerminalIcon },
  { id: 'contact',  label: 'Contact',   appId: 'contact',  icon: ContactIcon },
];

const BASE_ICON_SIZE = 56;
const MAX_ICON_SIZE  = 86;
const DOCK_PADDING_H = 16;
const DOCK_GAP       = 6;

// Gaussian sigma — controls width of the magnification "bump".
// A Gaussian falloff (unlike a hard EFFECT_RADIUS cutoff) means icons
// approach BASE asymptotically so total dock width stays nearly constant
// as the mouse moves — no snapping, no wobble.
const SIGMA = 80; // wider bell = smoother wave across neighbouring icons

/** Pixel position of each icon's center when the dock is at base size. */
function getBaseIconCenters(): number[] {
  const totalWidth =
    dockItems.length * BASE_ICON_SIZE +
    (dockItems.length - 1) * DOCK_GAP +
    2 * DOCK_PADDING_H;
  const dockLeft = window.innerWidth / 2 - totalWidth / 2;
  return dockItems.map((_, i) =>
    dockLeft + DOCK_PADDING_H + i * (BASE_ICON_SIZE + DOCK_GAP) + BASE_ICON_SIZE / 2
  );
}

export default function Dock() {
  const { openWindow, windows } = useWindows();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleMouseMove  = useCallback((e: React.MouseEvent) => setMouseX(e.clientX), []);
  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  /**
   * Gaussian magnification — bell-curve falloff, no hard cutoff.
   * Disabled on mobile (touch devices have no hover/mousemove).
   */
  const getIconSize = useCallback((index: number): number => {
    if (isMobile || mouseX === null) return BASE_ICON_SIZE;
    const centers  = getBaseIconCenters();
    const d        = mouseX - centers[index];
    const strength = Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
    return BASE_ICON_SIZE + (MAX_ICON_SIZE - BASE_ICON_SIZE) * strength;
  }, [mouseX, isMobile]);

  const isAppOpen = (appId?: string) =>
    appId ? windows.some(w => w.appId === appId) : false;

  const handleClick = (item: DockItem) => {
    if (item.isExternal) window.open(item.isExternal, '_blank');
    else if (item.appId) openWindow(item.appId);
  };

  return (
    <div
      className="dock-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="dock">
        {dockItems.map((item, index) => {
          const size = getIconSize(index);
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="dock-slot"
              style={{ width: `${size}px` }}
            >
              <div className="dock-item" onClick={() => handleClick(item)}>
                <div className="dock-tooltip">{item.label}</div>
                <div
                  className="dock-icon-wrap"
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  <Icon />
                </div>
              </div>
              {isAppOpen(item.appId) && <div className="dock-indicator" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
