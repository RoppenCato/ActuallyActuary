import type { Item } from '../content/types'
import type { CardState } from './srs'
import { isDue } from './srs'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Builds a session queue: due cards first (most overdue first), then new cards,
 * then, if there is room, the cards that are closest to being due.
 */
export function buildQueue(items: Item[], cards: Record<string, CardState>, size: number): Item[] {
  const now = Date.now()
  const due = items.filter((i) => isDue(cards[i.id], now)).sort((a, b) => cards[a.id].due - cards[b.id].due)
  const fresh = shuffle(items.filter((i) => !cards[i.id] || cards[i.id].seen === 0))
  const rest = items
    .filter((i) => cards[i.id] && cards[i.id].seen > 0 && !isDue(cards[i.id], now))
    .sort((a, b) => cards[a.id].due - cards[b.id].due)

  const queue = [...due, ...fresh, ...rest].slice(0, size)
  // Mix due and new so a session is not all new cards in a row.
  return shuffle(queue)
}

export function countDue(items: Item[], cards: Record<string, CardState>): number {
  const now = Date.now()
  return items.filter((i) => isDue(cards[i.id], now)).length
}

export function countNew(items: Item[], cards: Record<string, CardState>): number {
  return items.filter((i) => !cards[i.id] || cards[i.id].seen === 0).length
}
