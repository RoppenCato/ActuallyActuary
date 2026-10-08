import type { ProgressState } from '../store/progress'
import { mastery } from './srs'

export type Achievement = {
  id: string
  icon: string
  title: string
  description: string
  check: (s: ProgressState) => boolean
}

const masteredCount = (s: ProgressState) => Object.values(s.cards).filter((c) => mastery(c) === 'mastered').length
const seenCount = (s: ProgressState) => Object.values(s.cards).filter((c) => c.seen > 0).length

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-session', icon: '🎯', title: 'Första passet', description: 'Klara ett träningspass.', check: (s) => s.stats.sessions >= 1 },
  { id: 'sessions-10', icon: '🏃', title: 'Rutin', description: 'Klara 10 pass.', check: (s) => s.stats.sessions >= 10 },
  { id: 'sessions-50', icon: '🏋️', title: 'Maraton', description: 'Klara 50 pass.', check: (s) => s.stats.sessions >= 50 },
  { id: 'seen-50', icon: '👀', title: 'Nyfiken', description: 'Se 50 olika kort.', check: (s) => seenCount(s) >= 50 },
  { id: 'seen-all-ish', icon: '📚', title: 'Beläst', description: 'Se 250 olika kort.', check: (s) => seenCount(s) >= 250 },
  { id: 'mastered-10', icon: '🧠', title: 'Sitter', description: 'Bemästra 10 kort.', check: (s) => masteredCount(s) >= 10 },
  { id: 'mastered-50', icon: '🎓', title: 'Expert', description: 'Bemästra 50 kort.', check: (s) => masteredCount(s) >= 50 },
  { id: 'mastered-150', icon: '🏛️', title: 'Aktuarie på riktigt', description: 'Bemästra 150 kort.', check: (s) => masteredCount(s) >= 150 },
  { id: 'streak-3', icon: '🔥', title: 'Tre i rad', description: '3 dagars streak.', check: (s) => s.streak.best >= 3 },
  { id: 'streak-7', icon: '🔥', title: 'En vecka', description: '7 dagars streak.', check: (s) => s.streak.best >= 7 },
  { id: 'streak-30', icon: '🌋', title: 'En månad', description: '30 dagars streak.', check: (s) => s.streak.best >= 30 },
  { id: 'answers-100', icon: '💯', title: 'Hundra', description: 'Svara på 100 kort.', check: (s) => s.stats.answered >= 100 },
  { id: 'answers-1000', icon: '🚀', title: 'Tusen', description: 'Svara på 1 000 kort.', check: (s) => s.stats.answered >= 1000 },
  { id: 'level-5', icon: '⭐', title: 'Nivå 5', description: 'Nå nivå 5.', check: (s) => s.xp >= xpForLevel(5) },
  { id: 'level-10', icon: '🌟', title: 'Nivå 10', description: 'Nå nivå 10.', check: (s) => s.xp >= xpForLevel(10) },
  { id: 'blitz-20', icon: '⚡', title: 'Blixtsnabb', description: '20 rätt i en blixtrond.', check: (s) => s.stats.bestBlitzCorrect >= 20 },
  { id: 'combo-10', icon: '🎸', title: 'Combo 10', description: '10 rätt i rad.', check: (s) => s.stats.bestCombo >= 10 },
  { id: 'match-perfect', icon: '🧩', title: 'Pusselmästare', description: 'En felfri matchningsrunda.', check: (s) => s.stats.perfectMatches >= 1 },
]

export function xpForLevel(level: number): number {
  let total = 0
  for (let l = 1; l < level; l++) total += Math.round(100 * Math.pow(l, 1.5))
  return total
}

export function newlyUnlocked(s: ProgressState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !s.achievements[a.id] && a.check(s))
}
