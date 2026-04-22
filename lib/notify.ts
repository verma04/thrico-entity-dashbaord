import { toast, ExternalToast } from "sonner";

// ──────────────────────────────────────────────
// Audio feedback
// ──────────────────────────────────────────────

function playAudioFile(src: string, volume = 0.3) {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {
    // Silently fail — audio feedback is non-critical
  }
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail
  }
}

function playSuccessSound() {
  playTone(523.25, 0.1, "sine", 0.12);
  setTimeout(() => playTone(659.25, 0.1, "sine", 0.12), 80);
  setTimeout(() => playTone(783.99, 0.15, "sine", 0.1), 160);
}

function playErrorSound() {
  playAudioFile("/error.mp3", 0.4);
}

// ──────────────────────────────────────────────
// Reusable notify utility
// ──────────────────────────────────────────────

export const notify = {
  success(message: string, options?: ExternalToast) {
    playSuccessSound();
    return toast.success(message, options);
  },

  error(message: string, options?: ExternalToast) {
    playErrorSound();
    return toast.error(message, options);
  },

  info(message: string, options?: ExternalToast) {
    return toast.info(message, options);
  },

  warning(message: string, options?: ExternalToast) {
    playTone(440, 0.15, "triangle", 0.1);
    return toast.warning(message, options);
  },

  loading(message: string, options?: ExternalToast) {
    return toast.loading(message, options);
  },

  dismiss(id?: string | number) {
    return toast.dismiss(id);
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    },
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: (data) => {
        playSuccessSound();
        return typeof messages.success === "function"
          ? messages.success(data)
          : messages.success;
      },
      error: (err) => {
        playErrorSound();
        return typeof messages.error === "function"
          ? messages.error(err)
          : messages.error;
      },
    });
  },
};
