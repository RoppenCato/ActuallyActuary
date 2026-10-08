import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { newCard, review, type CardState, type Grade } from '../lib/srs'

export type Streak = { count: number; lastDay: string; freezes: number; best: number }

export type Stats = {
  answered: number
  correct: number
  sessions: number
  bestCombo: number
  bestBlitzCorrect: number
  blitzRounds: number
  perfectMatches: number
  matchRounds: number
}

export type ProgressState = {
  version: 1
  cards: Record<string, CardState>
  /** Cards the user has flagged as bad. Excluded from sessions until removed from content. */
  flagged: Record<string, number>
  xp: number
  streak: Streak
  stats: Stats
  /** Best blitz score per scope key ("all", "cat", "cat/sub"). */
  highscores: Record<string, number>
  /** Achievement id -> unlock timestamp. */
  achievements: Record<string, number>
  settings: { sound: boolean; sessionSize: number }

  answer: (itemId: string, grade: Grade) => { xpGained: number; streakChanged: boolean }
  toggleFlag: (itemId: string) => void
  finishSession: () => void
  addXp: (n: number) => void
  recordCombo: (combo: number) => void
  recordBlitz: (scope: string, score: number, correct: number) => { newHighscore: boolean }
  recordMatch: (perfect: boolean) => void
  unlock: (id: string) => void
  setSetting: <K extends keyof ProgressState['settings']>(key: K, value: ProgressState['settings'][K]) => void
  exportJson: () => string
  importJson: (json: string) => boolean
  reset: () => void
}

const XP_FOR_GRADE: Record<Grade, number> = { 0: 1, 1: 5, 2: 10, 3: 12 }

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysBetween(a: string, b: string): number {
  if (!a) return Infinity
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

export function levelFromXp(xp: number): { level: number; into: number; needed: number } {
  // Level n requires 100 * n^1.5 cumulative XP beyond the previous level.
  let level = 1
  let remaining = xp
  let needed = 100
  while (remaining >= needed) {
    remaining -= needed
    level++
    needed = Math.round(100 * Math.pow(level, 1.5))
  }
  return { level, into: remaining, needed }
}

/** Advances the streak for today. Returns the new streak and whether it changed. */
function bumpStreak(streak: Streak): { streak: Streak; changed: boolean } {
  const today = todayKey()
  if (streak.lastDay === today) return { streak, changed: false }
  const s = { ...streak }
  const gap = daysBetween(s.lastDay, today)
  if (gap === 1) s.count++
  else if (gap === 2 && s.freezes > 0) { s.freezes--; s.count++ }
  else s.count = 1
  s.lastDay = today
  s.best = Math.max(s.best, s.count)
  if (s.count % 7 === 0) s.freezes = Math.min(2, s.freezes + 1)
  return { streak: s, changed: true }
}

const initialStats: Stats = {
  answered: 0, correct: 0, sessions: 0, bestCombo: 0, bestBlitzCorrect: 0, blitzRounds: 0, perfectMatches: 0, matchRounds: 0,
}

const initial = {
  version: 1 as const,
  cards: {},
  flagged: {},
  xp: 0,
  streak: { count: 0, lastDay: '', freezes: 1, best: 0 },
  stats: initialStats,
  highscores: {},
  achievements: {},
  settings: { sound: true, sessionSize: 15 },
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,

      answer: (itemId, grade) => {
        const s = get()
        const prev = s.cards[itemId] ?? newCard()
        const next = review(prev, grade)
        const { streak, changed } = bumpStreak(s.streak)
        const streakBonus = Math.min(5, Math.floor(streak.count / 3))
        const xpGained = XP_FOR_GRADE[grade] + (grade > 0 ? streakBonus : 0)
        set({
          cards: { ...s.cards, [itemId]: next },
          xp: s.xp + xpGained,
          streak,
          stats: { ...s.stats, answered: s.stats.answered + 1, correct: s.stats.correct + (grade > 0 ? 1 : 0) },
        })
        return { xpGained, streakChanged: changed }
      },

      toggleFlag: (itemId) =>
        set((s) => {
          const flagged = { ...s.flagged }
          if (flagged[itemId]) delete flagged[itemId]
          else flagged[itemId] = Date.now()
          return { flagged }
        }),

      finishSession: () => set((s) => ({ stats: { ...s.stats, sessions: s.stats.sessions + 1 }, xp: s.xp + 20 })),

      addXp: (n) => set((s) => ({ xp: s.xp + n, streak: bumpStreak(s.streak).streak })),

      recordCombo: (combo) => set((s) => (combo > s.stats.bestCombo ? { stats: { ...s.stats, bestCombo: combo } } : {})),

      recordBlitz: (scope, score, correct) => {
        const s = get()
        const newHighscore = score > (s.highscores[scope] ?? 0)
        set({
          highscores: newHighscore ? { ...s.highscores, [scope]: score } : s.highscores,
          stats: { ...s.stats, blitzRounds: s.stats.blitzRounds + 1, bestBlitzCorrect: Math.max(s.stats.bestBlitzCorrect, correct) },
        })
        return { newHighscore }
      },

      recordMatch: (perfect) =>
        set((s) => ({ stats: { ...s.stats, matchRounds: s.stats.matchRounds + 1, perfectMatches: s.stats.perfectMatches + (perfect ? 1 : 0) } })),

      unlock: (id) => set((s) => (s.achievements[id] ? {} : { achievements: { ...s.achievements, [id]: Date.now() } })),

      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

      exportJson: () => {
        const { cards, flagged, xp, streak, stats, highscores, achievements, settings, version } = get()
        return JSON.stringify({ version, exportedAt: new Date().toISOString(), cards, flagged, xp, streak, stats, highscores, achievements, settings }, null, 2)
      },

      importJson: (json) => {
        try {
          const d = JSON.parse(json)
          if (!d || typeof d !== 'object' || !d.cards) return false
          set({
            cards: d.cards ?? {},
            flagged: d.flagged ?? {},
            xp: d.xp ?? 0,
            streak: { ...initial.streak, ...(d.streak ?? {}) },
            stats: { ...initialStats, ...(d.stats ?? {}) },
            highscores: d.highscores ?? {},
            achievements: d.achievements ?? {},
            settings: { ...initial.settings, ...(d.settings ?? {}) },
          })
          return true
        } catch {
          return false
        }
      },

      reset: () => set({ ...initial }),
    }),
    {
      name: 'actuallyactuary-progress',
      // Fill in fields added after the first release so older saves keep working.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressState>
        return { ...current, ...p, stats: { ...initialStats, ...(p.stats ?? {}) }, highscores: p.highscores ?? {}, achievements: p.achievements ?? {}, flagged: p.flagged ?? {} }
      },
    },
  ),
)
