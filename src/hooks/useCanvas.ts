import { useRef, useEffect, useCallback } from 'react';

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  clearCanvas: () => void;
  getCanvasDataUrl: () => string;
}

interface UseCanvasOptions {
  width: number;
  height: number;
  drawGrid?: boolean;
}

export const useCanvas = (options?: UseCanvasOptions): UseCanvasReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  const width = options?.width || 600;
  const height = options?.height || 480;
  const drawGrid = options?.drawGrid || false;

  const getCanvasContext = useCallback((): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const drawGridLines = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx || !drawGrid) return;

    ctx.strokeStyle = '#94A3B8'; // gray-400 for better visibility
    ctx.lineWidth = 1;

    // Horizontal lines (3 lines to create 4 rows)
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines (4 lines to create 5 columns)
    for (let i = 1; i < 5; i++) {
      const x = (width / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }, [getCanvasContext, drawGrid, width, height]);

  const getCoordinates = useCallback(
    (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event instanceof TouchEvent && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        return null;
      }

      // Scale coordinates from display size to canvas size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const coords = getCoordinates(event);
      if (!coords) return;

      isDrawingRef.current = true;
      lastPositionRef.current = coords;
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      event.preventDefault();

      const ctx = getCanvasContext();
      const coords = getCoordinates(event);

      if (!ctx || !coords || !lastPositionRef.current) return;

      ctx.beginPath();
      ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPositionRef.current = coords;
    },
    [getCanvasContext, getCoordinates]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPositionRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw grid lines after clearing
    drawGridLines();
  }, [getCanvasContext, drawGridLines]);

  const getCanvasDataUrl = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize canvas with white background
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines after background
      drawGridLines();
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing, drawGridLines]);

  return { canvasRef, isDrawing: false, clearCanvas, getCanvasDataUrl };
};
