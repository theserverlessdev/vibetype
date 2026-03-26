import type { Theme } from '../types';

export const cleanLight: Theme = {
  id: 'clean-light',
  name: 'Clean Light',
  description: 'Minimal light theme with green accents',
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    userBubble: '#f0f0f0',
    userText: '#1a1a1a',
    aiBubble: 'transparent',
    aiText: '#1a1a1a',
    accent: '#10a37f',
    inputBackground: '#ffffff',
    inputText: '#1a1a1a',
    inputBorder: '#d9d9e3',
    headerBackground: '#ffffff',
    headerText: '#1a1a1a',
  },
  fonts: {
    ui: 'system-ui, sans-serif',
    chat: 'system-ui, sans-serif',
    code: "'JetBrains Mono', 'Fira Code', monospace",
  },
  layout: {
    bubbleStyle: 'minimal',
    userMessageAlign: 'right',
    showAvatar: true,
    avatarShape: 'circle',
    inputStyle: 'pill',
  },
  branding: {
    modelName: 'Assistant',
    avatarSvg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#10a37f"/><path d="M12 7v5l3 3" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    headerTitle: 'Assistant',
    showModelBadge: true,
    modelBadgeText: 'GPT-4',
  },
  animation: {
    thinkingStyle: 'shimmer',
    sendButtonAnimation: 'scale',
    messageAppearAnimation: 'fade',
  },
};
