import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategory } from '../content/loader'
import { useProgress } from '../store/progress'
import { countDue, countNew } from '../lib/session'
import { mastery, type Mastery } from '../lib/srs'
import { ProgressRing } from '../components/ProgressRing'

const MASTERY_COLOR: Record<Mastery, string> = {
  new: 'bg-slate-600',
  learning: 'bg-sky-400',
  solid: 'bg-brand-400',
  mastered: 'bg-emerald-400',
}

export function CategoryPage() {
  const { catId = '' } = useParams()
  const cat = getCategory(catId)
  const cards = useProgress((s) => s.cards)
  const flagged = useProgress((s) => s.flagged)
  if (!cat) return <Navigate to="/" replace />

  const subs = cat.subcategories.map((s) => ({ ...s, items: s.items.filter((i) => !flagged[i.id]) }))
  const items = subs.flatMap((s) => s.items)
  const due = countDue(items, cards)

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Link to="/" className="text-sm text-slate-400 hover:text-white">← Hem</Link>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{cat.icon ?? '📚'}</span>
        <div>
          <h1 className="text-2xl font-bold">{cat.name}</h1>
          <p className="text-sm text-slate-400">{cat.description}</p>
        </div>
      </div>

      <Link to={`/play/${cat.id}`} className="btn-primary">
        {due > 0 ? `Träna hela kategorin · ${due} att repetera` : 'Träna hela kategorin'}
      </Link>

      <div className="flex flex-col gap-3">
        {subs.map((s, idx) => {
          const counts: Record<Mastery, number> = { new: 0, learning: 0, solid: 0, mastered: 0 }
          for (const i of s.items) counts[mastery(cards[i.id])]++
          const subDue = countDue(s.items, cards)
          const subNew = countNew(s.items, cards)
          const total = s.items.length || 1
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link to={`/play/${cat.id}/${s.id}`} className="glass block p-4 transition hover:bg-white/10 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="truncate text-xs text-slate-400">{s.description}</div>
                  </div>
                  <ProgressRing value={counts.mastered / total} size={44} stroke={5}>
                    <span className="text-[10px]">{Math.round((counts.mastered / total) * 100)}%</span>
                  </ProgressRing>
                </div>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/10">
                  {(['mastered', 'solid', 'learning', 'new'] as Mastery[]).map((m) => (
                    <motion.div
                      key={m}
                      className={`${MASTERY_COLOR[m]} h-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(counts[m] / total) * 100}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex gap-3 text-xs text-slate-400">
                  <span>{s.items.length} kort</span>
                  {subDue > 0 && <span className="text-amber-300">{subDue} att repetera</span>}
                  {subNew > 0 && <span className="text-sky-300">{subNew} nya</span>}
                  {counts.mastered > 0 && <span className="text-emerald-300">{counts.mastered} bemästrade</span>}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
