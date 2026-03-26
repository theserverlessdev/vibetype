import React from 'react';
import type { Theme } from '../types';
import { themes } from '../themes';

interface Props {
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
}

export function ThemeSelector({ selectedThemeId, onSelect }: Props) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8, display: 'block' }}>
        Theme
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={theme.id === selectedThemeId}
            onClick={() => onSelect(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ theme, isSelected, onClick }: { theme: Theme; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? '#3b82f6' : '#334155'}`,
        borderRadius: 8,
        padding: 8,
        cursor: 'pointer',
        backgroundColor: '#1e293b',
        transition: 'border-color 0.2s',
        textAlign: 'left',
      }}
    >
      {/* Mini preview */}
      <div
        style={{
          width: '100%',
          height: 48,
          borderRadius: 4,
          backgroundColor: theme.colors.background,
          marginBottom: 6,
          display: 'flex',
          flexDirection: 'column',
          padding: 4,
          gap: 2,
          overflow: 'hidden',
        }}
      >
        <div style={{ height: 3, backgroundColor: theme.colors.headerBackground, borderBottom: `1px solid ${theme.colors.inputBorder}` }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 4px' }}>
          <div style={{ height: 4, width: '40%', borderRadius: 2, backgroundColor: theme.colors.userBubble }} />
        </div>
        <div style={{ display: 'flex', padding: '2px 4px', gap: 2 }}>
          <div style={{ height: 4, width: 4, borderRadius: '50%', backgroundColor: theme.colors.accent }} />
          <div style={{ height: 4, width: '60%', borderRadius: 2, backgroundColor: theme.colors.aiBubble || theme.colors.accent + '33' }} />
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{theme.name}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{theme.description}</div>
    </button>
  );
}
