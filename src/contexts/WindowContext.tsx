import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  icon: string;
}

interface WindowContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appId: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  getActiveAppName: () => string;
}

const WindowContext = createContext<WindowContextType | null>(null);

const APP_DEFAULTS: Record<string, Omit<WindowState, 'id' | 'zIndex' | 'isMinimized' | 'isMaximized' | 'x' | 'y'>> = {
  about: { title: 'About Me', appId: 'about', width: 700, height: 500, minWidth: 500, minHeight: 400, icon: '👤' },
  projects: { title: 'Projects', appId: 'projects', width: 850, height: 600, minWidth: 600, minHeight: 450, icon: '📁' },
  terminal: { title: 'Terminal', appId: 'terminal', width: 720, height: 480, minWidth: 500, minHeight: 350, icon: '⬛' },
  contact: { title: 'Contact', appId: 'contact', width: 600, height: 450, minWidth: 450, minHeight: 350, icon: '✉️' },
  skills: { title: 'Skills', appId: 'skills', width: 750, height: 550, minWidth: 550, minHeight: 400, icon: '⚙️' },
};

let windowCounter = 0;
let zIndexCounter = 100;

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((appId: string) => {
    const existing = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existing) {
      zIndexCounter++;
      setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, zIndex: zIndexCounter } : w));
      setActiveWindowId(existing.id);
      return;
    }

    const minimized = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimized) {
      zIndexCounter++;
      setWindows(prev => prev.map(w => w.id === minimized.id ? { ...w, isMinimized: false, zIndex: zIndexCounter } : w));
      setActiveWindowId(minimized.id);
      return;
    }

    const defaults = APP_DEFAULTS[appId];
    if (!defaults) return;

    windowCounter++;
    zIndexCounter++;
    const offset = (windowCounter % 5) * 30;
    const id = `${appId}-${windowCounter}`;

    const newWindow: WindowState = {
      ...defaults,
      id,
      x: 120 + offset,
      y: 60 + offset,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        return { ...w, isMaximized: false, x: 120, y: 60, width: APP_DEFAULTS[w.appId]?.width || 700, height: APP_DEFAULTS[w.appId]?.height || 500 };
      }
      return { ...w, isMaximized: true, x: 0, y: 25, width: window.innerWidth, height: window.innerHeight - 25 - 68 };
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    zIndexCounter++;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter } : w));
    setActiveWindowId(id);
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y, isMaximized: false } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height, isMaximized: false } : w));
  }, []);

  const getActiveAppName = useCallback(() => {
    if (!activeWindowId) return 'Finder';
    const w = windows.find(w => w.id === activeWindowId);
    return w?.title || 'Finder';
  }, [activeWindowId, windows]);

  return (
    <WindowContext.Provider value={{
      windows, activeWindowId, openWindow, closeWindow, minimizeWindow,
      maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize, getActiveAppName,
    }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindows must be used within WindowProvider');
  return ctx;
}
