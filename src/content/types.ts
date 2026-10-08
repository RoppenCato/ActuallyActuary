export type ItemBase = {
  /** Stable id: "<category>/<subcategory>/<slug>" */
  id: string
  categoryId: string
  subcategoryId: string
  tags?: string[]
  explanation?: string
}

export type TermItem = ItemBase & { type: 'term'; term: string; definition: string }
export type QAItem = ItemBase & { type: 'qa'; question: string; answer: string }
export type TrueFalseItem = ItemBase & { type: 'truefalse'; statement: string; answer: boolean }
export type MCQItem = ItemBase & { type: 'mcq'; question: string; options: string[]; correct: number }
export type OrderItem = ItemBase & { type: 'order'; prompt: string; steps: string[] }

export type Item = TermItem | QAItem | TrueFalseItem | MCQItem | OrderItem
export type ItemType = Item['type']

export type Subcategory = {
  id: string
  categoryId: string
  name: string
  description?: string
  items: Item[]
}

export type Category = {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  subcategories: Subcategory[]
}

/** The text shown on the front of a card, regardless of type. */
export function itemPrompt(item: Item): string {
  switch (item.type) {
    case 'term': return item.term
    case 'qa': return item.question
    case 'truefalse': return item.statement
    case 'mcq': return item.question
    case 'order': return item.prompt
  }
}
