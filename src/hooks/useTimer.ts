import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  startTimer: (duration: number, onComplete: () => void) => void;
  stopTimer: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  }, []);

  const startTimer = useCallback(
    (duration: number, onComplete: () => void) => {
      stopTimer();
      setTimeLeft(duration);
      setIsActive(true);
      onCompleteRef.current = onComplete;
    },
    [stopTimer]
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (timeLeft === 0) {
      if (onCompleteRef.current) {
        const callback = onCompleteRef.current;
        onCompleteRef.current = null;
        setIsActive(false);
        callback();
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  return { timeLeft, isActive, startTimer, stopTimer };
};
