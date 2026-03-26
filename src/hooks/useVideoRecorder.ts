import { useState, useCallback, useRef } from 'react';

export function useVideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = useCallback(
    async (
      previewEl: HTMLDivElement,
      animationDuration: number,
      quality: '720p' | '1080p',
      themeName: string,
      onReplay: () => void
    ) => {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const width = quality === '1080p' ? 1920 : 1280;
      const height = quality === '1080p' ? 1080 : 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
      });
      recorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibetype-${themeName}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setProgress(0);
      };

      recorder.start(100);
      setIsRecording(true);
      setProgress(0);

      // Trigger replay
      onReplay();

      const fps = 15; // Use 15fps for html2canvas perf
      const interval = 1000 / fps;
      let elapsed = 0;
      const totalDuration = animationDuration + 500;

      const captureFrame = async () => {
        if (elapsed >= totalDuration || !recorderRef.current) {
          if (recorderRef.current && recorderRef.current.state === 'recording') {
            recorderRef.current.stop();
          }
          return;
        }

        try {
          const frameCanvas = await html2canvas(previewEl, {
            width: previewEl.offsetWidth,
            height: previewEl.offsetHeight,
            scale: width / previewEl.offsetWidth,
            backgroundColor: null,
            useCORS: true,
            logging: false,
          });
          ctx.drawImage(frameCanvas, 0, 0, width, height);
        } catch {
          // Skip frame on error
        }

        elapsed += interval;
        setProgress(Math.min(elapsed / animationDuration, 1));
        setTimeout(captureFrame, interval);
      };

      captureFrame();
    },
    []
  );

  const supportsRecording = useCallback((): boolean => {
    return typeof MediaRecorder !== 'undefined' && typeof HTMLCanvasElement.prototype.captureStream === 'function';
  }, []);

  return { startRecording, isRecording, progress, supportsRecording };
}
