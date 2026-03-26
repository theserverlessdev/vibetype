import type { Theme } from '../types';

export const terminal: Theme = {
  id: 'terminal',
  name: 'Terminal',
  description: 'Retro terminal with green-on-black text',
  colors: {
    background: '#000000',
    surface: '#000000',
    userBubble: 'transparent',
    userText: '#00ff00',
    aiBubble: 'transparent',
    aiText: '#00ff00',
    accent: '#00ff00',
    inputBackground: '#000000',
    inputText: '#00ff00',
    inputBorder: '#00ff00',
    headerBackground: '#000000',
    headerText: '#00ff00',
  },
  fonts: {
    ui: "'JetBrains Mono', 'Fira Code', monospace",
    chat: "'JetBrains Mono', 'Fira Code', monospace",
    code: "'JetBrains Mono', 'Fira Code', monospace",
  },
  layout: {
    bubbleStyle: 'none',
    userMessageAlign: 'left',
    showAvatar: false,
    avatarShape: 'none',
    inputStyle: 'terminal',
  },
  branding: {
    modelName: 'system',
    avatarSvg: '',
    headerTitle: 'terminal@ai:~$',
    showModelBadge: false,
  },
  animation: {
    thinkingStyle: 'cursor',
    sendButtonAnimation: 'none',
    messageAppearAnimation: 'none',
  },
};
