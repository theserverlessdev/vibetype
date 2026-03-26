# PRD: AI Chat Simulator & Video Generator

## Project Name: **VibeType** (working title)

## Overview

A web application where users input a prompt and a predefined answer, then watch (and record) a realistic AI chat simulation — complete with typing animations, thinking/loading indicators, and themed interfaces that mimic popular LLM providers. The primary output is a **downloadable MP4/WebM video** of the simulated conversation, designed for social media sharing, memes, demos, and content creation.

---

## Tech Stack

- **Framework:** Astro v5 with React islands (interactive components use React via `client:only="react"`)
- **Styling:** Tailwind CSS v4
- **Video Export:** Canvas-based rendering using `html2canvas` (or manual canvas drawing) + `MediaRecorder` API for WebM capture, with optional `ffmpeg.wasm` for MP4 conversion
- **Deployment:** Cloudflare Pages
- **No backend required** — everything runs client-side

---

## Core User Flow

```
1. User lands on homepage
2. User types/pastes a PROMPT (the question)
3. User types/pastes an ANSWER (the predefined response)
4. User selects a THEME (visual style)
5. User adjusts SETTINGS (typing speed, delays, etc.)
6. User clicks "Generate Preview"
7. Animation plays in a preview window:
   a. Chat UI appears empty
   b. User message "types in" character by character
   c. Send button animates / message appears in chat bubble
   d. Thinking/loading indicator appears (dots, shimmer, spinner — theme-dependent)
   e. AI response "types out" word-by-word (streaming simulation)
   f. Animation completes
8. User can "Replay" or click "Download Video"
9. Video is rendered and downloaded as .webm (with optional .mp4)
```

---

## Detailed Feature Requirements

### F1: Input Panel

The input panel sits on the left side (desktop) or top (mobile) of the screen.

**Fields:**
- **Prompt Input:** `<textarea>` — placeholder: "Type your question..." — max 2000 chars — char counter shown
- **Answer Input:** `<textarea>` — placeholder: "Type the AI response..." — max 10000 chars — char counter shown — supports basic markdown (bold, italic, code blocks, bullet lists)
- **Theme Selector:** Visual grid of theme cards (see F3) — each card shows a mini-preview thumbnail of the theme's look
- **Settings Panel:** Collapsible section with sliders/toggles (see F4)
- **"Generate Preview" Button:** Primary CTA — triggers the animation in the preview panel
- **"Download Video" Button:** Secondary CTA — appears after preview has played at least once

**Layout Behavior:**
- Desktop (≥1024px): Side-by-side — input panel (400px fixed width) | preview panel (flex fill)
- Tablet (768–1023px): Stacked — input on top, preview below
- Mobile (<768px): Stacked — input on top, preview below — preview scales to full width with 16:9 aspect ratio maintained

### F2: Preview / Animation Panel

This is where the simulated chat plays out. It is a **self-contained rectangular frame** with a fixed aspect ratio of **16:9** (1280×720 logical pixels) so the exported video is a standard resolution.

**Animation Sequence (default timing, all configurable):**

| Step | What Happens | Default Duration |
|------|-------------|-----------------|
| 1 | Empty chat screen renders with theme chrome (header bar, model name, avatar) | 500ms hold |
| 2 | Text cursor appears in the input field at the bottom | 300ms |
| 3 | User's prompt types in character-by-character | 40ms per char |
| 4 | Brief pause after typing completes | 400ms |
| 5 | Send button highlights / animates | 200ms |
| 6 | User message appears as a sent chat bubble (right-aligned or theme-appropriate) | instant |
| 7 | Input field clears | instant |
| 8 | Thinking indicator appears (animated dots, shimmer bar, or theme-specific) | 1500ms–3000ms (configurable) |
| 9 | Thinking indicator disappears | instant |
| 10 | AI response types out **word-by-word** (not char-by-char — mimics streaming tokens) | 30ms per word (configurable) |
| 11 | Response complete — cursor/caret disappears | 200ms fade |
| 12 | Hold on completed state | 1500ms |
| 13 | End of animation | — |

**Markdown Rendering in AI Response:**
The AI response must render markdown as it "types in." Specifically:
- **Bold** and *italic* text render inline as the words appear
- `inline code` renders with a code background as soon as the backtick-wrapped word appears
- Code blocks (```) render as a code container that fills in line-by-line
- Bullet lists render with bullet points appearing as each line types
- The typing cursor sits at the end of the latest rendered content

**Chat Bubble Styling:**
- User messages: Right-aligned bubble (or theme-appropriate)
- AI messages: Left-aligned, with an avatar/icon next to the bubble
- The chat area scrolls up smoothly if the response is longer than the visible area

**Controls Overlay (visible on hover/tap):**
- Play/Pause button
- Restart button
- Progress bar (scrubbing not required for MVP, just visual)

### F3: Themes

Each theme is a configuration object that defines colors, fonts, layout tweaks, avatar, model name, and animation style. **Ship with 4 themes at launch:**

#### Theme 1: "Midnight" (Default / Unique)
- Dark background (#0a0a0a), subtle grid pattern
- Accent color: Electric blue (#3b82f6)
- Font: Inter or system sans-serif
- Thinking indicator: Three pulsing dots
- Chat bubbles: Rounded rectangles with subtle shadow
- Model name: "AI Assistant"
- Avatar: Generic sparkle/brain icon (SVG)
- Input area: Dark with subtle border, glowing accent on focus

#### Theme 2: "Clean Light"
- Light background (#ffffff), minimal chrome
- Accent color: Green (#10a37f)
- Font: Söhne or system sans-serif
- Thinking indicator: Three bouncing dots with shimmer
- Chat bubbles: Minimal, left-aligned response with no bubble (just text block)
- Model name: "Assistant"
- Avatar: Simple circle icon
- Input area: Rounded pill with border

#### Theme 3: "Artifact"
- Light cream/warm background (#faf9f6)
- Accent color: Warm orange/terracotta (#c96442)
- Font: System serif for responses, sans-serif for UI
- Thinking indicator: Subtle pulsing line
- Chat bubbles: Clean with thin left border accent on AI response
- Model name: "Claude"
- Avatar: Warm-toned abstract icon
- Input area: Clean with warm-toned border

#### Theme 4: "Terminal"
- Black background (#000000) with green text (#00ff00)
- Monospace font (JetBrains Mono or Fira Code)
- Thinking indicator: Blinking cursor with "Processing..." text
- No chat bubbles — raw text with `>` prefix for user, no prefix for AI
- Model name: "system"
- Avatar: None — uses `$` prompt symbol
- Input area: Terminal-style with blinking block cursor

**Theme Configuration Object Shape (TypeScript):**
```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;        // chat area background
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
  };
  fonts: {
    ui: string;             // font for chrome/UI elements
    chat: string;           // font for chat messages
    code: string;           // font for code blocks
  };
  layout: {
    bubbleStyle: 'rounded' | 'minimal' | 'bordered' | 'none';
    userMessageAlign: 'right' | 'left';
    showAvatar: boolean;
    avatarShape: 'circle' | 'rounded-square' | 'none';
    inputStyle: 'pill' | 'rectangle' | 'terminal';
  };
  branding: {
    modelName: string;
    avatarSvg: string;      // inline SVG string for the AI avatar
    headerTitle: string;    // text shown in the top bar
    showModelBadge: boolean; // e.g., "GPT-4" badge next to model name
    modelBadgeText?: string;
  };
  animation: {
    thinkingStyle: 'dots' | 'shimmer' | 'cursor' | 'pulse-line';
    sendButtonAnimation: 'scale' | 'slide' | 'none';
    messageAppearAnimation: 'fade' | 'slide-up' | 'none';
  };
}
```

### F4: Settings / Configuration

Exposed as sliders and toggles in a collapsible "Settings" section below the textareas.

| Setting | Type | Default | Range/Options |
|---------|------|---------|---------------|
| User typing speed | Slider | 40ms/char | 10ms–100ms |
| AI typing speed | Slider | 30ms/word | 10ms–80ms |
| Thinking duration | Slider | 2000ms | 500ms–5000ms |
| Show user typing animation | Toggle | ON | ON/OFF (if OFF, user message appears instantly as a bubble) |
| End hold duration | Slider | 1500ms | 500ms–5000ms |
| Video quality | Select | 720p | 720p / 1080p |

### F5: Video Export

This is the most technically complex feature. The approach:

**Rendering Strategy:**
1. The entire preview panel is rendered inside a **`<canvas>`** element (not DOM screen capture)
2. Use one of these approaches (in order of preference):
   - **Approach A (Recommended):** Render the chat UI as a React component inside an offscreen container, use `html2canvas` to capture each frame at ~30fps during animation playback, pipe frames to a `<canvas>`, and use `MediaRecorder` on the canvas stream (`canvas.captureStream(30)`) to produce a WebM blob
   - **Approach B (Simpler but lower quality):** Use `MediaRecorder` with `getDisplayMedia` — but this requires user permission and captures the whole screen, so it's less ideal
   - **Approach C (Best quality, heavier):** Use `ffmpeg.wasm` to encode frames into MP4 — heavier download but produces MP4 directly

3. **For MVP, use Approach A** — it works without permissions and produces decent quality WebM files

**Export Flow:**
1. User clicks "Download Video"
2. Show a progress modal: "Rendering video... X%"
3. The animation replays internally (can be faster than real-time if possible, otherwise real-time)
4. Each frame is captured to canvas
5. MediaRecorder encodes the stream
6. On completion, trigger a browser download of the `.webm` file
7. File name format: `vibetype-{theme}-{timestamp}.webm`

**Video Specs:**
- Resolution: 1280×720 (default) or 1920×1080 (if selected)
- Frame rate: 30fps
- Format: WebM (VP9 codec) — widest browser support for MediaRecorder
- File size estimate: ~2-5MB for a 15-second clip

### F6: Landing Page / Homepage

The homepage IS the app — no separate landing page. The layout is:

```
┌─────────────────────────────────────────────────┐
│  Header: Logo + "VibeType" + GitHub link         │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│  Prompt Input    │     Preview Panel            │
│                  │     (16:9 aspect ratio)      │
│  Answer Input    │                              │
│                  │     Shows placeholder        │
│  Theme Selector  │     state until first        │
│  (grid)          │     "Generate" click         │
│                  │                              │
│  Settings        │                              │
│  (collapsible)   │                              │
│                  │                              │
│  [Generate]      │                              │
│  [Download]      │                              │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│  Footer: "Made with VibeType" + link            │
└─────────────────────────────────────────────────┘
```

**Placeholder state for Preview Panel** (before first generate): Show the selected theme's empty chat UI with a subtle message like "Enter a prompt and answer, then click Generate to preview your AI chat simulation."

---

## File Structure

```
/
├── src/
│   ├── components/
│   │   ├── InputPanel.tsx          # Prompt, answer textareas, theme selector, settings
│   │   ├── PreviewPanel.tsx        # Animation playback container
│   │   ├── ChatSimulator.tsx       # Core animation engine — renders chat frame-by-frame
│   │   ├── ThinkingIndicator.tsx   # Animated thinking dots/shimmer/cursor per theme
│   │   ├── ChatBubble.tsx          # Single message bubble (user or AI)
│   │   ├── MarkdownRenderer.tsx    # Progressive markdown rendering during typing
│   │   ├── ThemeSelector.tsx       # Grid of theme preview cards
│   │   ├── SettingsPanel.tsx       # Sliders and toggles for timing/quality
│   │   ├── VideoExporter.tsx       # Video rendering and download logic
│   │   ├── ProgressModal.tsx       # "Rendering video..." overlay
│   │   └── App.tsx                 # Main app — composes InputPanel + PreviewPanel
│   ├── themes/
│   │   ├── index.ts                # Theme registry — exports all themes
│   │   ├── midnight.ts             # Theme 1 config
│   │   ├── clean-light.ts          # Theme 2 config
│   │   ├── artifact.ts             # Theme 3 config
│   │   └── terminal.ts             # Theme 4 config
│   ├── hooks/
│   │   ├── useAnimationEngine.ts   # Core hook — manages animation state machine
│   │   ├── useVideoRecorder.ts     # MediaRecorder + canvas capture logic
│   │   └── useTypingEffect.ts      # Character/word-by-word typing logic
│   ├── utils/
│   │   ├── markdown.ts             # Lightweight markdown parser for progressive rendering
│   │   └── timing.ts               # Timing/easing utilities
│   ├── types/
│   │   └── index.ts                # TypeScript types (Theme, AnimationState, Settings, etc.)
│   ├── pages/
│   │   └── index.astro             # Main page — loads App.tsx as React island
│   └── layouts/
│       └── Layout.astro            # Base HTML layout
├── public/
│   └── fonts/                      # Self-hosted fonts if needed (JetBrains Mono for terminal theme)
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Animation State Machine

The animation is driven by a state machine with these states:

```
IDLE → USER_TYPING → USER_SENT → THINKING → AI_TYPING → COMPLETE → IDLE
```

**State definitions:**

```typescript
type AnimationState =
  | { phase: 'idle' }
  | { phase: 'user_typing'; charIndex: number }        // current char being shown
  | { phase: 'user_sent' }                              // message bubble appears
  | { phase: 'thinking'; elapsed: number }              // thinking indicator visible
  | { phase: 'ai_typing'; wordIndex: number }           // current word being shown
  | { phase: 'complete'; holdElapsed: number }           // final hold before done
  | { phase: 'done' };                                   // animation finished

interface AnimationConfig {
  prompt: string;
  answer: string;
  userTypingSpeed: number;    // ms per character
  aiTypingSpeed: number;      // ms per word
  thinkingDuration: number;   // ms
  showUserTyping: boolean;
  endHoldDuration: number;    // ms
}
```

The `useAnimationEngine` hook uses `requestAnimationFrame` for smooth animation and exposes:
```typescript
{
  state: AnimationState;
  play: () => void;
  pause: () => void;
  restart: () => void;
  isPlaying: boolean;
  progress: number;          // 0-1 for progress bar
  visiblePrompt: string;     // substring of prompt to show during USER_TYPING
  visibleAnswer: string;     // substring of answer to show during AI_TYPING (word-boundary)
}
```

---

## Markdown Progressive Rendering

During the `AI_TYPING` phase, the answer text is revealed word-by-word. The markdown renderer must handle partial markdown gracefully:

**Rules:**
1. Split the full answer into words (split on whitespace)
2. At each frame, join words `[0..wordIndex]` back into a string
3. Parse that partial string as markdown
4. Render the parsed markdown
5. Handle edge cases:
   - An unclosed `**bold` should NOT render the `**` — wait until the closing `**` word appears, then render the whole phrase as bold
   - An unclosed `` ``` `` code block should show the code fence and content as-is until the closing fence appears
   - Bullet points (`- item`) render as soon as the line starts
6. Use a simple custom parser — do NOT pull in a heavy library like `remark`. Only support: bold, italic, inline code, code blocks, and bullet lists.

---

## Video Recording Implementation

```typescript
// useVideoRecorder.ts — pseudocode outline

function useVideoRecorder(previewRef: RefObject<HTMLDivElement>) {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  async function startRecording(animationDuration: number, quality: '720p' | '1080p') {
    const width = quality === '1080p' ? 1920 : 1280;
    const height = quality === '1080p' ? 1080 : 720;

    // 1. Create offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 2. Start MediaRecorder on canvas stream
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5_000_000,
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    // 3. Start recording
    recorder.start();
    setIsRecording(true);

    // 4. Frame capture loop — capture at ~30fps
    //    Use html2canvas to snapshot the previewRef div
    //    Draw onto the canvas
    //    Update progress based on elapsed time vs total duration
    const fps = 30;
    const interval = 1000 / fps;
    let elapsed = 0;

    const captureFrame = async () => {
      if (elapsed >= animationDuration + 500) {
        recorder.stop();
        setIsRecording(false);
        return;
      }

      const frameCanvas = await html2canvas(previewRef.current, {
        width, height, scale: 1,
        backgroundColor: null,
        useCORS: true,
      });
      ctx.drawImage(frameCanvas, 0, 0, width, height);
      setProgress(elapsed / animationDuration);
      elapsed += interval;
      setTimeout(captureFrame, interval);
    };

    captureFrame();

    // 5. On stop, assemble blob and trigger download
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vibetype-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
  }

  return { startRecording, isRecording, progress };
}
```

**Important Notes for Implementation:**
- `html2canvas` must be installed: `npm install html2canvas`
- The preview panel must be rendered at the exact pixel dimensions of the target video (1280×720 or 1920×1080) inside a container — use CSS `transform: scale()` to fit it visually on screen while keeping the actual DOM at full resolution
- During recording, the animation should replay from the beginning automatically
- If `html2canvas` performance is too slow for 30fps, drop to 15fps — it's still acceptable for this type of content
- Alternative: Instead of `html2canvas`, manually draw the chat UI on canvas using Canvas 2D API. This is faster but requires reimplementing the entire UI in canvas draw calls. Only do this if `html2canvas` approach is too slow.

---

## Edge Cases & Error Handling

1. **Empty prompt or answer:** Disable "Generate" button. Show inline validation "Both fields are required."
2. **Very long answer (>5000 words):** Show warning "Long responses may take a while to animate and export." Still allow it.
3. **Browser doesn't support MediaRecorder:** Show message "Video export is not supported in your browser. Try Chrome or Firefox." Hide the download button.
4. **Recording fails mid-way:** Catch errors, show toast "Video export failed. Try again or reduce quality."
5. **Mobile:** Video export should work but show a note "Export may take longer on mobile devices."
6. **Special characters / emoji in prompt or answer:** Must render correctly in both the chat UI and the exported video.
7. **Code blocks in answer:** Must render with syntax-appropriate monospace font and a darker/lighter background block, matching the theme.

---

## Performance Requirements

- **Preview animation:** Must run at 60fps with no jank. Use `requestAnimationFrame`, avoid layout thrashing.
- **Video export:** Target ≤2x real-time for rendering (a 15-second animation should export in ≤30 seconds on a modern laptop).
- **Initial page load:** <2 seconds on 4G. Lazy-load `html2canvas` and any heavy dependencies.
- **Bundle size target:** <500KB gzipped for initial load.

---

## Not In Scope (Future Features — Do Not Build)

- User accounts or saving configurations
- Server-side rendering of videos
- Custom theme builder UI
- Multi-turn conversations (only single prompt→response for MVP)
- Audio/sound effects
- Watermark on exported video
- Social sharing integrations (direct post to Twitter, etc.)
- Analytics or tracking

---

## Acceptance Criteria

The project is complete when:

1. ✅ User can enter a prompt and answer in text fields
2. ✅ User can select from 4 themes and see the preview update
3. ✅ Clicking "Generate" plays a smooth animation showing: user typing → message sent → thinking indicator → AI response streaming word-by-word with markdown rendering
4. ✅ Animation can be replayed without re-entering text
5. ✅ Settings (typing speed, thinking duration, etc.) affect the animation in real-time
6. ✅ Clicking "Download Video" renders the animation to a WebM file and downloads it
7. ✅ Exported video is 1280×720 at 30fps with the chat animation rendered correctly
8. ✅ All 4 themes render correctly in both preview and exported video
9. ✅ Responsive layout works on desktop (≥1024px) and mobile (<768px)
10. ✅ No console errors, no unhandled promise rejections, no visual glitches during animation
