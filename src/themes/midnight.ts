import type { Theme } from '../types';

export const midnight: Theme = {
  id: 'midnight',
  name: 'Midnight',
  description: 'Dark theme with electric blue accents',
  colors: {
    background: '#0a0a0a',
    surface: '#111111',
    userBubble: '#3b82f6',
    userText: '#ffffff',
    aiBubble: '#1a1a2e',
    aiText: '#e2e8f0',
    accent: '#3b82f6',
    inputBackground: '#1a1a1a',
    inputText: '#e2e8f0',
    inputBorder: '#2a2a2a',
    headerBackground: '#0f0f0f',
    headerText: '#e2e8f0',
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
    modelName: 'AI Assistant',
    avatarSvg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#3b82f6"/></svg>`,
    headerTitle: 'AI Assistant',
    showModelBadge: false,
  },
  animation: {
    thinkingStyle: 'dots',
    sendButtonAnimation: 'scale',
    messageAppearAnimation: 'fade',
  },
};
