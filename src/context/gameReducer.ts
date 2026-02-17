import { GameState, GameAction, Difficulty } from '../types/game.types';
import { selectRandomWords } from '../data/words';
import { calculateScore } from '../utils/scoreCalculator';

export const initialState: GameState = {
  phase: 'landing',
  config: null,
  words: [],
  currentWordIndex: 0,
  userAnswers: Array(20).fill(''),
  drawings: Array(20).fill(null),
  canvasImage: null,
  score: 0,
  results: [],
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      // Use custom words if provided, otherwise select from database
      const words = action.payload.customWords
        ? action.payload.customWords.map((text, index) => ({ text: text.trim(), index }))
        : selectRandomWords(action.payload.difficulty as Exclude<Difficulty, 'custom'>);

      return {
        ...state,
        phase: 'game',
        config: action.payload,
        words,
        currentWordIndex: 0,
        userAnswers: Array(20).fill(''),
        drawings: Array(20).fill(null),
        canvasImage: null,
        score: 0,
        results: [],
      };
    }

    case 'NEXT_WORD': {
      const nextIndex = state.currentWordIndex + 1;

      // If we've shown all 20 words, transition to recall phase
      if (nextIndex >= 20) {
        return {
          ...state,
          phase: 'recall',
          currentWordIndex: 20,
        };
      }

      return {
        ...state,
        currentWordIndex: nextIndex,
      };
    }

    case 'SAVE_DRAWING': {
      const newDrawings = [...state.drawings];
      newDrawings[action.payload.index] = action.payload.dataUrl;
      return {
        ...state,
        drawings: newDrawings,
      };
    }

    case 'SAVE_CANVAS': {
      return {
        ...state,
        canvasImage: action.payload,
      };
    }

    case 'START_RECALL': {
      return {
        ...state,
        phase: 'recall',
      };
    }

    case 'UPDATE_ANSWER': {
      const newAnswers = [...state.userAnswers];
      newAnswers[action.payload.index] = action.payload.answer;
      return {
        ...state,
        userAnswers: newAnswers,
      };
    }

    case 'SUBMIT_ANSWERS': {
      const { score, results } = calculateScore(state.words, state.userAnswers);
      return {
        ...state,
        phase: 'results',
        score,
        results,
      };
    }

    case 'RESTART_GAME': {
      return initialState;
    }

    default:
      return state;
  }
};
