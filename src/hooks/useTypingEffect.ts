import { useCallback } from 'react';

export function useTypingEffect() {
  const getVisibleText = useCallback(
    (fullText: string, charIndex: number): string => {
      return fullText.slice(0, charIndex);
    },
    []
  );

  const getVisibleWords = useCallback(
    (fullText: string, wordIndex: number): string => {
      const words = fullText.split(/\s+/);
      return words.slice(0, wordIndex).join(' ');
    },
    []
  );

  return { getVisibleText, getVisibleWords };
}
