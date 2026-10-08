import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { allItems, getCategory, getSubcategory } from '../content/loader'
import type { Item } from '../content/types'
import { useProgress, levelFromXp } from '../store/progress'
import { buildQueue, useActiveItems } from '../lib/session'
import type { Grade } from '../lib/srs'
import { sfx } from '../lib/sound'
import { Exercise } from '../components/exercises'

type Result = { id: string; grade: Grade }

export function PlayPage() {
  const { catId = 'all', subId } = useParams()
  const navigate = useNavigate()
  const cards = useProgress((s) => s.cards)
  const sessionSize = useProgress((s) => s.settings.sessionSize)
  const sound = useProgress((s) => s.settings.sound)
  const answer = useProgress((s) => s.answer)
  const finishSession = useProgress((s) => s.finishSession)
  const xp = useProgress((s) => s.xp)
  const flagged = useProgress((s) => s.flagged)
  const toggleFlag = useProgress((s) => s.toggleFlag)

  const rawScope: Item[] | null = useMemo(() => {
    if (catId === 'all') return allItems
    if (subId) return getSubcategory(catId, subId)?.items ?? null
    return getCategory(catId)?.subcategories.flatMap((s) => s.items) ?? null
  }, [catId, subId])
  const scope = useActiveItems(rawScope ?? [])

  const title = catId === 'all' ? 'Daglig träning' : subId ? getSubcategory(catId, subId)?.name : getCategory(catId)?.name

  // Queue is built once per session, not re-built as cards change.
  const [queue, setQueue] = useState<Item[]>(() => buildQueue(scope ?? [], cards, sessionSize))
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [floats, setFloats] = useState<{ id: number; text: string }[]>([])
  const [toast, setToast] = useState('')
  const startXp = useRef(xp)
  const startLevel = useRef(levelFromXp(xp).level)
  const requeued = useRef(new Set<string>())
  const celebrated = useRef(false)

  // Derived synchronously so the render never sees an undefined current card.
  const done = queue.length > 0 && idx >= queue.length
  const current = queue[Math.min(idx, queue.length - 1)]

  useEffect(() => {
    if (done && !celebrated.current) {
      celebrated.current = true
      finishSession()
      if (sound) sfx.done()
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#818cf8', '#f472b6', '#34d399', '#fbbf24'] })
    }
  }, [done, finishSession, sound])

  if (!rawScope) return <Navigate to="/" replace />

  if (queue.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="text-xl font-bold">Inget att träna på här just nu</h1>
        <p className="text-slate-400">Lägg till innehåll eller kom tillbaka när korten är dags att repetera.</p>
        <Link to="/" className="btn-primary">Hem</Link>
      </div>
    )
  }

  const onDone = (grade: Grade) => {
    const { xpGained } = answer(current.id, grade)
    const newCombo = grade > 0 ? combo + 1 : 0
    setCombo(newCombo)
    setBestCombo(Math.max(bestCombo, newCombo))
    setResults([...results, { id: current.id, grade }])

    const fid = Date.now()
    setFloats((f) => [...f, { id: fid, text: `+${xpGained} XP${newCombo >= 3 ? ` · ${newCombo}x combo` : ''}` }])
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== fid)), 1200)

    // Put failed cards back at the end once, so the session ends with them learned.
    if (grade === 0 && !requeued.current.has(current.id)) {
      requeued.current.add(current.id)
      setQueue([...queue, current])
    }

    const lvl = levelFromXp(xp + xpGained).level
    if (lvl > startLevel.current) { startLevel.current = lvl; if (sound) sfx.levelUp() }

    setIdx(idx + 1)
  }

  const onFlag = () => {
    toggleFlag(current.id)
    const nowFlagged = !flagged[current.id]
    setToast(nowFlagged ? 'Kortet är flaggat och visas inte igen. Ångra under Inställningar.' : 'Flaggan borttagen.')
    setTimeout(() => setToast(''), 2500)
    if (nowFlagged) {
      // Drop any later copies of the card (e.g. a re-queued one) and move on without grading.
      setQueue(queue.filter((it, i) => i <= idx || it.id !== current.id))
      setIdx(idx + 1)
    }
  }

  if (done) {
    const correct = results.filter((r) => r.grade > 0).length
    const gained = xp - startXp.current
    const { level } = levelFromXp(xp)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="text-6xl">{correct === results.length ? '🏆' : correct / results.length >= 0.7 ? '🌟' : '💪'}</div>
        <h1 className="text-2xl font-bold">Pass klart!</h1>
        <div className="glass grid w-full grid-cols-3 gap-2 p-4">
          <Stat label="Rätt" value={`${correct}/${results.length}`} />
          <Stat label="XP" value={`+${gained}`} />
          <Stat label="Bästa combo" value={`${bestCombo}x`} />
        </div>
        <p className="text-sm text-slate-400">Du är nivå {level}.</p>
        <div className="flex w-full gap-2">
          <Link to="/" className="btn-ghost flex-1">Hem</Link>
          <button className="btn-primary flex-1" onClick={() => navigate(0)}>Kör igen</button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-3 pt-3">
      <div className="flex items-center gap-3">
        <Link to={catId === 'all' ? '/' : `/c/${catId}`} className="rounded-lg p-1 text-slate-400 hover:text-white" aria-label="Avsluta">✕</Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-400 to-accent-400"
            initial={{ width: 0 }}
            animate={{ width: `${(idx / queue.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
        <span className="text-xs tabular-nums text-slate-400">{idx + 1}/{queue.length}</span>
        <button
          onClick={onFlag}
          className="rounded-lg p-1 text-base opacity-60 transition hover:opacity-100 active:scale-90"
          aria-label="Flagga kortet som dåligt"
          title="Flagga kortet som dåligt"
        >
          🚩
        </button>
        <AnimatePresence>
          {combo >= 3 && (
            <motion.span
              key="combo"
              initial={{ scale: 0 }}
              animate={{ scale: [1.3, 1] }}
              exit={{ scale: 0 }}
              className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300"
            >
              🔥 {combo}x
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-sm text-rose-100"
          >
            🚩 {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${idx}`}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            <Exercise item={current} onDone={onDone} />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {floats.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -36 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="pointer-events-none absolute left-1/2 -top-2 z-10 -translate-x-1/2 text-lg font-bold text-amber-300 drop-shadow"
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}
