import React from 'react';
import type { Theme } from '../types';

interface Props {
  theme: Theme;
}

export function ThinkingIndicator({ theme }: Props) {
  const style = theme.animation.thinkingStyle;

  if (style === 'dots') {
    return (
      <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.colors.accent,
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (style === 'shimmer') {
    return (
      <div style={{ padding: '8px 0' }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.colors.accent,
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  if (style === 'cursor') {
    return (
      <div
        style={{
          fontFamily: theme.fonts.chat,
          color: theme.colors.aiText,
          padding: '8px 0',
        }}
      >
        <span>Processing...</span>
        <span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // pulse-line
  return (
    <div style={{ padding: '8px 0', width: '100%' }}>
      <div
        style={{
          height: 2,
          backgroundColor: theme.colors.accent,
          borderRadius: 1,
          animation: 'pulseLine 2s ease-in-out infinite',
          opacity: 0.6,
        }}
      />
      <style>{`
        @keyframes pulseLine {
          0%, 100% { opacity: 0.3; width: 40%; }
          50% { opacity: 0.8; width: 70%; }
        }
      `}</style>
    </div>
  );
}
