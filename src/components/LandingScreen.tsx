import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { Difficulty, DrawingMode, TimeDifficulty } from '../types/game.types';

const LandingScreen = () => {
  const { dispatch } = useGame();
  const { language, setLanguage, t } = useLanguage();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('digital');
  const [timeDifficulty, setTimeDifficulty] = useState<TimeDifficulty>('normal');
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [customWordsError, setCustomWordsError] = useState('');

  const handleStart = () => {
    // If custom difficulty, validate and parse custom words
    if (difficulty === 'custom') {
      const words = customWordsInput
        .split(/[,，]/) // Split on both English comma and Chinese comma
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      if (words.length !== 20) {
        setCustomWordsError(t.landing.customWordsError.replace('{count}', words.length.toString()));
        return;
      }

      dispatch({
        type: 'START_GAME',
        payload: { difficulty, drawingMode, timeDifficulty, customWords: words },
      });
    } else {
      dispatch({
        type: 'START_GAME',
        payload: { difficulty, drawingMode, timeDifficulty },
      });
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setCustomWordsError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            {language === 'en' ? '中文' : 'English'}
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          {t.landing.title}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t.landing.subtitle}
        </p>

        <div className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.landing.difficultyLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['easy', 'medium', 'hard', 'custom'] as Difficulty[]).map((level) => {
                const labels = {
                  easy: t.landing.easy,
                  medium: t.landing.medium,
                  hard: t.landing.hard,
                  custom: t.landing.playWithFriend,
                };
                return (
                  <button
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      difficulty === level
                        ? 'bg-orange-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>

            {/* Custom Words Input */}
            {difficulty === 'custom' && (
              <div className="mt-4">
                <textarea
                  value={customWordsInput}
                  onChange={(e) => {
                    setCustomWordsInput(e.target.value);
                    setCustomWordsError('');
                  }}
                  placeholder={t.landing.customWordsPlaceholder}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  rows={4}
                />
                {customWordsError && (
                  <p className="text-red-500 text-sm mt-2 font-semibold">
                    {customWordsError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Time Difficulty Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.landing.timeLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['dumb', 'normal', 'hell'] as TimeDifficulty[]).map((level) => {
                const labels = {
                  dumb: t.landing.dumb,
                  normal: t.landing.normal,
                  hell: t.landing.hell,
                };
                const times = {
                  dumb: '5',
                  normal: '3',
                  hell: '1',
                };
                return (
                  <button
                    key={level}
                    onClick={() => setTimeDifficulty(level)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      timeDifficulty === level
                        ? 'bg-orange-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-base font-bold">{labels[level]}</div>
                    <div className="text-xs mt-1">
                      {times[level]} {t.common.seconds}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawing Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.landing.drawingModeLabel}
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
                {t.landing.digitalCanvas}
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
                {t.landing.physicalPaper}
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {t.landing.startButton}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          {t.landing.timeInfo.replace(
            '{time}',
            timeDifficulty === 'dumb' ? '5' : timeDifficulty === 'normal' ? '3' : '1'
          )}
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
