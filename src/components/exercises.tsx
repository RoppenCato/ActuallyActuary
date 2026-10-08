import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Item, MCQItem, OrderItem, TrueFalseItem } from '../content/types'
import type { Grade } from '../lib/srs'
import { shuffle } from '../lib/session'
import { sfx } from '../lib/sound'
import { useProgress } from '../store/progress'

export type ExerciseProps = { item: Item; onDone: (grade: Grade) => void }

function useSfx() {
  const sound = useProgress((s) => s.settings.sound)
  return sound ? sfx : (new Proxy({}, { get: () => () => {} }) as typeof sfx)
}

function Front({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {hint && <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{hint}</span>}
      <div className="text-xl font-semibold leading-snug sm:text-2xl">{children}</div>
    </div>
  )
}

function Feedback({ correct, text }: { correct: boolean; text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-3 text-sm ${correct ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200' : 'border-rose-400/40 bg-rose-500/10 text-rose-200'}`}
    >
      <div className="font-semibold">{correct ? 'Rätt!' : 'Fel.'}</div>
      {text && <div className="mt-1 text-slate-200">{text}</div>}
    </motion.div>
  )
}

/** Self-graded flip card for terms, Q&A and ordered lists. */
export function Flashcard({ item, onDone }: ExerciseProps) {
  const [flipped, setFlipped] = useState(false)
  const s = useSfx()
  useEffect(() => setFlipped(false), [item.id])

  const front =
    item.type === 'term' ? item.term : item.type === 'qa' ? item.question : item.type === 'order' ? item.prompt : ''
  const hint = item.type === 'term' ? 'Vad betyder' : item.type === 'qa' ? 'Fråga' : 'Ordning'

  const back = (
    <div className="text-left text-base leading-relaxed">
      {item.type === 'term' && item.definition}
      {item.type === 'qa' && item.answer}
      {item.type === 'order' && (
        <ol className="list-decimal space-y-1 pl-5">
          {item.steps.map((st) => <li key={st}>{st}</li>)}
        </ol>
      )}
      {item.explanation && <p className="mt-3 text-sm text-slate-400">{item.explanation}</p>}
    </div>
  )

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="perspective flex flex-1 flex-col" onClick={() => { if (!flipped) { s.flip(); setFlipped(true) } }}>
        <motion.div
          className="preserve-3d relative min-h-[280px] w-full flex-1 cursor-pointer"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120, damping: 16 }}
        >
          <div className="glass backface-hidden absolute inset-0 flex items-center justify-center p-6">
            <Front hint={hint}>{front}</Front>
            <span className="absolute bottom-4 text-xs text-slate-500">Tryck för att vända</span>
          </div>
          <div className="glass backface-hidden absolute inset-0 overflow-y-auto p-6" style={{ transform: 'rotateY(180deg)' }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-400">{front}</div>
            {back}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-4 gap-2"
          >
            {([
              [0, 'Igen', 'bg-rose-500/20 text-rose-200 border-rose-400/30'],
              [1, 'Svårt', 'bg-amber-500/20 text-amber-200 border-amber-400/30'],
              [2, 'Bra', 'bg-brand-500/30 text-brand-50 border-brand-400/40'],
              [3, 'Lätt', 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'],
            ] as [Grade, string, string][]).map(([g, label, cls]) => (
              <button key={g} className={`btn border ${cls}`} onClick={() => { g === 0 ? s.wrong() : s.correct(); onDone(g) }}>
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TrueFalse({ item, onDone }: ExerciseProps & { item: TrueFalseItem }) {
  const [picked, setPicked] = useState<boolean | null>(null)
  const s = useSfx()
  useEffect(() => setPicked(null), [item.id])
  const correct = picked !== null && picked === item.answer

  const pick = (v: boolean) => {
    if (picked !== null) return
    setPicked(v)
    v === item.answer ? s.correct() : s.wrong()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className={`glass flex flex-1 items-center justify-center p-6 ${picked !== null && !correct ? 'shake' : ''}`}>
        <Front hint="Sant eller falskt?">{item.statement}</Front>
      </div>
      {picked === null ? (
        <div className="grid grid-cols-2 gap-3">
          <button className="btn border border-rose-400/30 bg-rose-500/20 py-5 text-lg text-rose-100" onClick={() => pick(false)}>✕ Falskt</button>
          <button className="btn border border-emerald-400/30 bg-emerald-500/20 py-5 text-lg text-emerald-100" onClick={() => pick(true)}>✓ Sant</button>
        </div>
      ) : (
        <>
          <Feedback correct={correct} text={item.explanation ?? (correct ? undefined : `Rätt svar: ${item.answer ? 'Sant' : 'Falskt'}`)} />
          <button className="btn-primary" onClick={() => onDone(correct ? 2 : 0)}>Nästa →</button>
        </>
      )}
    </div>
  )
}

export function MultipleChoice({ item, onDone }: ExerciseProps & { item: MCQItem }) {
  const [picked, setPicked] = useState<number | null>(null)
  const s = useSfx()
  const order = useMemo(() => shuffle(item.options.map((_, i) => i)), [item.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setPicked(null), [item.id])
  const correct = picked === item.correct

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    i === item.correct ? s.correct() : s.wrong()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="glass flex items-center justify-center p-6">
        <Front hint="Välj rätt">{item.question}</Front>
      </div>
      <div className="flex flex-col gap-2">
        {order.map((i) => {
          const state =
            picked === null ? 'border-white/10 bg-white/5 hover:bg-white/10'
            : i === item.correct ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-100'
            : i === picked ? 'border-rose-400/50 bg-rose-500/20 text-rose-100 shake'
            : 'border-white/5 bg-white/5 opacity-50'
          return (
            <button key={i} className={`btn justify-start border text-left font-medium ${state}`} onClick={() => pick(i)}>
              {item.options[i]}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <>
          {item.explanation && <Feedback correct={correct} text={item.explanation} />}
          <button className="btn-primary" onClick={() => onDone(correct ? 2 : 0)}>Nästa →</button>
        </>
      )}
    </div>
  )
}

/** Tap steps in the right order. */
export function OrderSteps({ item, onDone }: ExerciseProps & { item: OrderItem }) {
  const [pool, setPool] = useState<string[]>([])
  const [chosen, setChosen] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const s = useSfx()
  useEffect(() => { setPool(shuffle(item.steps)); setChosen([]); setChecked(false) }, [item.id])

  const correct = checked && chosen.every((st, i) => st === item.steps[i])

  const check = () => {
    setChecked(true)
    chosen.every((st, i) => st === item.steps[i]) ? s.correct() : s.wrong()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="glass p-4">
        <Front hint="Ordna stegen">{item.prompt}</Front>
      </div>
      <div className="glass flex min-h-[120px] flex-col gap-2 p-3">
        {chosen.length === 0 && <span className="text-center text-sm text-slate-500">Tryck på stegen nedan i rätt ordning</span>}
        {chosen.map((st, i) => {
          const ok = checked ? st === item.steps[i] : null
          return (
            <motion.button
              layout
              key={st}
              disabled={checked}
              onClick={() => { setChosen(chosen.filter((x) => x !== st)); setPool([...pool, st]) }}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${ok === null ? 'border-brand-400/40 bg-brand-500/20' : ok ? 'border-emerald-400/50 bg-emerald-500/20' : 'border-rose-400/50 bg-rose-500/20'}`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs">{i + 1}</span>
              {st}
            </motion.button>
          )
        })}
      </div>
      <div className="flex flex-col gap-2">
        {pool.map((st) => (
          <motion.button
            layout
            key={st}
            onClick={() => { setPool(pool.filter((x) => x !== st)); setChosen([...chosen, st]) }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
          >
            {st}
          </motion.button>
        ))}
      </div>
      {!checked ? (
        <button className="btn-primary" disabled={pool.length > 0} onClick={check}>Kontrollera</button>
      ) : (
        <>
          {!correct && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
              <div className="mb-1 font-semibold text-slate-300">Rätt ordning:</div>
              <ol className="list-decimal space-y-0.5 pl-5">{item.steps.map((st) => <li key={st}>{st}</li>)}</ol>
            </div>
          )}
          <button className="btn-primary" onClick={() => onDone(correct ? 2 : 0)}>Nästa →</button>
        </>
      )}
    </div>
  )
}

export function Exercise({ item, onDone }: ExerciseProps) {
  switch (item.type) {
    case 'truefalse': return <TrueFalse item={item} onDone={onDone} />
    case 'mcq': return <MultipleChoice item={item} onDone={onDone} />
    case 'order': return <OrderSteps item={item} onDone={onDone} />
    default: return <Flashcard item={item} onDone={onDone} />
  }
}
