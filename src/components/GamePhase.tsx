import { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import DrawingGrid, { DrawingGridRef } from './DrawingGrid';
import { combineCellsIntoGrid } from '../utils/canvasUtils';

const GamePhase = () => {
  const { state, dispatch } = useGame();
  const { timeLeft, startTimer } = useTimer();
  const { speak } = useSpeech({ rate: 0.9, pitch: 1, volume: 1 });
  const drawingGridRef = useRef<DrawingGridRef>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const currentWord = state.words[state.currentWordIndex];
  const isDigitalMode = state.config?.drawingMode === 'digital';

  // Detect mobile viewport changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Speak the word when it appears
  useEffect(() => {
    if (currentWord?.text) {
      speak(currentWord.text);
    }
  }, [currentWord?.text, speak]);

  useEffect(() => {
    // Start 3-second timer for current word
    startTimer(3, async () => {
      if (isDigitalMode && drawingGridRef.current) {
        const canvasDataUrl = drawingGridRef.current.getCanvasDataUrl();

        if (isMobile) {
          // On mobile: save individual cell drawing
          dispatch({
            type: 'SAVE_DRAWING',
            payload: { index: state.currentWordIndex, dataUrl: canvasDataUrl },
          });

          // If this is the last word, combine all cells into grid
          if (state.currentWordIndex === 19) {
            try {
              const updatedDrawings = [...state.drawings];
              updatedDrawings[19] = canvasDataUrl;
              const combinedGrid = await combineCellsIntoGrid(updatedDrawings);
              dispatch({ type: 'SAVE_CANVAS', payload: combinedGrid });
            } catch (error) {
              console.error('Failed to combine cell images:', error);
            }
          }
        } else {
          // On desktop: save full canvas only at the end
          if (state.currentWordIndex === 19) {
            dispatch({ type: 'SAVE_CANVAS', payload: canvasDataUrl });
          }
        }
      }
      dispatch({ type: 'NEXT_WORD' });
    });
  }, [state.currentWordIndex, state.drawings, dispatch, startTimer, isDigitalMode, isMobile]);

  // Clear canvas when moving to next word in mobile mode
  useEffect(() => {
    if (isMobile && isDigitalMode && drawingGridRef.current && state.currentWordIndex > 0) {
      drawingGridRef.current.clearCanvas();
    }
  }, [state.currentWordIndex, isMobile, isDigitalMode]);

  const gridPosition = state.currentWordIndex + 1;
  const row = Math.floor(state.currentWordIndex / 5) + 1;
  const col = (state.currentWordIndex % 5) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Word {state.currentWordIndex + 1} of 20
            </span>
            <span className="text-sm font-semibold text-orange-600">
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((state.currentWordIndex + 1) / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2 flex items-center justify-center gap-2">
              <span>Memorize and draw:</span>
              <span className="text-orange-600" title="Voiceover enabled">🔊</span>
            </p>
            <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text animate-fade-in">
              {currentWord?.text}
            </h2>
            <p className="text-gray-500 text-sm mt-4">
              Position: Row {row}, Column {col} (Cell #{gridPosition})
            </p>
          </div>
        </div>

        {/* Drawing Area */}
        {isDigitalMode ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {isMobile
                ? 'Draw this word in the canvas below'
                : 'Draw each word in its corresponding grid cell'}
            </h3>
            <DrawingGrid
              ref={drawingGridRef}
              singleCellMode={isMobile}
              cellIndex={state.currentWordIndex}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 md:p-16 text-center">
            <p className="text-gray-500 text-sm mb-4">Draw on your paper</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePhase;
