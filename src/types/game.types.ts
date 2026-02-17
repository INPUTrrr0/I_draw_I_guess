export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
export type DrawingMode = 'physical' | 'digital';
export type TimeDifficulty = 'dumb' | 'normal' | 'hell';
export type GamePhase = 'landing' | 'game' | 'recall' | 'results';

export interface GameConfig {
  difficulty: Difficulty;
  drawingMode: DrawingMode;
  timeDifficulty: TimeDifficulty;
  customWords?: string[];
}

export const TIME_DURATIONS: Record<TimeDifficulty, number> = {
  dumb: 5,
  normal: 3,
  hell: 1,
};

export interface Word {
  text: string;
  index: number; // 0-19, position in grid
}

export interface UserAnswer {
  index: number;
  input: string;
  isCorrect: boolean;
}

export interface GameState {
  phase: GamePhase;
  config: GameConfig | null;
  words: Word[]; // 20 words in order
  currentWordIndex: number; // 0-19 during game phase
  userAnswers: string[]; // 20 strings, filled during recall
  drawings: (string | null)[]; // 20 canvas data URLs (digital mode only)
  canvasImage: string | null; // Full canvas image for recall phase
  score: number;
  results: UserAnswer[]; // populated after submission
}

export type GameAction =
  | { type: 'START_GAME'; payload: GameConfig }
  | { type: 'NEXT_WORD' }
  | { type: 'SAVE_DRAWING'; payload: { index: number; dataUrl: string } }
  | { type: 'SAVE_CANVAS'; payload: string }
  | { type: 'START_RECALL' }
  | { type: 'UPDATE_ANSWER'; payload: { index: number; answer: string } }
  | { type: 'SUBMIT_ANSWERS' }
  | { type: 'RESTART_GAME' };
