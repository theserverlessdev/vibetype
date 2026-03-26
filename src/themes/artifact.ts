import type { Theme } from '../types';

export const artifact: Theme = {
  id: 'artifact',
  name: 'Artifact',
  description: 'Warm cream theme with terracotta accents',
  colors: {
    background: '#faf9f6',
    surface: '#faf9f6',
    userBubble: '#f0ebe4',
    userText: '#2d2d2d',
    aiBubble: 'transparent',
    aiText: '#2d2d2d',
    accent: '#c96442',
    inputBackground: '#ffffff',
    inputText: '#2d2d2d',
    inputBorder: '#d4c5b9',
    headerBackground: '#faf9f6',
    headerText: '#2d2d2d',
  },
  fonts: {
    ui: 'system-ui, sans-serif',
    chat: 'Georgia, "Times New Roman", serif',
    code: "'JetBrains Mono', 'Fira Code', monospace",
  },
  layout: {
    bubbleStyle: 'bordered',
    userMessageAlign: 'right',
    showAvatar: true,
    avatarShape: 'rounded-square',
    inputStyle: 'rectangle',
  },
  branding: {
    modelName: 'Claude',
    avatarSvg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#c96442"/><path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    headerTitle: 'Claude',
    showModelBadge: true,
    modelBadgeText: 'Sonnet',
  },
  animation: {
    thinkingStyle: 'pulse-line',
    sendButtonAnimation: 'slide',
    messageAppearAnimation: 'slide-up',
  },
};
