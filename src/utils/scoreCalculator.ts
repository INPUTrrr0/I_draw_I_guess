import { Word, UserAnswer } from '../types/game.types';

export const calculateScore = (
  correctWords: Word[],
  userAnswers: string[]
): { score: number; results: UserAnswer[] } => {
  let score = 0;
  const results: UserAnswer[] = [];

  for (let i = 0; i < 20; i++) {
    const isCorrect =
      userAnswers[i]?.trim().toLowerCase() === correctWords[i]?.text.toLowerCase();
    if (isCorrect) score++;

    results.push({
      index: i,
      input: userAnswers[i] || '',
      isCorrect,
    });
  }

  return { score, results };
};
