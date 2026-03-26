import React from 'react';

interface Props {
  progress: number;
  isVisible: boolean;
}

export function ProgressModal({ progress, isVisible }: Props) {
  if (!isVisible) return null;

  const percent = Math.round(progress * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: 12,
          padding: '32px 48px',
          textAlign: 'center',
          minWidth: 300,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>
          Rendering video...
        </div>
        <div
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#334155',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: 4,
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div style={{ fontSize: 14, color: '#94a3b8' }}>{percent}%</div>
      </div>
    </div>
  );
}
