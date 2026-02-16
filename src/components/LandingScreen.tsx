import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Difficulty, DrawingMode } from '../types/game.types';

const LandingScreen = () => {
  const { dispatch } = useGame();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('digital');

  const handleStart = () => {
    dispatch({
      type: 'START_GAME',
      payload: { difficulty, drawingMode },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          I Draw I Guess
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Can you recognize your own drawing? Draw 20 words and see how many you can recall.
        </p>

        <div className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    difficulty === level
                      ? 'bg-orange-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Drawing Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Drawing Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDrawingMode('digital')}
                className={`py-4 px-4 rounded-lg font-medium transition-all duration-200 ${
                  drawingMode === 'digital'
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">✏️</div>
                Digital Canvas
              </button>
              <button
                onClick={() => setDrawingMode('physical')}
                className={`py-4 px-4 rounded-lg font-medium transition-all duration-200 ${
                  drawingMode === 'physical'
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">📝</div>
                Physical Paper
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Start Game
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          You'll have 3 seconds per word to memorize and draw!
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
