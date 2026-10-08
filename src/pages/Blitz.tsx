import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { allItems, getCategory, getSubcategory } from '../content/loader'
import type { Item } from '../content/types'
import { useProgress } from '../store/progress'
import { shuffle, useActiveItems } from '../lib/session'
import { itemQuiz, quizzable, type Quiz } from '../lib/generate'
import { sfx } from '../lib/sound'
import { QuizCard } from '../components/QuizCard'

const ROUND_SECONDS = 60

export function BlitzPage() {
  const { catId = 'all', subId } = useParams()
  const navigate = useNavigate()
  const sound = useProgress((s) => s.settings.sound)
  const answer = useProgress((s) => s.answer)
  const addXp = useProgress((s) => s.addXp)
  const recordBlitz = useProgress((s) => s.recordBlitz)
  const recordCombo = useProgress((s) => s.recordCombo)
  const highscores = useProgress((s) => s.highscores)
  const scopeKey = subId ? `${catId}/${subId}` : catId

  const rawScope: Item[] | null = useMemo(() => {
    if (catId === 'all') return allItems
    if (subId) return getSubcategory(catId, subId)?.items ?? null
    return getCategory(catId)?.subcategories.flatMap((s) => s.items) ?? null
  }, [catId, subId])
  const scope = useActiveItems(rawScope ?? [])
  const title = catId === 'all' ? 'Alla kategorier' : subId ? getSubcategory(catId, subId)?.name : getCategory(catId)?.name

  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready')
  const [queue, setQueue] = useState<Item[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null)
  const [result, setResult] = useState<{ newHighscore: boolean; xp: number } | null>(null)
  const advanceTimer = useRef<number | null>(null)

  const multiplier = Math.min(5, 1 + Math.floor(combo / 3))

  const nextQuiz = (q: Item[]) => {
    let rest = q
    for (let i = 0; i < 10; i++) {
      if (rest.length === 0) rest = shuffle(quizzable(scope))
      const [item, ...others] = rest
      rest = others
      const qz = itemQuiz(item, scope)
      if (qz) { setQueue(rest); setQuiz(qz); return }
    }
    setQuiz(null)
  }

  const start = () => {
    setPhase('play'); setScore(0); setCorrect(0); setWrong(0); setCombo(0); setBestCombo(0); setTimeLeft(ROUND_SECONDS); setResult(null)
    nextQuiz(shuffle(quizzable(scope)))
  }

  useEffect(() => {
    if (phase !== 'play') return
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'play' && timeLeft <= 0) {
      setPhase('done')
      const xp = Math.round(score / 5) + 10
      addXp(xp)
      recordCombo(bestCombo)
      const { newHighscore } = recordBlitz(scopeKey, score, correct)
      setResult({ newHighscore, xp })
      if (sound) sfx.done()
      if (newHighscore) confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } })
    }
  }, [timeLeft, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }, [])

  if (!rawScope) return <Navigate to="/" replace />

  const onPick = (ok: boolean) => {
    if (!quiz) return
    answer(quiz.itemId, ok ? 2 : 0)
    if (ok) {
      const c = combo + 1
      setCombo(c); setBestCombo(Math.max(bestCombo, c))
      setScore(score + 10 * multiplier); setCorrect(correct + 1)
      if (sound) sfx.correct()
    } else {
      setCombo(0); setWrong(wrong + 1)
      if (sound) sfx.wrong()
    }
    setFlash(ok ? 'ok' : 'bad')
    advanceTimer.current = window.setTimeout(() => { setFlash(null); nextQuiz(queue) }, ok ? 350 : 900)
  }

  const pool = quizzable(scope).length

  if (phase === 'ready') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center sm:my-auto sm:flex-none sm:py-10">
        <div className="text-6xl">⚡</div>
        <h1 className="text-2xl font-bold">Blixtrond</h1>
        <p className="text-slate-400">{title}</p>
        <p className="max-w-xs text-sm text-slate-400">
          {ROUND_SECONDS} sekunder. Så många rätt du hinner. Tre rätt i rad höjer multiplikatorn, ett fel nollar den.
        </p>
        <div className="glass px-4 py-2 text-sm">
          Rekord: <span className="font-bold">{highscores[scopeKey] ?? 0}</span> · {pool} frågor i potten
        </div>
        {pool < 4 ? (
          <p className="text-sm text-amber-300">För få frågor här för en blixtrond.</p>
        ) : (
          <button className="btn-primary w-full max-w-xs py-4 text-lg" onClick={start}>Starta!</button>
        )}
        <Link to={catId === 'all' ? '/' : `/c/${catId}`} className="text-sm text-slate-400 hover:text-white">Tillbaka</Link>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center gap-5 text-center sm:my-auto sm:flex-none sm:py-10">
        <div className="text-6xl">{result?.newHighscore ? '🏆' : '⚡'}</div>
        <h1 className="text-2xl font-bold">{result?.newHighscore ? 'Nytt rekord!' : 'Tiden är ute'}</h1>
        <div className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-6xl font-black text-transparent">{score}</div>
        <div className="glass grid w-full grid-cols-3 gap-2 p-4">
          <Stat label="Rätt" value={String(correct)} />
          <Stat label="Fel" value={String(wrong)} />
          <Stat label="Bästa combo" value={`${bestCombo}x`} />
        </div>
        <p className="text-sm text-slate-400">+{result?.xp ?? 0} XP</p>
        <div className="flex w-full gap-2">
          <Link to={catId === 'all' ? '/' : `/c/${catId}`} className="btn-ghost flex-1">Tillbaka</Link>
          <button className="btn-primary flex-1" onClick={() => navigate(0)}>Igen</button>
        </div>
      </motion.div>
    )
  }

  const pct = timeLeft / ROUND_SECONDS
  return (
    <div className={`flex flex-1 flex-col gap-3 pt-3 transition-colors sm:my-auto sm:flex-none sm:py-6 ${flash === 'ok' ? 'bg-emerald-500/5' : flash === 'bad' ? 'bg-rose-500/5' : ''}`}>
      <div className="flex items-center gap-3">
        <Link to={catId === 'all' ? '/' : `/c/${catId}`} className="p-1 text-slate-400 hover:text-white" aria-label="Avsluta">✕</Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full ${timeLeft <= 10 ? 'bg-rose-400' : 'bg-gradient-to-r from-amber-300 to-rose-400'}`}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
        <span className={`w-8 text-right text-sm font-bold tabular-nums ${timeLeft <= 10 ? 'text-rose-300' : ''}`}>{timeLeft}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-3xl font-black tabular-nums">{score}</div>
        <AnimatePresence>
          {multiplier > 1 && (
            <motion.div key={multiplier} initial={{ scale: 0 }} animate={{ scale: [1.4, 1] }} exit={{ scale: 0 }} className="rounded-full bg-amber-400/20 px-3 py-1 text-sm font-bold text-amber-300">
              ×{multiplier}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {quiz && (
          <motion.div key={quiz.itemId + score + wrong} className="flex flex-1 flex-col" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.15 }}>
            <QuizCard quiz={quiz} onPick={onPick} instant />
          </motion.div>
        )}
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
