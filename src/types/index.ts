export interface ThemeColors {
  background: string;
  surface: string;
  userBubble: string;
  userText: string;
  aiBubble: string;
  aiText: string;
  accent: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  headerBackground: string;
  headerText: string;
}

export interface ThemeFonts {
  ui: string;
  chat: string;
  code: string;
}

export interface ThemeLayout {
  bubbleStyle: 'rounded' | 'minimal' | 'bordered' | 'none';
  userMessageAlign: 'right' | 'left';
  showAvatar: boolean;
  avatarShape: 'circle' | 'rounded-square' | 'none';
  inputStyle: 'pill' | 'rectangle' | 'terminal';
}

export interface ThemeBranding {
  modelName: string;
  avatarSvg: string;
  headerTitle: string;
  showModelBadge: boolean;
  modelBadgeText?: string;
}

export interface ThemeAnimation {
  thinkingStyle: 'dots' | 'shimmer' | 'cursor' | 'pulse-line';
  sendButtonAnimation: 'scale' | 'slide' | 'none';
  messageAppearAnimation: 'fade' | 'slide-up' | 'none';
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
  branding: ThemeBranding;
  animation: ThemeAnimation;
}

export type AnimationPhase =
  | 'idle'
  | 'user_typing'
  | 'user_sent'
  | 'thinking'
  | 'ai_typing'
  | 'complete'
  | 'done';

export type AnimationState =
  | { phase: 'idle' }
  | { phase: 'user_typing'; charIndex: number }
  | { phase: 'user_sent' }
  | { phase: 'thinking'; elapsed: number }
  | { phase: 'ai_typing'; wordIndex: number }
  | { phase: 'complete'; holdElapsed: number }
  | { phase: 'done' };

export interface AnimationConfig {
  prompt: string;
  answer: string;
  userTypingSpeed: number;
  aiTypingSpeed: number;
  thinkingDuration: number;
  showUserTyping: boolean;
  endHoldDuration: number;
}

export interface Settings {
  userTypingSpeed: number;
  aiTypingSpeed: number;
  thinkingDuration: number;
  showUserTyping: boolean;
  endHoldDuration: number;
  videoQuality: '720p' | '1080p';
}

export interface AnimationEngineResult {
  state: AnimationState;
  play: () => void;
  pause: () => void;
  restart: () => void;
  isPlaying: boolean;
  progress: number;
  visiblePrompt: string;
  visibleAnswer: string;
}
