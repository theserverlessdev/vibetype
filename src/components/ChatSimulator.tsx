import React, { useEffect, useRef } from 'react';
import type { Theme, AnimationState } from '../types';
import { ChatBubble } from './ChatBubble';
import { ThinkingIndicator } from './ThinkingIndicator';

interface Props {
  theme: Theme;
  state: AnimationState;
  visiblePrompt: string;
  visibleAnswer: string;
  prompt: string;
}

export function ChatSimulator({ theme, state, visiblePrompt, visibleAnswer, prompt }: Props) {
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [state, visiblePrompt, visibleAnswer]);

  const phase = state.phase;
  const showUserTyping = phase === 'user_typing';
  const showUserMessage = phase === 'user_sent' || phase === 'thinking' || phase === 'ai_typing' || phase === 'complete' || phase === 'done';
  const showThinking = phase === 'thinking';
  const showAiMessage = phase === 'ai_typing' || phase === 'complete' || phase === 'done';
  const isAiTyping = phase === 'ai_typing';

  const isTerminal = theme.layout.bubbleStyle === 'none';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
        fontFamily: theme.fonts.ui,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: theme.colors.headerBackground,
          color: theme.colors.headerText,
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.colors.inputBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {theme.layout.showAvatar && (
          <div
            style={{ width: 24, height: 24, flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: theme.branding.avatarSvg }}
          />
        )}
        <span style={{ flex: 1 }}>{theme.branding.headerTitle}</span>
        {theme.branding.showModelBadge && theme.branding.modelBadgeText && (
          <span
            style={{
              fontSize: 11,
              backgroundColor: theme.colors.accent + '22',
              color: theme.colors.accent,
              padding: '2px 8px',
              borderRadius: 10,
              fontWeight: 400,
            }}
          >
            {theme.branding.modelBadgeText}
          </span>
        )}
      </div>

      {/* Chat area */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          backgroundColor: theme.colors.surface,
        }}
      >
        <div style={isTerminal ? {} : { maxWidth: 680, margin: '0 auto' }}>
          {phase === 'idle' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: theme.colors.aiText,
                opacity: 0.5,
                fontSize: 13,
                textAlign: 'center',
                padding: 20,
                fontFamily: theme.fonts.ui,
              }}
            >
              Enter a prompt and answer, then click Generate to preview your AI chat simulation.
            </div>
          )}

          {showUserMessage && (
            <ChatBubble type="user" content={prompt} theme={theme} />
          )}

          {showThinking && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
              {theme.layout.showAvatar && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: theme.layout.avatarShape === 'circle' ? '50%' : 6,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: theme.branding.avatarSvg }}
                />
              )}
              <ThinkingIndicator theme={theme} />
            </div>
          )}

          {showAiMessage && (
            <ChatBubble
              type="ai"
              content={visibleAnswer}
              theme={theme}
              showCursor={isAiTyping}
            />
          )}
        </div>
      </div>

      {/* Input area */}
      <div
        style={{
          backgroundColor: theme.colors.background,
          padding: '12px 16px',
          borderTop: `1px solid ${theme.colors.inputBorder}`,
          flexShrink: 0,
        }}
      >
        <div style={isTerminal ? {} : { maxWidth: 680, margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: theme.colors.inputBackground,
              border: `1px solid ${showUserTyping ? theme.colors.accent : theme.colors.inputBorder}`,
              borderRadius: theme.layout.inputStyle === 'pill' ? 24 : theme.layout.inputStyle === 'terminal' ? 0 : 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.2s',
              ...(showUserTyping && theme.layout.inputStyle === 'rectangle'
                ? { boxShadow: `0 0 0 2px ${theme.colors.accent}33` }
                : {}),
            }}
          >
            <span
              style={{
                flex: 1,
                color: showUserTyping ? theme.colors.inputText : theme.colors.inputText + '66',
                fontFamily: theme.fonts.chat,
                fontSize: 14,
                minHeight: 20,
                whiteSpace: 'pre-wrap',
              }}
            >
              {showUserTyping ? (
                <>
                  {visiblePrompt}
                  <span
                    style={{
                      display: 'inline-block',
                      width: theme.layout.inputStyle === 'terminal' ? 8 : 2,
                      height: '1em',
                      backgroundColor: theme.colors.accent,
                      marginLeft: 1,
                      animation: 'cursorBlink 1s step-end infinite',
                      verticalAlign: 'text-bottom',
                    }}
                  />
                </>
              ) : (
                theme.layout.inputStyle === 'terminal' ? '$ ' : 'Reply to Claude...'
              )}
            </span>
            {theme.layout.inputStyle !== 'terminal' && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: showUserTyping ? theme.colors.accent : theme.colors.inputBorder,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s, transform 0.15s',
                  transform: phase === 'user_sent' ? 'scale(0.9)' : 'scale(1)',
                  cursor: 'default',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
