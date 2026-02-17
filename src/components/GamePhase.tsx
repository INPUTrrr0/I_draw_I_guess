import { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import DrawingGrid, { DrawingGridRef } from './DrawingGrid';
import CircularTimer from './CircularTimer';
import { combineCellsIntoGrid } from '../utils/canvasUtils';
import { TIME_DURATIONS } from '../types/game.types';

const GamePhase = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const { timeLeft, startTimer } = useTimer();
  const { speak } = useSpeech({ rate: 0.9, pitch: 1, volume: 1 });
  const drawingGridRef = useRef<DrawingGridRef>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const currentWord = state.words[state.currentWordIndex];
  const isDigitalMode = state.config?.drawingMode === 'digital';
  const timeDuration = state.config?.timeDifficulty
    ? TIME_DURATIONS[state.config.timeDifficulty]
    : 3;

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
    // Start timer for current word based on difficulty
    startTimer(timeDuration, async () => {
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
  }, [state.currentWordIndex, state.drawings, dispatch, startTimer, isDigitalMode, isMobile, timeDuration]);

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
              {t.game.wordProgress
                .replace('{current}', (state.currentWordIndex + 1).toString())
                .replace('{total}', '20')}
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
              <span>{t.game.memorizeAndDraw}</span>
              <span className="text-orange-600" title={t.game.voiceoverEnabled}>
                🔊
              </span>
            </p>
            <div className="flex items-center justify-center gap-6 mb-4">
              <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text animate-fade-in">
                {currentWord?.text}
              </h2>
              <CircularTimer timeLeft={timeLeft} totalTime={timeDuration} />
            </div>
            <p className="text-gray-500 text-sm mt-4">
              {t.game.position} {t.game.row} {row}, {t.game.column} {col} ({t.game.cell} #{gridPosition})
            </p>
          </div>
        </div>

        {/* Drawing Area */}
        {isDigitalMode ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {isMobile ? t.game.drawInstruction : t.game.drawInstructions}
            </h3>
            <DrawingGrid
              ref={drawingGridRef}
              singleCellMode={isMobile}
              cellIndex={state.currentWordIndex}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 md:p-16 text-center">
            <p className="text-gray-500 text-sm mb-4">{t.game.drawOnPaper}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePhase;
