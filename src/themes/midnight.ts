import type { Theme } from '../types';

export const midnight: Theme = {
  id: 'midnight',
  name: 'Midnight',
  description: 'Claude dark mode — warm dark browns with terracotta accents',
  colors: {
    background: '#1C1B17',
    surface: '#1C1B17',
    userBubble: '#F4F3EE',
    userText: '#1C1B17',
    aiBubble: 'transparent',
    aiText: '#E3E2DC',
    accent: '#C96442',
    inputBackground: '#2C2B27',
    inputText: '#E3E2DC',
    inputBorder: '#3D3B35',
    headerBackground: '#1C1B17',
    headerText: '#E3E2DC',
  },
  fonts: {
    ui: 'Inter, system-ui, sans-serif',
    chat: 'Inter, system-ui, sans-serif',
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
    thinkingStyle: 'dots',
    sendButtonAnimation: 'scale',
    messageAppearAnimation: 'fade',
  },
};
