import { forwardRef, useImperativeHandle } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useLanguage } from '../context/LanguageContext';

export interface DrawingGridRef {
  getCanvasDataUrl: () => string;
  clearCanvas: () => void;
}

interface DrawingGridProps {
  singleCellMode?: boolean;
  cellIndex?: number;
}

const DrawingGrid = forwardRef<DrawingGridRef, DrawingGridProps>((props, ref) => {
  const { singleCellMode = false, cellIndex = 0 } = props;
  const { t } = useLanguage();

  // Single cell: square canvas (300x300)
  // Full grid: 600x480 (4x5 grid)
  const canvasWidth = singleCellMode ? 300 : 600;
  const canvasHeight = singleCellMode ? 300 : 480;

  const { canvasRef, clearCanvas, getCanvasDataUrl } = useCanvas({
    width: canvasWidth,
    height: canvasHeight,
    drawGrid: !singleCellMode, // Only show grid lines in full mode
  });

  useImperativeHandle(ref, () => ({
    getCanvasDataUrl,
    clearCanvas,
  }));

  const row = Math.floor(cellIndex / 5) + 1;
  const col = (cellIndex % 5) + 1;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {singleCellMode && (
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-gray-700">
            {t.game.cell} #{cellIndex + 1}
          </p>
          <p className="text-sm text-gray-500">
            {t.game.row} {row}, {t.game.column} {col}
          </p>
        </div>
      )}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-2 border-gray-300 rounded-lg w-full h-auto cursor-crosshair bg-white shadow-md"
        />
        <button
          onClick={clearCanvas}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg font-semibold text-sm"
        >
          {t.common.clear}
        </button>
      </div>
    </div>
  );
});

DrawingGrid.displayName = 'DrawingGrid';

export default DrawingGrid;
