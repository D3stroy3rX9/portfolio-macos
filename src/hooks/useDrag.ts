import { useCallback, useRef } from 'react';

interface UseDragOptions {
  onDrag: (x: number, y: number) => void;
  onDragEnd?: () => void;
  bounds?: { minX: number; minY: number; maxX: number; maxY: number };
}

export function useDrag({ onDrag, onDragEnd, bounds }: UseDragOptions) {
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    e.preventDefault();
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: e.clientX, y: e.clientY };

    const el = (e.target as HTMLElement).closest('.macos-window') as HTMLElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      startOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      let x = e.clientX - startOffset.current.x;
      let y = e.clientY - startOffset.current.y;
      if (bounds) {
        x = Math.max(bounds.minX, Math.min(bounds.maxX, x));
        y = Math.max(bounds.minY, Math.min(bounds.maxY, y));
      }
      y = Math.max(25, y); // Don't go above menu bar
      onDrag(x, y);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onDragEnd?.();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onDrag, onDragEnd, bounds]);

  return { handleMouseDown };
}
