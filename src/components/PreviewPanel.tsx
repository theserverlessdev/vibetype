import React, { useRef, useEffect, useState } from 'react';
import type { Theme, AnimationState } from '../types';
import { ChatSimulator } from './ChatSimulator';

interface Props {
  theme: Theme;
  state: AnimationState;
  visiblePrompt: string;
  visibleAnswer: string;
  prompt: string;
  progress: number;
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  onRestart: () => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function PreviewPanel({
  theme,
  state,
  visiblePrompt,
  visibleAnswer,
  prompt,
  progress,
  isPlaying,
  onPause,
  onPlay,
  onRestart,
  previewRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 32; // padding
      const containerHeight = container.clientHeight - 32;
      const scaleX = containerWidth / 1280;
      const scaleY = containerHeight / 720;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const showOverlay = state.phase !== 'idle';

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        backgroundColor: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
        minHeight: 0,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        style={{
          width: 1280,
          height: 720,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
          flexShrink: 0,
        }}
      >
        <div ref={previewRef} style={{ width: 1280, height: 720 }}>
          <ChatSimulator
            theme={theme}
            state={state}
            visiblePrompt={visiblePrompt}
            visibleAnswer={visibleAnswer}
            prompt={prompt}
          />
        </div>
      </div>

      {/* Controls overlay */}
      {showOverlay && showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 8,
            padding: '6px 12px',
          }}
        >
          <button
            onClick={isPlaying ? onPause : onPlay}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: 16,
              padding: '2px 6px',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={onRestart}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: 14,
              padding: '2px 6px',
            }}
          >
            ↺
          </button>
          {/* Progress bar */}
          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: 2,
                transition: 'width 0.1s',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
