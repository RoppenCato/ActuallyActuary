import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { newCard, review, type CardState, type Grade } from '../lib/srs'

export type Streak = { count: number; lastDay: string; freezes: number; best: number }

export type ProgressState = {
  version: 1
  cards: Record<string, CardState>
  /** Cards the user has flagged as bad. Excluded from sessions until removed from content. */
  flagged: Record<string, number>
  xp: number
  streak: Streak
  stats: { answered: number; correct: number; sessions: number }
  settings: { sound: boolean; sessionSize: number }

  answer: (itemId: string, grade: Grade) => { xpGained: number; streakChanged: boolean }
  toggleFlag: (itemId: string) => void
  finishSession: () => void
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

const initial = {
  version: 1 as const,
  cards: {},
  flagged: {},
  xp: 0,
  streak: { count: 0, lastDay: '', freezes: 1, best: 0 },
  stats: { answered: 0, correct: 0, sessions: 0 },
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

        // Streak
        const today = todayKey()
        let streak = { ...s.streak }
        let streakChanged = false
        if (streak.lastDay !== today) {
          const gap = daysBetween(streak.lastDay, today)
          if (gap === 1) streak.count++
          else if (gap === 2 && streak.freezes > 0) { streak.freezes--; streak.count++ }
          else streak.count = 1
          streak.lastDay = today
          streak.best = Math.max(streak.best, streak.count)
          if (streak.count % 7 === 0) streak.freezes = Math.min(2, streak.freezes + 1)
          streakChanged = true
        }

        const streakBonus = Math.min(5, Math.floor(streak.count / 3))
        const xpGained = XP_FOR_GRADE[grade] + (grade > 0 ? streakBonus : 0)

        set({
          cards: { ...s.cards, [itemId]: next },
          xp: s.xp + xpGained,
          streak,
          stats: {
            ...s.stats,
            answered: s.stats.answered + 1,
            correct: s.stats.correct + (grade > 0 ? 1 : 0),
          },
        })
        return { xpGained, streakChanged }
      },

      toggleFlag: (itemId) =>
        set((s) => {
          const flagged = { ...s.flagged }
          if (flagged[itemId]) delete flagged[itemId]
          else flagged[itemId] = Date.now()
          return { flagged }
        }),

      finishSession: () => set((s) => ({ stats: { ...s.stats, sessions: s.stats.sessions + 1 }, xp: s.xp + 20 })),

      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

      exportJson: () => {
        const { cards, flagged, xp, streak, stats, settings, version } = get()
        return JSON.stringify({ version, exportedAt: new Date().toISOString(), cards, flagged, xp, streak, stats, settings }, null, 2)
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
            stats: { ...initial.stats, ...(d.stats ?? {}) },
            settings: { ...initial.settings, ...(d.settings ?? {}) },
          })
          return true
        } catch {
          return false
        }
      },

      reset: () => set({ ...initial }),
    }),
    { name: 'actuallyactuary-progress' },
  ),
)
