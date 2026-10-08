import type { Item, TermItem } from '../content/types'
import { shuffle } from './session'

/** A multiple-choice question generated from content, gradable automatically. */
export type Quiz = {
  itemId: string
  kind: 'truefalse' | 'mcq' | 'term'
  question: string
  options: string[]
  correct: number
  explanation?: string
}

/** "Which term is described?" built from a term plus distractors from the same pool. */
export function termQuiz(item: TermItem, pool: Item[]): Quiz | null {
  const others = pool.filter((p): p is TermItem => p.type === 'term' && p.id !== item.id && p.term !== item.term)
  if (others.length < 3) return null
  const distractors = shuffle(others).slice(0, 3).map((t) => t.term)
  const options = shuffle([item.term, ...distractors])
  return {
    itemId: item.id,
    kind: 'term',
    question: item.definition,
    options,
    correct: options.indexOf(item.term),
    explanation: item.explanation,
  }
}

export function itemQuiz(item: Item, pool: Item[]): Quiz | null {
  switch (item.type) {
    case 'truefalse':
      return { itemId: item.id, kind: 'truefalse', question: item.statement, options: ['Falskt', 'Sant'], correct: item.answer ? 1 : 0, explanation: item.explanation }
    case 'mcq': {
      const order = shuffle(item.options.map((_, i) => i))
      return { itemId: item.id, kind: 'mcq', question: item.question, options: order.map((i) => item.options[i]), correct: order.indexOf(item.correct), explanation: item.explanation }
    }
    case 'term':
      return termQuiz(item, pool)
    default:
      return null
  }
}

/** All items in the pool that can become an auto-graded quiz. */
export function quizzable(pool: Item[]): Item[] {
  const terms = pool.filter((i) => i.type === 'term').length
  return pool.filter((i) => i.type === 'truefalse' || i.type === 'mcq' || (i.type === 'term' && terms >= 4))
}

export type Pair = { id: string; term: string; definition: string }

/** Picks n term items for a matching round. */
export function matchPairs(pool: Item[], n = 5): Pair[] {
  const terms = pool.filter((i): i is TermItem => i.type === 'term')
  return shuffle(terms).slice(0, n).map((t) => ({ id: t.id, term: t.term, definition: t.definition }))
}
