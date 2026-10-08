// Tiny synthesized sounds via WebAudio, so no audio files are needed.
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', when = 0, gain = 0.08) {
  const c = audio()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, c.currentTime + when)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + when + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + when)
  o.stop(c.currentTime + when + dur + 0.05)
}

export const sfx = {
  correct: () => { tone(660, 0.12); tone(880, 0.18, 'sine', 0.08) },
  wrong: () => { tone(220, 0.25, 'triangle'); tone(180, 0.3, 'triangle', 0.1) },
  flip: () => tone(500, 0.05, 'square', 0, 0.03),
  levelUp: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'sine', i * 0.1)),
  done: () => [659, 784, 988].forEach((f, i) => tone(f, 0.3, 'sine', i * 0.12)),
}
