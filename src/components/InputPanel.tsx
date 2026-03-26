import React from 'react';
import type { Settings } from '../types';
import { ThemeSelector } from './ThemeSelector';
import { SettingsPanel } from './SettingsPanel';

interface Props {
  prompt: string;
  answer: string;
  selectedThemeId: string;
  settings: Settings;
  hasPlayed: boolean;
  onPromptChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onThemeSelect: (themeId: string) => void;
  onSettingsChange: (settings: Settings) => void;
  onGenerate: () => void;
  downloadButton: React.ReactNode;
}

export function InputPanel({
  prompt,
  answer,
  selectedThemeId,
  settings,
  hasPlayed,
  onPromptChange,
  onAnswerChange,
  onThemeSelect,
  onSettingsChange,
  onGenerate,
  downloadButton,
}: Props) {
  const canGenerate = prompt.trim().length > 0 && answer.trim().length > 0;
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
        backgroundColor: '#0f172a',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Prompt input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Prompt</label>
          <span style={{ fontSize: 11, color: '#64748b' }}>{prompt.length}/2000</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value.slice(0, 2000))}
          placeholder="Type your question..."
          rows={3}
          style={{
            width: '100%',
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 14,
            resize: 'vertical',
            fontFamily: 'system-ui, sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Answer input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Answer</label>
          <span style={{ fontSize: 11, color: '#64748b' }}>{answer.length}/10000</span>
        </div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value.slice(0, 10000))}
          placeholder="Type the AI response... (supports **bold**, *italic*, `code`, ```code blocks```, - bullet lists)"
          rows={6}
          style={{
            width: '100%',
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 14,
            resize: 'vertical',
            fontFamily: 'system-ui, sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {wordCount > 5000 && (
          <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>
            Long responses may take a while to animate and export.
          </div>
        )}
      </div>

      <ThemeSelector selectedThemeId={selectedThemeId} onSelect={onThemeSelect} />

      <SettingsPanel settings={settings} onChange={onSettingsChange} />

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: canGenerate ? '#3b82f6' : '#1e3a5f',
          color: canGenerate ? '#ffffff' : '#64748b',
          fontSize: 15,
          fontWeight: 700,
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
        }}
      >
        {hasPlayed ? 'Replay' : 'Generate Preview'}
      </button>

      {/* Download button slot */}
      {downloadButton}

      {!canGenerate && (prompt.length > 0 || answer.length > 0) && (
        <div style={{ fontSize: 12, color: '#f87171', textAlign: 'center' }}>
          Both fields are required.
        </div>
      )}
    </div>
  );
}
