import React from 'react';
import type { Theme } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Props {
  type: 'user' | 'ai';
  content: string;
  theme: Theme;
  showCursor?: boolean;
}

export function ChatBubble({ type, content, theme, showCursor = false }: Props) {
  const isUser = type === 'user';
  const isTerminal = theme.layout.bubbleStyle === 'none';

  if (isTerminal) {
    return (
      <div
        style={{
          fontFamily: theme.fonts.chat,
          color: isUser ? theme.colors.userText : theme.colors.aiText,
          padding: '4px 0',
          whiteSpace: 'pre-wrap',
        }}
      >
        {isUser ? (
          <span>
            <span style={{ opacity: 0.7 }}>&gt; </span>
            {content}
          </span>
        ) : (
          <MarkdownRenderer text={content} theme={theme} showCursor={showCursor} />
        )}
      </div>
    );
  }

  const bubbleStyles: React.CSSProperties = {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius:
      theme.layout.bubbleStyle === 'rounded' ? 16 : theme.layout.bubbleStyle === 'bordered' ? 8 : 4,
    backgroundColor: isUser ? theme.colors.userBubble : theme.colors.aiBubble,
    color: isUser ? theme.colors.userText : theme.colors.aiText,
    fontFamily: theme.fonts.chat,
    fontSize: 14,
    lineHeight: 1.6,
    wordBreak: 'break-word',
  };

  if (theme.layout.bubbleStyle === 'bordered' && !isUser) {
    bubbleStyles.borderLeft = `3px solid ${theme.colors.accent}`;
    bubbleStyles.paddingLeft = 12;
  }

  if (theme.layout.bubbleStyle === 'minimal' && !isUser) {
    bubbleStyles.backgroundColor = 'transparent';
    bubbleStyles.padding = '4px 0';
  }

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: isUser && theme.layout.userMessageAlign === 'right' ? 'flex-end' : 'flex-start',
    gap: 8,
    marginBottom: 12,
    alignItems: 'flex-start',
  };

  const avatar = !isUser && theme.layout.showAvatar && (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: theme.layout.avatarShape === 'circle' ? '50%' : 6,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: theme.branding.avatarSvg }}
    />
  );

  return (
    <div style={containerStyles}>
      {avatar}
      <div style={bubbleStyles}>
        {isUser ? (
          content
        ) : (
          <MarkdownRenderer text={content} theme={theme} showCursor={showCursor} />
        )}
      </div>
    </div>
  );
}
