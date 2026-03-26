import { type ReactNode, useCallback } from 'react';
import { useWindows, type WindowState } from '../../contexts/WindowContext';
import { useDrag } from '../../hooks/useDrag';
import { useResize } from '../../hooks/useResize';
import './Window.css';

interface WindowProps {
  windowState: WindowState;
  children: ReactNode;
}

export default function Window({ windowState, children }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize, activeWindowId } = useWindows();
  const { id, title, x, y, width, height, zIndex, isMinimized, isMaximized, minWidth, minHeight } = windowState;
  const isActive = activeWindowId === id;

  const onDrag = useCallback((newX: number, newY: number) => {
    updateWindowPosition(id, newX, newY);
  }, [id, updateWindowPosition]);

  const onResize = useCallback((newW: number, newH: number) => {
    updateWindowSize(id, newW, newH);
  }, [id, updateWindowSize]);

  const { handleMouseDown } = useDrag({ onDrag });
  const { handleResizeStart } = useResize({ onResize, minWidth, minHeight, currentX: x, currentY: y });

  if (isMinimized) return null;

  return (
    <div
      className={`macos-window ${isActive ? 'active' : 'inactive'} ${isMaximized ? 'maximized' : ''}`}
      style={{ left: x, top: y, width, height, zIndex }}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title bar */}
      <div className="window-titlebar" onMouseDown={handleMouseDown} onDoubleClick={() => maximizeWindow(id)}>
        <div className="window-controls">
          <button className="window-btn close" onClick={(e) => { e.stopPropagation(); closeWindow(id); }} title="Close">
            <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0 0L6 6M6 0L0 6" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button className="window-btn minimize" onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} title="Minimize">
            <svg width="8" height="2" viewBox="0 0 8 2"><path d="M0 1H8" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button className="window-btn maximize" onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }} title="Maximize">
            <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0 1.5C0 0.672 0.672 0 1.5 0H4.5C5.328 0 6 0.672 6 1.5V4.5C6 5.328 5.328 6 4.5 6H1.5C0.672 6 0 5.328 0 4.5V1.5Z" fill="currentColor"/></svg>
          </button>
        </div>
        <span className="window-title">{title}</span>
        <div className="window-controls-spacer" />
      </div>

      {/* Content */}
      <div className="window-content">
        {children}
      </div>

      {/* Resize handles */}
      {!isMaximized && (
        <>
          <div className="resize-handle resize-e" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          <div className="resize-handle resize-s" onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="resize-handle resize-se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
          <div className="resize-handle resize-w" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="resize-handle resize-n" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="resize-handle resize-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="resize-handle resize-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="resize-handle resize-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
        </>
      )}
    </div>
  );
}
