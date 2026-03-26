import { useCallback, useRef } from 'react';

interface UseResizeOptions {
  onResize: (width: number, height: number) => void;
  minWidth: number;
  minHeight: number;
  currentX: number;
  currentY: number;
}

type ResizeDirection = 'e' | 'w' | 's' | 'n' | 'se' | 'sw' | 'ne' | 'nw';

export function useResize({ onResize, minWidth, minHeight }: UseResizeOptions) {
  const startSize = useRef({ width: 0, height: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    const el = (e.target as HTMLElement).closest('.macos-window') as HTMLElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    startSize.current = { width: rect.width, height: rect.height };
    startPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      if (direction.includes('e')) newWidth = startSize.current.width + dx;
      if (direction.includes('s')) newHeight = startSize.current.height + dy;
      if (direction.includes('w')) newWidth = startSize.current.width - dx;
      if (direction.includes('n')) newHeight = startSize.current.height - dy;

      newWidth = Math.max(minWidth, newWidth);
      newHeight = Math.max(minHeight, newHeight);

      onResize(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, minWidth, minHeight]);

  return { handleResizeStart };
}
