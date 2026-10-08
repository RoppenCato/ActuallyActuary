import { parse } from 'yaml'
import type { Category, Item, Subcategory } from './types'

// Every YAML file under /content is bundled at build time. Adding a file = adding content.
const files = import.meta.glob('../../content/**/*.{yaml,yml}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

function rawPrompt(raw: Record<string, unknown>): string {
  return String(raw.term ?? raw.question ?? raw.statement ?? raw.prompt ?? '')
}

function buildCategories(): Category[] {
  const cats = new Map<string, Category>()

  const ensureCat = (id: string): Category => {
    let c = cats.get(id)
    if (!c) {
      c = { id, name: id, subcategories: [] }
      cats.set(id, c)
    }
    return c
  }

  for (const [path, text] of Object.entries(files)) {
    const m = path.match(/content\/([^/]+)\/([^/]+)\.ya?ml$/)
    if (!m) continue
    const [, catId, fileName] = m
    const doc = parse(text) as Record<string, unknown>
    const cat = ensureCat(catId)

    if (fileName === '_category') {
      cat.name = String(doc.name ?? catId)
      cat.description = doc.description as string | undefined
      cat.icon = doc.icon as string | undefined
      cat.color = doc.color as string | undefined
      continue
    }

    const subId = fileName
    const seen = new Set<string>()
    const items: Item[] = ((doc.items as Record<string, unknown>[]) ?? []).map((raw) => {
      let base = String(raw.id ?? slug(rawPrompt(raw)))
      let id = `${catId}/${subId}/${base}`
      let n = 2
      while (seen.has(id)) id = `${catId}/${subId}/${base}-${n++}`
      seen.add(id)
      return { ...raw, id, categoryId: catId, subcategoryId: subId } as Item
    })

    const sub: Subcategory = {
      id: subId,
      categoryId: catId,
      name: String(doc.name ?? subId),
      description: doc.description as string | undefined,
      items,
    }
    cat.subcategories.push(sub)
  }

  for (const c of cats.values()) c.subcategories.sort((a, b) => a.name.localeCompare(b.name, 'sv'))
  return [...cats.values()].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
}

export const categories: Category[] = buildCategories()

export const allItems: Item[] = categories.flatMap((c) => c.subcategories.flatMap((s) => s.items))

export const itemsById: Map<string, Item> = new Map(allItems.map((i) => [i.id, i]))

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getSubcategory(catId: string, subId: string): Subcategory | undefined {
  return getCategory(catId)?.subcategories.find((s) => s.id === subId)
}
