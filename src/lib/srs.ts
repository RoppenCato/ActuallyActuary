/**
 * Spaced repetition, a simplified SM-2 (the algorithm behind Anki).
 * Grades: 0 = again, 1 = hard, 2 = good, 3 = easy.
 */
export type Grade = 0 | 1 | 2 | 3

export type CardState = {
  ease: number        // multiplier, starts at 2.5
  interval: number    // days until next review
  due: number         // epoch ms
  reps: number        // successful reviews in a row
  lapses: number      // times graded "again" after being learned
  seen: number        // total reviews
  lastGrade?: Grade
}

export type Mastery = 'new' | 'learning' | 'solid' | 'mastered'

const DAY = 86_400_000

export function newCard(): CardState {
  return { ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0, seen: 0 }
}

export function review(card: CardState, grade: Grade, now = Date.now()): CardState {
  let { ease, interval, reps, lapses } = card
  if (grade === 0) {
    if (reps > 0) lapses++
    reps = 0
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
    // Show again in 10 minutes so it reappears within the same session if possible.
    return { ...card, ease, interval, reps, lapses, seen: card.seen + 1, lastGrade: grade, due: now + 10 * 60_000 }
  }

  if (reps === 0) interval = grade === 3 ? 4 : 1
  else if (reps === 1) interval = grade === 3 ? 8 : 6
  else interval = Math.round(interval * ease * (grade === 1 ? 0.8 : grade === 3 ? 1.3 : 1))

  ease = Math.max(1.3, ease + (grade === 1 ? -0.15 : grade === 3 ? 0.15 : 0))
  reps++
  return { ...card, ease, interval, reps, lapses, seen: card.seen + 1, lastGrade: grade, due: now + interval * DAY }
}

export function mastery(card: CardState | undefined): Mastery {
  if (!card || card.seen === 0) return 'new'
  if (card.interval < 7) return 'learning'
  if (card.interval < 30) return 'solid'
  return 'mastered'
}

export function isDue(card: CardState | undefined, now = Date.now()): boolean {
  return !!card && card.seen > 0 && card.due <= now
}

export const MASTERY_LABEL: Record<Mastery, string> = {
  new: 'Ny',
  learning: 'Lär mig',
  solid: 'Befäst',
  mastered: 'Bemästrad',
}
