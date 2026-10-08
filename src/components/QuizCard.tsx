import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Quiz } from '../lib/generate'

type Props = {
  quiz: Quiz
  /** Called as soon as the user picks; the parent decides when to move on. */
  onPick: (correct: boolean) => void
  /** Blitz mode: no explanation, parent advances immediately. */
  instant?: boolean
  onNext?: () => void
}

const HINT: Record<Quiz['kind'], string> = { truefalse: 'Sant eller falskt?', mcq: 'Välj rätt', term: 'Vilket begrepp beskrivs?' }

/** Auto-graded question with buttons. Used by blitz and as a generated variant for terms. */
export function QuizCard({ quiz, onPick, instant, onNext }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  useEffect(() => setPicked(null), [quiz])
  const correct = picked === quiz.correct

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    onPick(i === quiz.correct)
  }

  const twoUp = quiz.kind === 'truefalse'

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className={`glass flex flex-1 items-center justify-center p-5 sm:min-h-[220px] ${picked !== null && !correct ? 'shake' : ''}`}>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{HINT[quiz.kind]}</span>
          <div className={`font-semibold leading-snug ${quiz.question.length > 120 ? 'text-base' : 'text-xl'}`}>{quiz.question}</div>
        </div>
      </div>
      <div className={twoUp ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2'}>
        {quiz.options.map((opt, i) => {
          const base = twoUp
            ? i === 1 ? 'border-emerald-400/30 bg-emerald-500/20 text-emerald-100 py-5 text-lg' : 'border-rose-400/30 bg-rose-500/20 text-rose-100 py-5 text-lg'
            : 'border-white/10 bg-white/5 hover:bg-white/10 justify-start text-left font-medium'
          const state =
            picked === null ? base
            : i === quiz.correct ? 'border-emerald-400/60 bg-emerald-500/30 text-emerald-50'
            : i === picked ? 'border-rose-400/60 bg-rose-500/30 text-rose-50'
            : 'border-white/5 bg-white/5 opacity-40'
          return (
            <button key={i} className={`btn border ${state}`} onClick={() => pick(i)}>
              {twoUp ? (i === 1 ? '✓ Sant' : '✕ Falskt') : opt}
            </button>
          )
        })}
      </div>
      {picked !== null && !instant && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-3 text-sm ${correct ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200' : 'border-rose-400/40 bg-rose-500/10 text-rose-200'}`}
          >
            <div className="font-semibold">{correct ? 'Rätt!' : 'Fel.'}</div>
            {!correct && quiz.kind === 'term' && <div className="mt-1 text-slate-200">Rätt svar: {quiz.options[quiz.correct]}</div>}
            {quiz.explanation && <div className="mt-1 text-slate-200">{quiz.explanation}</div>}
          </motion.div>
          <button className="btn-primary" onClick={onNext}>Nästa →</button>
        </>
      )}
    </div>
  )
}
