import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface Translations {
  landing: {
    title: string;
    subtitle: string;
    difficultyLabel: string;
    easy: string;
    medium: string;
    hard: string;
    playWithFriend: string;
    customWordsPlaceholder: string;
    customWordsError: string;
    timeLabel: string;
    dumb: string;
    normal: string;
    hell: string;
    drawingModeLabel: string;
    digitalCanvas: string;
    physicalPaper: string;
    startButton: string;
    timeInfo: string;
  };
  game: {
    wordProgress: string;
    memorizeAndDraw: string;
    voiceoverEnabled: string;
    position: string;
    row: string;
    column: string;
    cell: string;
    drawInstruction: string;
    drawInstructions: string;
    drawOnPaper: string;
  };
  recall: {
    title: string;
    instruction: string;
    tapToZoom: string;
    submitButton: string;
  };
  results: {
    scoreText: string;
    correct: string;
    yourAnswer: string;
    correctAnswer: string;
    downloadPDF: string;
    playAgain: string;
  };
  common: {
    clear: string;
    seconds: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    landing: {
      title: 'I Draw I Guess',
      subtitle: 'Can you recognize your own drawing? Draw 20 words and see how many you can recall.',
      difficultyLabel: 'Select Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      playWithFriend: 'Play with Friend',
      customWordsPlaceholder: 'Enter 20 words separated by commas (English or Mandarin)...\nExample: cat, dog, 太阳，月亮, tree, ...',
      customWordsError: 'Please enter exactly 20 words (you have {count})',
      timeLabel: 'Time Per Word',
      dumb: 'Dumb',
      normal: 'Normal',
      hell: 'Hell',
      drawingModeLabel: 'Choose Drawing Mode',
      digitalCanvas: 'Digital Canvas',
      physicalPaper: 'Physical Paper',
      startButton: 'Start Game',
      timeInfo: "You'll have {time} seconds per word to memorize and draw!",
    },
    game: {
      wordProgress: 'Word {current} of {total}',
      memorizeAndDraw: 'Memorize and draw:',
      voiceoverEnabled: 'Voiceover enabled',
      position: 'Position:',
      row: 'Row',
      column: 'Column',
      cell: 'Cell',
      drawInstruction: 'Draw this word in the canvas below',
      drawInstructions: 'Draw each word in its corresponding grid cell',
      drawOnPaper: 'Draw on your paper',
    },
    recall: {
      title: 'Recall Phase',
      instruction: 'Now try to remember all 20 words you drew! Enter them in order.',
      tapToZoom: 'Tap an input to zoom in',
      submitButton: 'Submit Answers',
    },
    results: {
      scoreText: 'You got {score} out of {total} correct!',
      correct: 'Correct',
      yourAnswer: 'Your Answer',
      correctAnswer: 'Correct Answer',
      downloadPDF: 'Download Results as PDF',
      playAgain: 'Play Again',
    },
    common: {
      clear: 'Clear',
      seconds: 'sec',
    },
  },
  zh: {
    landing: {
      title: '我画我猜',
      subtitle: '你能认出自己的画吗？画出20个词，看看你能记住多少。',
      difficultyLabel: '选择难度',
      easy: '简单',
      medium: '中等',
      hard: '困难',
      playWithFriend: '与好友玩',
      customWordsPlaceholder: '输入20个词，用逗号分隔（支持中英文）...\n例如：猫, 狗, sun, moon, 树, ...',
      customWordsError: '请输入正好20个词（你输入了{count}个）',
      timeLabel: '每词时间',
      dumb: '简单',
      normal: '正常',
      hell: '地狱',
      drawingModeLabel: '选择绘画模式',
      digitalCanvas: '数字画布',
      physicalPaper: '纸笔绘画',
      startButton: '开始游戏',
      timeInfo: '你将有{time}秒时间来记忆和绘画每个词！',
    },
    game: {
      wordProgress: '第{current}个词，共{total}个',
      memorizeAndDraw: '记忆并绘画：',
      voiceoverEnabled: '语音播报已启用',
      position: '位置：',
      row: '行',
      column: '列',
      cell: '格子',
      drawInstruction: '在下方画布中画出这个词',
      drawInstructions: '在对应的网格格子中画出每个词',
      drawOnPaper: '在纸上画',
    },
    recall: {
      title: '回忆阶段',
      instruction: '现在试着回忆你画的所有20个词！按顺序输入它们。',
      tapToZoom: '点击输入框可放大',
      submitButton: '提交答案',
    },
    results: {
      scoreText: '你答对了{score}个，共{total}个！',
      correct: '正确',
      yourAnswer: '你的答案',
      correctAnswer: '正确答案',
      downloadPDF: '下载结果PDF',
      playAgain: '再玩一次',
    },
    common: {
      clear: '清除',
      seconds: '秒',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
