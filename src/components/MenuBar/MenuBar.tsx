import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindows } from '../../contexts/WindowContext';
import { useTheme } from '../../contexts/ThemeContext';
import './MenuBar.css';

interface MenuItem {
  label: string;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
  action?: () => void;
}

interface Menu {
  label: string;
  items: MenuItem[];
}

export default function MenuBar() {
  const { getActiveAppName, openWindow } = useWindows();
  const { theme, toggleTheme, isDark } = useTheme();
  const [time, setTime] = useState(new Date());
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openTray, setOpenTray] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setOpenTray(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const appName = getActiveAppName();

  const menus: Menu[] = [
    {
      label: 'File',
      items: [
        { label: 'New Window', shortcut: '⌘N', action: () => openWindow('about') },
        { label: 'Open Projects', shortcut: '⌘O', action: () => openWindow('projects') },
        { label: 'Open Terminal', shortcut: '⌘T', action: () => openWindow('terminal') },
        { label: '', divider: true },
        { label: 'Close Window', shortcut: '⌘W', disabled: true },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
        { label: '', divider: true },
        { label: 'Cut', shortcut: '⌘X', disabled: true },
        { label: 'Copy', shortcut: '⌘C', disabled: true },
        { label: 'Paste', shortcut: '⌘V', disabled: true },
        { label: 'Select All', shortcut: '⌘A', disabled: true },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'About Me', action: () => openWindow('about') },
        { label: 'Projects', action: () => openWindow('projects') },
        { label: 'Skills', action: () => openWindow('skills') },
        { label: 'Terminal', action: () => openWindow('terminal') },
        { label: 'Contact', action: () => openWindow('contact') },
        { label: '', divider: true },
        { label: 'Enter Full Screen', shortcut: '⌃⌘F', disabled: true },
      ],
    },
    {
      label: 'Go',
      items: [
        { label: 'GitHub', action: () => window.open('https://github.com/yourusername', '_blank') },
        { label: 'LinkedIn', action: () => window.open('https://linkedin.com/in/yourprofile', '_blank') },
        { label: '', divider: true },
        { label: 'Resume', disabled: true },
      ],
    },
    {
      label: 'Window',
      items: [
        { label: 'Minimize', shortcut: '⌘M', disabled: true },
        { label: 'Zoom', disabled: true },
        { label: '', divider: true },
        { label: 'Bring All to Front' },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Type "help" in Terminal', action: () => openWindow('terminal') },
        { label: '', divider: true },
        { label: 'About This Portfolio', action: () => openWindow('about') },
      ],
    },
  ];

  const handleMenuClick = useCallback((label: string) => {
    setOpenTray(null);
    setOpenMenu(prev => prev === label ? null : label);
  }, []);

  const handleMenuHover = useCallback((label: string) => {
    if (openMenu) { setOpenMenu(label); setOpenTray(null); }
  }, [openMenu]);

  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.disabled || item.divider) return;
    item.action?.();
    setOpenMenu(null);
  }, []);

  const handleTrayClick = useCallback((id: string) => {
    setOpenMenu(null);
    setOpenTray(prev => prev === id ? null : id);
  }, []);

  return (
    <div className="menubar" ref={menuRef}>
      <div className="menubar-left">
        {/* Apple logo */}
        <div className="menubar-apple" onClick={() => handleMenuClick('apple')} onMouseEnter={() => handleMenuHover('apple')}>
          <svg width="14" height="17" viewBox="0 0 14 17" fill="currentColor">
            <path d="M13.1 12.2c-.3.7-.4 1-.8 1.6-.5.8-1.2 1.9-2.1 1.9-.8 0-1-.5-2.1-.5s-1.3.5-2.1.5c-.9 0-1.5-1-2.1-1.8C2.4 11.7 1.6 8.4 3.2 6.3c.6-.8 1.5-1.2 2.4-1.3.8 0 1.6.6 2.1.6.5 0 1.4-.7 2.4-.6.4 0 1.5.2 2.2 1.3-2 1.2-1.7 4.2.3 5.2-.5.4-.6.5-.5.7zM9.6 3.3c.4-.5.7-1.2.6-1.9-.6 0-1.4.4-1.8 1-.4.5-.7 1.2-.6 1.9.7 0 1.4-.4 1.8-1z"/>
          </svg>
          {openMenu === 'apple' && (
            <div className="menubar-dropdown">
              <div className="dropdown-item" onClick={() => { openWindow('about'); setOpenMenu(null); }}>About This Portfolio</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => { openWindow('skills'); setOpenMenu(null); }}>System Preferences...</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item disabled">Sleep</div>
              <div className="dropdown-item disabled">Restart...</div>
              <div className="dropdown-item disabled">Shut Down...</div>
            </div>
          )}
        </div>

        <span className="menubar-appname" onClick={() => handleMenuClick(appName)} onMouseEnter={() => handleMenuHover(appName)}>
          {appName}
        </span>

        {menus.map(menu => (
          <div key={menu.label} className="menubar-menu-wrapper">
            <span
              className={`menubar-item ${openMenu === menu.label ? 'active' : ''}`}
              onClick={() => handleMenuClick(menu.label)}
              onMouseEnter={() => handleMenuHover(menu.label)}
            >
              {menu.label}
            </span>
            {openMenu === menu.label && (
              <div className="menubar-dropdown">
                {menu.items.map((item, i) =>
                  item.divider ? (
                    <div key={i} className="dropdown-divider" />
                  ) : (
                    <div
                      key={i}
                      className={`dropdown-item ${item.disabled ? 'disabled' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className="dropdown-shortcut">{item.shortcut}</span>}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="menubar-right">
        {/* Display / Brightness */}
        <div className="tray-icon" onClick={() => handleTrayClick('display')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 2.5v1.5M9 14v1.5M2.5 9H4M14 9h1.5M4.5 4.5l1 1M12.5 12.5l1 1M4.5 13.5l1-1M12.5 5.5l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
        {openTray === 'display' && (
          <div className="tray-panel" style={{ right: 180 }}>
            <div className="tray-panel-header">Display</div>
            <div className="tray-slider-row">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" opacity="0.5"><circle cx="7" cy="7" r="3"/></svg>
              <div className="tray-slider"><div className="tray-slider-fill" style={{ width: '72%' }} /></div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="7" r="3"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3 3l1.4 1.4M9.6 9.6l1.4 1.4M3 11l1.4-1.4M9.6 4.4l1.4-1.4" stroke="currentColor" strokeWidth="1"/></svg>
            </div>
            <div className="tray-panel-toggle">
              <span>True Tone</span>
              <div className="toggle-switch on"><div className="toggle-knob" /></div>
            </div>
            <div className="tray-panel-toggle">
              <span>Night Shift</span>
              <div className="toggle-switch"><div className="toggle-knob" /></div>
            </div>
          </div>
        )}

        {/* Focus */}
        <div className="tray-icon" onClick={() => handleTrayClick('focus')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.5L10.5 10" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        {/* WiFi */}
        <div className="tray-icon" onClick={() => handleTrayClick('wifi')}>
          <svg width="16" height="13" viewBox="0 0 16 13" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M1 4.5 A9.5 9.5 0 0 1 15 4.5" strokeWidth="1.4" opacity="0.5"/>
            <path d="M3.2 6.8 A6.5 6.5 0 0 1 12.8 6.8" strokeWidth="1.4" opacity="0.75"/>
            <path d="M5.5 9.1 A3.5 3.5 0 0 1 10.5 9.1" strokeWidth="1.4"/>
            <circle cx="8" cy="11.8" r="1.1" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        {openTray === 'wifi' && (
          <div className="tray-panel" style={{ right: 110 }}>
            <div className="tray-panel-header">Wi-Fi</div>
            <div className="tray-panel-toggle">
              <span>Wi-Fi</span>
              <div className="toggle-switch on"><div className="toggle-knob" /></div>
            </div>
            <div className="tray-panel-divider" />
            <div className="tray-panel-label">Known Networks</div>
            <div className="tray-network active">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="4"/></svg>
              <span>Amrit's Home WiFi</span>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" opacity="0.5"><path d="M10 2.5A5 5 0 002 2.5M8.5 4.5A3.2 3.2 0 003.5 4.5M7 6.5A1.5 1.5 0 005 6.5"/><circle cx="6" cy="8.2" r="0.8"/></svg>
            </div>
            <div className="tray-network">
              <span>Office_5G</span>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" opacity="0.3"><path d="M10 2.5A5 5 0 002 2.5M8.5 4.5A3.2 3.2 0 003.5 4.5"/><circle cx="6" cy="8.2" r="0.8"/></svg>
            </div>
            <div className="tray-network">
              <span>Starbucks_Free</span>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" opacity="0.2"><circle cx="6" cy="8.2" r="0.8"/></svg>
            </div>
            <div className="tray-panel-divider" />
            <div className="tray-panel-info">IP Address: 192.168.1.42</div>
          </div>
        )}

        {/* Battery */}
        <div className="tray-icon" onClick={() => handleTrayClick('battery')}>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="currentColor"><rect x="1" y="1" width="17" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="1.1"/><rect x="2.8" y="2.8" width="12.5" height="6.4" rx="0.8" fill="currentColor" opacity="0.85"/><path d="M19 4.2v3.6c.7-.2 1.2-.9 1.2-1.8s-.5-1.6-1.2-1.8z"/></svg>
        </div>
        {openTray === 'battery' && (
          <div className="tray-panel" style={{ right: 80 }}>
            <div className="tray-panel-header">Battery</div>
            <div className="tray-battery-visual">
              <div className="battery-big">
                <div className="battery-big-fill" style={{ width: '86%' }} />
              </div>
              <span className="battery-percent">86%</span>
            </div>
            <div className="tray-panel-info">Power Source: Battery</div>
            <div className="tray-panel-info">Time Remaining: 4:32</div>
            <div className="tray-panel-info">Condition: Normal</div>
            <div className="tray-panel-divider" />
            <div className="tray-panel-toggle">
              <span>Low Power Mode</span>
              <div className="toggle-switch"><div className="toggle-knob" /></div>
            </div>
          </div>
        )}

        {/* Spotlight Search */}
        <div className="tray-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5.8" cy="5.8" r="4.3"/><path d="M9 9l3.5 3.5" strokeLinecap="round"/></svg>
        </div>

        {/* Control Center */}
        <div className="tray-icon" onClick={() => handleTrayClick('cc')}>
          <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><rect x="0.5" y="0.5" width="5.5" height="5" rx="1.2"/><rect x="8" y="0.5" width="5.5" height="2.5" rx="1.2"/><rect x="0.5" y="7" width="5.5" height="4.5" rx="1.2"/><rect x="8" y="4.5" width="5.5" height="7" rx="1.2"/></svg>
        </div>
        {openTray === 'cc' && (
          <div className="tray-panel tray-panel-cc" style={{ right: 10 }}>
            <div className="tray-panel-header">Control Center</div>
            <div className="cc-grid">
              <div className="cc-tile on">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M14.5 5A6 6 0 003.5 5M12.5 7.2A4 4 0 005.5 7.2M10.5 9.4A2 2 0 007.5 9.4"/><circle cx="9" cy="11.5" r="1.1"/></svg>
                <span>Wi-Fi</span>
              </div>
              <div className="cc-tile on">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M9 3.5C6 3.5 3.5 6.2 3.5 9.5c0 2.5 1.8 4.5 4 5.2V16h3v-1.3c2.2-.7 4-2.7 4-5.2 0-3.3-2.5-6-5.5-6z" opacity="0.8"/><rect x="7.5" y="2" width="3" height="4" rx="1.5" fill="currentColor"/></svg>
                <span>Bluetooth</span>
              </div>
              <div className="cc-tile">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="12" height="10" rx="1.5"/><path d="M6 14v1.5M12 14v1.5M5 15.5h8"/></svg>
                <span>AirPlay</span>
              </div>
              <div className="cc-tile on">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="9" cy="9" r="6"/><path d="M9 5.5V9l2.5 1.5"/></svg>
                <span>Focus</span>
              </div>
            </div>

            <div className="tray-panel-divider" />

            {/* Theme Toggle */}
            <div className="tray-panel-label">Appearance</div>
            <div className="theme-toggle-row" onClick={toggleTheme}>
              <div className={`theme-option ${!isDark ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="currentColor"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>Light</span>
              </div>
              <div className={`theme-option ${isDark ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M17.3 12.3A7.5 7.5 0 017.7 2.7 8.5 8.5 0 1017.3 12.3z"/></svg>
                <span>Dark</span>
              </div>
            </div>

            <div className="tray-panel-divider" />
            <div className="tray-panel-label">Sound</div>
            <div className="tray-slider-row">
              <span style={{ fontSize: '11px', opacity: 0.5 }}>&#128264;</span>
              <div className="tray-slider"><div className="tray-slider-fill" style={{ width: '65%' }} /></div>
              <span style={{ fontSize: '11px' }}>&#128266;</span>
            </div>
            <div className="tray-panel-label">Brightness</div>
            <div className="tray-slider-row">
              <span style={{ fontSize: '11px', opacity: 0.5 }}>&#9728;</span>
              <div className="tray-slider"><div className="tray-slider-fill" style={{ width: '72%' }} /></div>
              <span style={{ fontSize: '11px' }}>&#9728;&#65039;</span>
            </div>
          </div>
        )}

        <span className="menubar-datetime">
          {formatDate(time)}&ensp;{formatTime(time)}
        </span>
      </div>
    </div>
  );
}
