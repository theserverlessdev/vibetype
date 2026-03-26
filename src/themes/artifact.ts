import type { Theme } from '../types';

export const artifact: Theme = {
  id: 'artifact',
  name: 'Artifact',
  description: 'Claude light mode — warm cream with terracotta accents',
  colors: {
    background: '#FAF9F7',
    surface: '#FAF9F7',
    userBubble: '#EDE9E3',
    userText: '#1C1B17',
    aiBubble: 'transparent',
    aiText: '#1C1B17',
    accent: '#C96442',
    inputBackground: '#FFFFFF',
    inputText: '#1C1B17',
    inputBorder: '#D4C5B9',
    headerBackground: '#FAF9F7',
    headerText: '#1C1B17',
  },
  fonts: {
    ui: 'system-ui, sans-serif',
    chat: 'system-ui, sans-serif',
    code: "'JetBrains Mono', 'Fira Code', monospace",
  },
  layout: {
    bubbleStyle: 'rounded',
    userMessageAlign: 'right',
    showAvatar: true,
    avatarShape: 'circle',
    inputStyle: 'rectangle',
  },
  branding: {
    modelName: 'Claude',
    avatarSvg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#C96442"/><path d="M10 16.5C10 12.9 12.9 10 16.5 10c2 0 3.8.9 5 2.3l-2 1.7c-.7-.9-1.8-1.5-3-1.5-2.2 0-4 1.8-4 4s1.8 4 4 4c1.2 0 2.3-.6 3-1.5l2 1.7c-1.2 1.4-3 2.3-5 2.3-3.6 0-6.5-2.9-6.5-6.5z" fill="white"/></svg>`,
    headerTitle: 'Claude',
    showModelBadge: true,
    modelBadgeText: 'claude-sonnet-4-5',
  },
  animation: {
    thinkingStyle: 'pulse-line',
    sendButtonAnimation: 'slide',
    messageAppearAnimation: 'slide-up',
  },
};
