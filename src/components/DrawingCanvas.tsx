import { memo, useEffect } from 'react';
import { useCanvas } from '../hooks/useCanvas';

interface DrawingCanvasProps {
  cellIndex: number;
  isActive: boolean;
  onSave: (index: number, dataUrl: string) => void;
  size?: number;
}

const DrawingCanvas = memo(({ cellIndex, isActive, onSave, size = 100 }: DrawingCanvasProps) => {
  const { canvasRef, clearCanvas, getCanvasDataUrl } = useCanvas();

  // Auto-save when cell becomes inactive (word changes)
  useEffect(() => {
    if (!isActive && canvasRef.current) {
      const dataUrl = getCanvasDataUrl();
      onSave(cellIndex, dataUrl);
    }
  }, [isActive, cellIndex, onSave, getCanvasDataUrl, canvasRef]);

  return (
    <div
      className={`relative border-2 rounded-lg overflow-hidden transition-all duration-300 ${
        isActive
          ? 'border-indigo-500 ring-4 ring-indigo-200 shadow-lg scale-105'
          : 'border-gray-300'
      }`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="block w-full h-full cursor-crosshair bg-white"
      />
      {isActive && (
        <button
          onClick={clearCanvas}
          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
