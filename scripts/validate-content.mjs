// Validates every YAML file under content/ so that a typo never breaks the app.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

const TYPES = new Set(['term', 'qa', 'truefalse', 'mcq', 'order'])
let errors = 0
const fail = (file, msg) => { console.error(`✗ ${file}: ${msg}`); errors++ }

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.yaml') || name.endsWith('.yml')) check(p)
  }
}

function check(file) {
  let doc
  try { doc = parse(readFileSync(file, 'utf8')) } catch (e) { return fail(file, 'YAML-fel: ' + e.message) }
  const isCategory = file.endsWith('_category.yaml')
  if (!doc || typeof doc !== 'object') return fail(file, 'tom eller ogiltig fil')
  if (!doc.name) fail(file, 'saknar name')
  if (isCategory) return
  if (!Array.isArray(doc.items)) return fail(file, 'saknar items-lista')
  const ids = new Set()
  doc.items.forEach((it, i) => {
    const where = `item ${i + 1}`
    if (!it || typeof it !== 'object') return fail(file, `${where}: inte ett objekt`)
    if (!TYPES.has(it.type)) return fail(file, `${where}: okänd type "${it.type}"`)
    if (it.id) { if (ids.has(it.id)) fail(file, `${where}: dubblett-id ${it.id}`); ids.add(it.id) }
    const need = (k) => { if (it[k] === undefined || it[k] === '') fail(file, `${where} (${it.type}): saknar ${k}`) }
    switch (it.type) {
      case 'term': need('term'); need('definition'); break
      case 'qa': need('question'); need('answer'); break
      case 'truefalse': need('statement'); if (typeof it.answer !== 'boolean') fail(file, `${where}: answer måste vara true/false`); break
      case 'mcq':
        need('question')
        if (!Array.isArray(it.options) || it.options.length < 2) fail(file, `${where}: options måste ha minst 2 alternativ`)
        if (typeof it.correct !== 'number' || it.correct < 0 || it.correct >= (it.options?.length ?? 0)) fail(file, `${where}: correct måste vara index i options`)
        break
      case 'order': need('prompt'); if (!Array.isArray(it.steps) || it.steps.length < 2) fail(file, `${where}: steps måste ha minst 2`); break
    }
  })
}

walk('content')
if (errors) { console.error(`\n${errors} fel.`); process.exit(1) }
console.log('✓ Allt innehåll är giltigt.')
