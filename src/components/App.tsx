import React, { useState, useRef, useCallback } from 'react';
import type { Settings } from '../types';
import { getTheme } from '../themes';
import { useAnimationEngine } from '../hooks/useAnimationEngine';
import { InputPanel } from './InputPanel';
import { PreviewPanel } from './PreviewPanel';
import { VideoExporter } from './VideoExporter';

const defaultSettings: Settings = {
  userTypingSpeed: 40,
  aiTypingSpeed: 30,
  thinkingDuration: 2000,
  showUserTyping: true,
  endHoldDuration: 1500,
  videoQuality: '720p',
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [themeId, setThemeId] = useState('midnight');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hasPlayed, setHasPlayed] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const theme = getTheme(themeId);

  const engine = useAnimationEngine({
    prompt,
    answer,
    userTypingSpeed: settings.userTypingSpeed,
    aiTypingSpeed: settings.aiTypingSpeed,
    thinkingDuration: settings.thinkingDuration,
    showUserTyping: settings.showUserTyping,
    endHoldDuration: settings.endHoldDuration,
  });

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || !answer.trim()) return;
    setHasPlayed(true);
    engine.restart();
  }, [prompt, answer, engine]);

  const handleReplay = useCallback(() => {
    engine.restart();
  }, [engine]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>VibeType</span>
          <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>AI Chat Simulator</span>
        </div>
        <a
          href="https://github.com/theserverlessdev/vibetype"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}
        >
          GitHub
        </a>
      </header>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
        }}
        className="vt-main"
      >
        {/* Input panel */}
        <div
          style={{
            width: 400,
            flexShrink: 0,
            borderRight: '1px solid #1e293b',
            overflowY: 'auto',
          }}
          className="vt-input-panel"
        >
          <InputPanel
            prompt={prompt}
            answer={answer}
            selectedThemeId={themeId}
            settings={settings}
            hasPlayed={hasPlayed}
            onPromptChange={setPrompt}
            onAnswerChange={setAnswer}
            onThemeSelect={setThemeId}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            downloadButton={
              <VideoExporter
                previewRef={previewRef}
                settings={settings}
                prompt={prompt}
                answer={answer}
                themeName={themeId}
                hasPlayed={hasPlayed}
                onReplay={handleReplay}
              />
            }
          />
        </div>

        {/* Preview panel */}
        <PreviewPanel
          theme={theme}
          state={engine.state}
          visiblePrompt={engine.visiblePrompt}
          visibleAnswer={engine.visibleAnswer}
          prompt={prompt}
          progress={engine.progress}
          isPlaying={engine.isPlaying}
          onPause={engine.pause}
          onPlay={engine.play}
          onRestart={engine.restart}
          previewRef={previewRef}
        />
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          borderTop: '1px solid #1e293b',
          padding: '8px 20px',
          textAlign: 'center',
          fontSize: 12,
          color: '#64748b',
          flexShrink: 0,
        }}
      >
        Made with <span style={{ color: '#3b82f6' }}>VibeType</span>
      </footer>

      <style>{`
        @media (max-width: 1023px) {
          .vt-main {
            flex-direction: column !important;
          }
          .vt-input-panel {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid #1e293b !important;
            max-height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}
