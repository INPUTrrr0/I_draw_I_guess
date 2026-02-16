import { forwardRef, useImperativeHandle } from 'react';
import { useCanvas } from '../hooks/useCanvas';

export interface DrawingGridRef {
  getCanvasDataUrl: () => string;
}

const DrawingGrid = forwardRef<DrawingGridRef>((_props, ref) => {
  const canvasWidth = 600;
  const canvasHeight = 480;
  const { canvasRef, clearCanvas, getCanvasDataUrl } = useCanvas({
    width: canvasWidth,
    height: canvasHeight,
    drawGrid: true,
  });

  useImperativeHandle(ref, () => ({
    getCanvasDataUrl,
  }));

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-2 border-gray-300 rounded-lg w-full h-auto cursor-crosshair bg-white shadow-md"
        />
        <button
          onClick={clearCanvas}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg font-semibold"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
});

DrawingGrid.displayName = 'DrawingGrid';

export default DrawingGrid;
