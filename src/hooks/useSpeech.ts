import { useEffect, useRef, useCallback } from 'react';

interface UseSpeechOptions {
  rate?: number; // 0.1 to 10, default 1
  pitch?: number; // 0 to 2, default 1
  volume?: number; // 0 to 1, default 1
  lang?: string; // language code, default 'en-US'
}

export const useSpeech = (options?: UseSpeechOptions) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize utterance
    utteranceRef.current = new SpeechSynthesisUtterance();
    utteranceRef.current.rate = options?.rate ?? 1;
    utteranceRef.current.pitch = options?.pitch ?? 1;
    utteranceRef.current.volume = options?.volume ?? 1;
    utteranceRef.current.lang = options?.lang ?? 'en-US';

    return () => {
      // Cleanup: cancel any ongoing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [options?.rate, options?.pitch, options?.volume, options?.lang]);

  const speak = useCallback((text: string) => {
    if (!utteranceRef.current || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Set the text and speak
    utteranceRef.current.text = text;
    window.speechSynthesis.speak(utteranceRef.current);
  }, []);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancel };
};
