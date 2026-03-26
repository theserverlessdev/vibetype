import React from 'react';
import type { Theme } from '../types';
import { renderMarkdownToHtml } from '../utils/markdown';

interface Props {
  text: string;
  theme: Theme;
  showCursor?: boolean;
}

export function MarkdownRenderer({ text, theme, showCursor = false }: Props) {
  const html = renderMarkdownToHtml(text);

  return (
    <div
      style={{
        fontFamily: theme.fonts.chat,
        color: theme.colors.aiText,
        lineHeight: 1.6,
        fontSize: 14,
        wordBreak: 'break-word',
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {showCursor && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            backgroundColor: theme.colors.accent,
            marginLeft: 2,
            animation: 'cursorBlink 1s step-end infinite',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
