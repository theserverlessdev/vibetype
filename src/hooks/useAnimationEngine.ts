import { useState, useRef, useCallback, useEffect } from 'react';
import type { AnimationState, AnimationConfig, AnimationEngineResult } from '../types';
import { countWords } from '../utils/markdown';

export function useAnimationEngine(config: AnimationConfig): AnimationEngineResult {
  const [state, setState] = useState<AnimationState>({ phase: 'idle' });
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);
  const configRef = useRef(config);
  configRef.current = config;

  const totalWords = countWords(config.answer);

  const getTotalDuration = useCallback(() => {
    const c = configRef.current;
    const userTypingTime = c.showUserTyping ? c.prompt.length * c.userTypingSpeed : 0;
    const sendPause = 600; // pause after typing + send animation
    const thinkTime = c.thinkingDuration;
    const aiTypingTime = totalWords * c.aiTypingSpeed;
    const endHold = c.endHoldDuration;
    return userTypingTime + sendPause + thinkTime + aiTypingTime + endHold;
  }, [totalWords]);

  const getProgress = useCallback((): number => {
    if (state.phase === 'idle') return 0;
    if (state.phase === 'done') return 1;

    const c = configRef.current;
    const total = getTotalDuration();
    if (total === 0) return 0;

    let elapsed = 0;
    const userTypingTime = c.showUserTyping ? c.prompt.length * c.userTypingSpeed : 0;
    const sendPause = 600;

    switch (state.phase) {
      case 'user_typing':
        elapsed = state.charIndex * c.userTypingSpeed;
        break;
      case 'user_sent':
        elapsed = userTypingTime;
        break;
      case 'thinking':
        elapsed = userTypingTime + sendPause + state.elapsed;
        break;
      case 'ai_typing':
        elapsed = userTypingTime + sendPause + c.thinkingDuration + state.wordIndex * c.aiTypingSpeed;
        break;
      case 'complete':
        elapsed = total - c.endHoldDuration + state.holdElapsed;
        break;
    }
    return Math.min(elapsed / total, 1);
  }, [state, getTotalDuration]);

  const getVisiblePrompt = useCallback((): string => {
    if (state.phase === 'user_typing') {
      return config.prompt.slice(0, state.charIndex);
    }
    if (state.phase === 'idle') return '';
    return config.prompt;
  }, [state, config.prompt]);

  const getVisibleAnswer = useCallback((): string => {
    if (state.phase === 'ai_typing') {
      const words = config.answer.split(/\s+/);
      return words.slice(0, state.wordIndex).join(' ');
    }
    if (state.phase === 'complete' || state.phase === 'done') {
      return config.answer;
    }
    return '';
  }, [state, config.answer]);

  const animate = useCallback(
    (timestamp: number) => {
      const c = configRef.current;

      setState((prev) => {
        const elapsed = timestamp - phaseStartRef.current;

        switch (prev.phase) {
          case 'user_typing': {
            const charIndex = Math.floor(elapsed / c.userTypingSpeed);
            if (charIndex >= c.prompt.length) {
              phaseStartRef.current = timestamp;
              return { phase: 'user_sent' };
            }
            return { phase: 'user_typing', charIndex };
          }
          case 'user_sent': {
            if (elapsed >= 600) {
              phaseStartRef.current = timestamp;
              return { phase: 'thinking', elapsed: 0 };
            }
            return prev;
          }
          case 'thinking': {
            if (elapsed >= c.thinkingDuration) {
              phaseStartRef.current = timestamp;
              return { phase: 'ai_typing', wordIndex: 0 };
            }
            return { phase: 'thinking', elapsed };
          }
          case 'ai_typing': {
            const words = c.answer.split(/\s+/).filter(Boolean);
            const wordIndex = Math.floor(elapsed / c.aiTypingSpeed);
            if (wordIndex >= words.length) {
              phaseStartRef.current = timestamp;
              return { phase: 'complete', holdElapsed: 0 };
            }
            return { phase: 'ai_typing', wordIndex };
          }
          case 'complete': {
            if (elapsed >= c.endHoldDuration) {
              setIsPlaying(false);
              return { phase: 'done' };
            }
            return { phase: 'complete', holdElapsed: elapsed };
          }
          default:
            return prev;
        }
      });

      // Continue loop if still playing
      rafRef.current = requestAnimationFrame(animate);
    },
    []
  );

  const play = useCallback(() => {
    const c = configRef.current;
    if (!c.prompt || !c.answer) return;

    setIsPlaying(true);
    phaseStartRef.current = performance.now();
    startTimeRef.current = performance.now();

    if (c.showUserTyping) {
      setState({ phase: 'user_typing', charIndex: 0 });
    } else {
      setState({ phase: 'user_sent' });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const restart = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setState({ phase: 'idle' });
    setIsPlaying(false);
    // Small delay then play
    setTimeout(() => play(), 50);
  }, [play]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Stop RAF when not playing
  useEffect(() => {
    if (!isPlaying && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [isPlaying]);

  return {
    state,
    play,
    pause,
    restart,
    isPlaying,
    progress: getProgress(),
    visiblePrompt: getVisiblePrompt(),
    visibleAnswer: getVisibleAnswer(),
  };
}
