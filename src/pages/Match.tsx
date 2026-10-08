import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { allItems, getCategory, getSubcategory } from '../content/loader'
import type { Item } from '../content/types'
import { useProgress } from '../store/progress'
import { shuffle, useActiveItems } from '../lib/session'
import { matchPairs, type Pair } from '../lib/generate'
import { sfx } from '../lib/sound'

const ROUNDS = 3
const PAIRS = 5

type Side = 'term' | 'def'

export function MatchPage() {
  const { catId = 'all', subId } = useParams()
  const navigate = useNavigate()
  const sound = useProgress((s) => s.settings.sound)
  const answer = useProgress((s) => s.answer)
  const addXp = useProgress((s) => s.addXp)
  const recordMatch = useProgress((s) => s.recordMatch)

  const rawScope: Item[] | null = useMemo(() => {
    if (catId === 'all') return allItems
    if (subId) return getSubcategory(catId, subId)?.items ?? null
    return getCategory(catId)?.subcategories.flatMap((s) => s.items) ?? null
  }, [catId, subId])
  const scope = useActiveItems(rawScope ?? [])
  const title = catId === 'all' ? 'Alla kategorier' : subId ? getSubcategory(catId, subId)?.name : getCategory(catId)?.name

  const [round, setRound] = useState(0)
  const [pairs, setPairs] = useState<Pair[]>([])
  const [terms, setTerms] = useState<Pair[]>([])
  const [defs, setDefs] = useState<Pair[]>([])
  const [sel, setSel] = useState<{ side: Side; id: string } | null>(null)
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [totalMistakes, setTotalMistakes] = useState(0)
  const [started, setStarted] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)

  const newRound = () => {
    const p = matchPairs(scope, PAIRS)
    setPairs(p); setTerms(shuffle(p)); setDefs(shuffle(p)); setSel(null); setSolved(new Set()); setMistakes(0)
  }

  useEffect(() => { newRound() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (started === null || done) return
    const t = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 250)
    return () => clearInterval(t)
  }, [started, done])

  if (!rawScope) return <Navigate to="/" replace />
  if (pairs.length < 3) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="text-5xl">🧩</div>
        <p className="text-slate-400">För få begrepp här för att matcha par.</p>
        <Link to="/" className="btn-primary">Hem</Link>
      </div>
    )
  }

  const tap = (side: Side, id: string) => {
    if (solved.has(id) || wrongPair.length) return
    if (started === null) setStarted(Date.now())
    if (!sel) { setSel({ side, id }); return }
    if (sel.side === side) { setSel(sel.id === id ? null : { side, id }); return }

    if (sel.id === id) {
      const next = new Set(solved).add(id)
      setSolved(next); setSel(null)
      answer(id, 2)
      if (sound) sfx.correct()
      if (next.size === pairs.length) finishRound(mistakes)
    } else {
      setWrongPair([sel.id, id]); setSel(null)
      setMistakes(mistakes + 1); setTotalMistakes(totalMistakes + 1)
      answer(id, 0)
      if (sound) sfx.wrong()
      setTimeout(() => setWrongPair([]), 500)
    }
  }

  const finishRound = (roundMistakes: number) => {
    recordMatch(roundMistakes === 0)
    if (round + 1 >= ROUNDS) {
      setDone(true)
      const secs = Math.round((Date.now() - (started ?? Date.now())) / 1000)
      setElapsed(secs)
      addXp(Math.max(10, 60 - totalMistakes * 5 - Math.floor(secs / 10)))
      if (sound) sfx.done()
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    } else {
      setTimeout(() => { setRound(round + 1); newRound() }, 600)
    }
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center gap-5 text-center sm:my-auto sm:flex-none sm:py-10">
        <div className="text-6xl">{totalMistakes === 0 ? '🏆' : '🧩'}</div>
        <h1 className="text-2xl font-bold">{totalMistakes === 0 ? 'Felfritt!' : 'Klart!'}</h1>
        <div className="glass grid w-full grid-cols-3 gap-2 p-4">
          <Stat label="Par" value={String(ROUNDS * PAIRS)} />
          <Stat label="Fel" value={String(totalMistakes)} />
          <Stat label="Tid" value={`${elapsed}s`} />
        </div>
        <div className="flex w-full gap-2">
          <Link to={catId === 'all' ? '/' : `/c/${catId}`} className="btn-ghost flex-1">Tillbaka</Link>
          <button className="btn-primary flex-1" onClick={() => navigate(0)}>Igen</button>
        </div>
      </motion.div>
    )
  }

  const cls = (side: Side, id: string) => {
    if (solved.has(id)) return 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100 opacity-60'
    if (wrongPair.includes(id)) return 'border-rose-400/60 bg-rose-500/25 shake'
    if (sel?.side === side && sel.id === id) return 'border-brand-400 bg-brand-500/30 ring-2 ring-brand-400/50'
    return 'border-white/10 bg-white/5 hover:bg-white/10'
  }

  return (
    <div className="flex flex-1 flex-col gap-3 pt-3 sm:my-auto sm:flex-none sm:py-6">
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <Link to={catId === 'all' ? '/' : `/c/${catId}`} className="p-1 hover:text-white" aria-label="Avsluta">✕</Link>
        <span className="font-semibold text-white">Matcha par</span>
        <span>· {title}</span>
        <span className="ml-auto tabular-nums">Runda {round + 1}/{ROUNDS} · {elapsed}s</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 sm:min-h-[420px]">
        <div className="flex flex-col gap-2">
          {terms.map((p) => (
            <motion.button layout key={p.id} onClick={() => tap('term', p.id)} className={`flex-1 rounded-xl border px-2 py-3 text-sm font-semibold transition ${cls('term', p.id)}`}>
              {p.term}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {defs.map((p) => (
            <motion.button layout key={p.id} onClick={() => tap('def', p.id)} className={`flex-1 rounded-xl border px-2 py-2 text-left text-[11px] leading-snug transition ${cls('def', p.id)}`}>
              {p.definition.length > 140 ? p.definition.slice(0, 137) + '…' : p.definition}
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {mistakes > 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-rose-300">{mistakes} fel den här rundan</motion.div>}
      </AnimatePresence>
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
