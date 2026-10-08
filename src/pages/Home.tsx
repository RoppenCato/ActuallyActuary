import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories, allItems } from '../content/loader'
import { useProgress, levelFromXp } from '../store/progress'
import { countDue, countNew, useActiveItems } from '../lib/session'
import { mastery } from '../lib/srs'
import { ProgressRing } from '../components/ProgressRing'
import { ACHIEVEMENTS } from '../lib/achievements'

export function Home() {
  const cards = useProgress((s) => s.cards)
  const xp = useProgress((s) => s.xp)
  const streak = useProgress((s) => s.streak)
  const stats = useProgress((s) => s.stats)
  const flagged = useProgress((s) => s.flagged)
  const achievements = useProgress((s) => s.achievements)
  const highscores = useProgress((s) => s.highscores)
  const flaggedIds = new Set(Object.keys(flagged))
  const { level } = levelFromXp(xp)
  const active = useActiveItems(allItems)

  const dueAll = countDue(active, cards)
  const masteredAll = active.filter((i) => mastery(cards[i.id]) === 'mastered').length

  return (
    <div className="flex flex-col gap-5 pt-2">
      <section className="glass p-5">
        <div className="flex items-center gap-4">
          <ProgressRing value={active.length ? masteredAll / active.length : 0} size={72} stroke={7}>
            <span className="text-sm">{Math.round((active.length ? masteredAll / active.length : 0) * 100)}%</span>
          </ProgressRing>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Hej! 👋</h1>
            <p className="text-sm text-slate-400">
              Nivå {level} · {xp} XP · {streak.count} dagars streak
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {masteredAll} av {active.length} kort bemästrade · {stats.sessions} pass
            </p>
          </div>
        </div>
        <Link to="/play/all" className="btn-primary mt-4 w-full">
          {dueAll > 0 ? `Daglig träning · ${dueAll} att repetera` : 'Daglig träning'}
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link to="/blitz/all" className="btn-ghost text-sm">⚡ Blixtrond{highscores.all ? ` · ${highscores.all}` : ''}</Link>
          <Link to="/match/all" className="btn-ghost text-sm">🧩 Matcha par</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Achievements · {Object.keys(achievements).length}/{ACHIEVEMENTS.length}
        </h2>
        <div className="glass grid grid-cols-6 gap-2 p-3">
          {ACHIEVEMENTS.map((a) => {
            const got = !!achievements[a.id]
            return (
              <div
                key={a.id}
                title={`${a.title}: ${a.description}`}
                className={`grid aspect-square place-items-center rounded-xl text-2xl transition ${got ? 'bg-amber-400/15 shadow-inner shadow-amber-400/20' : 'bg-white/5 opacity-30 grayscale'}`}
              >
                {a.icon}
              </div>
            )
          })}
        </div>
      </section>

      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-slate-400">Kategorier</h2>
      <div className="flex flex-col gap-3">
        {categories.map((c, idx) => {
          const items = c.subcategories.flatMap((s) => s.items).filter((i) => !flaggedIds.has(i.id))
          const mastered = items.filter((i) => mastery(cards[i.id]) === 'mastered').length
          const due = countDue(items, cards)
          const fresh = countNew(items, cards)
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link to={`/c/${c.id}`} className="glass flex items-center gap-4 p-4 transition hover:bg-white/10 active:scale-[0.98]">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500/40 to-accent-500/40 text-2xl">
                  {c.icon ?? '📚'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="truncate text-xs text-slate-400">{c.description}</div>
                  <div className="mt-1 flex gap-3 text-xs text-slate-400">
                    <span>{items.length} kort</span>
                    {due > 0 && <span className="text-amber-300">{due} att repetera</span>}
                    {fresh > 0 && <span className="text-sky-300">{fresh} nya</span>}
                  </div>
                </div>
                <ProgressRing value={items.length ? mastered / items.length : 0} size={44} stroke={5}>
                  <span className="text-[10px]">{Math.round((items.length ? mastered / items.length : 0) * 100)}%</span>
                </ProgressRing>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
