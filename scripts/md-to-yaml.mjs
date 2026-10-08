// Converts the "Begrepp/Betyder, Fråga/Svar, Sant/falskt, Flerval, Ordning" text format
// into the YAML item format used under content/.
//
//   node scripts/md-to-yaml.mjs inbox/fil.md                 -> prints YAML (all sections)
//   node scripts/md-to-yaml.mjs inbox/fil.md --json          -> prints JSON grouped by section
//
// "## Rubrik" sections become tags on the items so they can be filtered later.

import { readFileSync } from 'node:fs'
import { stringify } from 'yaml'

export function parseMarkdown(text) {
  const lines = text.split(/\r?\n/)
  const sections = []
  let section = { name: '', items: [] }
  let cur = null
  const flush = () => { if (cur) { section.items.push(cur); cur = null } }

  const kv = (line) => {
    const m = line.match(/^\s*([A-Za-zÅÄÖåäö\/ ]+?):\s*(.*)$/)
    return m ? [m[1].trim().toLowerCase(), m[2].trim()] : null
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('# ')) continue
    if (line.startsWith('## ')) {
      flush()
      if (section.name || section.items.length) sections.push(section)
      section = { name: line.slice(3).trim(), items: [] }
      continue
    }
    const step = line.match(/^(\d+)[.)]\s+(.*)$/)
    if (step && cur?.type === 'order') { cur.steps.push(step[2].trim()); continue }

    const pair = kv(line)
    if (!pair) continue
    const [key, val] = pair
    switch (key) {
      case 'begrepp': flush(); cur = { type: 'term', term: val, definition: '' }; break
      case 'betyder': if (cur?.type === 'term') cur.definition = val; break
      case 'fråga': flush(); cur = { type: 'qa', question: val, answer: '' }; break
      case 'sant/falskt': flush(); cur = { type: 'truefalse', statement: val, answer: null }; break
      case 'flerval': flush(); cur = { type: 'mcq', question: val, options: [], correct: -1 }; break
      case 'alternativ': if (cur?.type === 'mcq') cur.options = val.split(/\s+\/\s+/).map((s) => s.trim()); break
      case 'rätt':
        if (cur?.type === 'mcq') {
          const i = cur.options.findIndex((o) => o.toLowerCase() === val.toLowerCase())
          cur.correct = i
          if (i < 0) cur._error = `rätt svar "${val}" finns inte bland alternativen`
        }
        break
      case 'ordning': flush(); cur = { type: 'order', prompt: val, steps: [] }; break
      case 'svar':
        if (cur?.type === 'qa') cur.answer = val
        else if (cur?.type === 'truefalse') {
          const m = val.match(/^(sant|falskt)\.?\s*(.*)$/i)
          if (!m) { cur._error = `svar måste börja med Sant eller Falskt: "${val}"`; break }
          cur.answer = m[1].toLowerCase() === 'sant'
          if (m[2]) cur.explanation = m[2].trim()
        }
        break
      case 'förklaring': if (cur) cur.explanation = val; break
    }
  }
  flush()
  if (section.name || section.items.length) sections.push(section)
  return sections
}

export function toItems(sections) {
  return sections.flatMap((s) =>
    s.items.map((it) => {
      const { _error, ...item } = it
      if (_error) console.error(`⚠ ${s.name}: ${_error}`)
      return s.name ? { ...item, tags: [s.name] } : item
    }),
  )
}

if (process.argv[1] && process.argv[1].endsWith('md-to-yaml.mjs')) {
  const [file, flag] = process.argv.slice(2)
  if (!file) { console.error('Användning: node scripts/md-to-yaml.mjs <fil.md> [--json]'); process.exit(1) }
  const sections = parseMarkdown(readFileSync(file, 'utf8'))
  if (flag === '--json') console.log(JSON.stringify(sections, null, 2))
  else console.log(stringify({ items: toItems(sections) }, { lineWidth: 0 }))
}
