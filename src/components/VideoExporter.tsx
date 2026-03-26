import React from 'react';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { ProgressModal } from './ProgressModal';
import type { Settings } from '../types';
import { countWords } from '../utils/markdown';

interface Props {
  previewRef: React.RefObject<HTMLDivElement | null>;
  settings: Settings;
  prompt: string;
  answer: string;
  themeName: string;
  hasPlayed: boolean;
  onReplay: () => void;
}

export function VideoExporter({ previewRef, settings, prompt, answer, themeName, hasPlayed, onReplay }: Props) {
  const { startRecording, isRecording, progress, supportsRecording } = useVideoRecorder();

  if (!supportsRecording()) {
    return (
      <div style={{ fontSize: 12, color: '#f87171', padding: '8px 0' }}>
        Video export is not supported in your browser. Try Chrome or Firefox.
      </div>
    );
  }

  const handleExport = () => {
    if (!previewRef.current || isRecording) return;

    const totalWords = countWords(answer);
    const userTypingTime = settings.showUserTyping ? prompt.length * settings.userTypingSpeed : 0;
    const duration = userTypingTime + 600 + settings.thinkingDuration + totalWords * settings.aiTypingSpeed + settings.endHoldDuration;

    startRecording(previewRef.current, duration, settings.videoQuality, themeName, onReplay);
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={!hasPlayed || isRecording}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid #334155',
          backgroundColor: hasPlayed && !isRecording ? '#1e293b' : '#0f172a',
          color: hasPlayed && !isRecording ? '#e2e8f0' : '#475569',
          fontSize: 14,
          fontWeight: 600,
          cursor: hasPlayed && !isRecording ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
        }}
      >
        {isRecording ? 'Recording...' : 'Download Video'}
      </button>
      <ProgressModal progress={progress} isVisible={isRecording} />
    </>
  );
}
