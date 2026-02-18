import { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

const RecallPhase = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [zoomedCell, setZoomedCell] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Auto-focus first input
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    dispatch({
      type: 'UPDATE_ANSWER',
      payload: { index, answer: value },
    });
  };

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT_ANSWERS' });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && index < 19) {
      e.preventDefault();
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isMobile) return; // Only enable zoom on mobile

    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which cell was clicked
    // Grid is 5 columns x 4 rows
    const cellWidth = rect.width / 5;
    const cellHeight = rect.height / 4;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const cellIndex = row * 5 + col;

    if (cellIndex >= 0 && cellIndex < 20) {
      setZoomedCell(cellIndex);
    }
  };

  const closeZoom = () => {
    setZoomedCell(null);
  };

  const isDigitalMode = state.config?.drawingMode === 'digital';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Display Canvas Image for Digital Mode */}
        {isDigitalMode && state.canvasImage && (
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
              {t.recall.title}
              {isMobile && (
                <span className="block text-sm font-normal text-gray-500 mt-1">
                  {t.recall.tapToZoom}
                </span>
              )}
            </h3>
            <img
              src={state.canvasImage}
              alt="Your canvas drawings"
              onClick={handleCanvasClick}
              className={`w-full h-auto border-2 border-gray-300 rounded-lg ${
                isMobile ? 'cursor-pointer' : ''
              }`}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
            {t.recall.title}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t.recall.instruction}
          </p>

          {/* Input Grid - Mobile: single grid, Desktop: grouped by rows */}
          {isMobile ? (
            // Mobile: Single grid with individual drawings above each input
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex flex-col">
                  {/* Show individual drawing in mobile mode */}
                  {isDigitalMode && state.drawings[i] && (
                    <img
                      src={state.drawings[i]!}
                      alt={`Drawing ${i + 1}`}
                      className="w-full h-auto border-2 border-gray-300 rounded-lg mb-2"
                    />
                  )}
                  <label
                    htmlFor={`input-${i}`}
                    className="text-xs font-semibold text-gray-500 mb-1"
                  >
                    #{i + 1}
                  </label>
                  <input
                    ref={i === 0 ? firstInputRef : null}
                    id={`input-${i}`}
                    type="text"
                    value={state.userAnswers[i] || ''}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder={`Word ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Desktop: Row of images, then row of inputs, alternating
            <div className="space-y-8 mb-8">
              {[0, 1, 2, 3].map((rowIndex) => (
                <div key={rowIndex} className="space-y-3">
                  <div className="text-sm font-semibold text-gray-600 text-center">
                    Row {rowIndex + 1}
                  </div>
                  {/* Row of drawings */}
                  {isDigitalMode && (
                    <div className="grid grid-cols-5 gap-3">
                      {Array.from({ length: 5 }, (_, colIndex) => {
                        const i = rowIndex * 5 + colIndex;
                        return (
                          <div key={`img-${i}`} className="flex flex-col">
                            {state.drawings[i] ? (
                              <img
                                src={state.drawings[i]!}
                                alt={`Drawing ${i + 1}`}
                                className="w-full h-auto border-2 border-gray-300 rounded-lg"
                              />
                            ) : (
                              <div className="w-full aspect-square border-2 border-gray-200 rounded-lg bg-gray-50" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Row of input fields */}
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 5 }, (_, colIndex) => {
                      const i = rowIndex * 5 + colIndex;
                      return (
                        <div key={i} className="flex flex-col">
                          <label
                            htmlFor={`input-${i}`}
                            className="text-xs font-semibold text-gray-500 mb-1"
                          >
                            #{i + 1}
                          </label>
                          <input
                            ref={i === 0 ? firstInputRef : null}
                            id={`input-${i}`}
                            type="text"
                            value={state.userAnswers[i] || ''}
                            onChange={(e) => handleInputChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            placeholder={`Word ${i + 1}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {t.recall.submitButton}
          </button>
        </div>

        {/* Zoom Modal for Mobile */}
        {isMobile && zoomedCell !== null && state.drawings[zoomedCell] && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeZoom}
          >
            <div
              className="bg-white rounded-xl p-4 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {t.game.cell} #{zoomedCell + 1}
                </h3>
                <button
                  onClick={closeZoom}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <img
                src={state.drawings[zoomedCell]!}
                alt={`${t.game.cell} ${zoomedCell + 1}`}
                className="w-full h-auto border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecallPhase;
