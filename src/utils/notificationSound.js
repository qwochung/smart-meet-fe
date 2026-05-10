let audioContext = null;
let unlocked = false;

const getAudioContext = () => {
  if (audioContext) return audioContext;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioContext = new Ctx();
  return audioContext;
};

export const ensureAudioUnlocked = async () => {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // iOS/Safari sometimes needs a short silent sound to fully unlock.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.00001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);

    unlocked = true;
    return true;
  } catch {
    return false;
  }
};

const scheduleBeep = (ctx, startTime, { frequency = 880, duration = 0.09 } = {}) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, startTime);

  // Smooth envelope to avoid clicks
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
};

export const playNotificationBeep = async (
  kind = "generic",
  { volume = 1 } = {},
) => {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (!unlocked || ctx.state === "suspended") {
      await ensureAudioUnlocked();
    }
    if (ctx.state === "suspended") return false;

    const base = ctx.currentTime + 0.01;
    const master = ctx.createGain();
    master.gain.value = Math.max(0, Math.min(1, volume)) * 0.9;
    master.connect(ctx.destination);

    const route = (startTime, config) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(config.frequency ?? 880, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(
        (config.peak ?? 0.12) * master.gain.value,
        startTime + 0.01,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + (config.duration ?? 0.09));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + (config.duration ?? 0.09) + 0.02);
    };

    if (kind === "join-request") {
      // 2 short beeps
      route(base, { frequency: 880, duration: 0.08, peak: 0.12 });
      route(base + 0.12, { frequency: 1175, duration: 0.08, peak: 0.12 });
      return true;
    }

    if (kind === "user-return") {
      // 1 mid beep
      route(base, { frequency: 784, duration: 0.12, peak: 0.11 });
      return true;
    }

    scheduleBeep(ctx, base, { frequency: 880, duration: 0.1 });
    return true;
  } catch {
    return false;
  }
};
