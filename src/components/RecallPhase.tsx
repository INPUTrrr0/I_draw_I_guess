import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const RecallPhase = () => {
  const { state, dispatch } = useGame();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus first input
    firstInputRef.current?.focus();
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

  const isDigitalMode = state.config?.drawingMode === 'digital';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Display Canvas Image for Digital Mode */}
        {isDigitalMode && state.canvasImage && (
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
              Your Drawings
            </h3>
            <img
              src={state.canvasImage}
              alt="Your canvas drawings"
              className="w-full h-auto border-2 border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
            Recall the Words
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Type the words in the order they appeared
          </p>

          {/* Input Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {Array.from({ length: 20 }, (_, i) => (
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
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecallPhase;
