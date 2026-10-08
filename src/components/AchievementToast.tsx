import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../store/progress'
import { newlyUnlocked, type Achievement } from '../lib/achievements'
import { sfx } from '../lib/sound'
import { create } from 'zustand'

type ToastState = { queue: Achievement[]; push: (a: Achievement[]) => void; shift: () => void }
const useToasts = create<ToastState>((set) => ({
  queue: [],
  push: (a) => set((s) => ({ queue: [...s.queue, ...a.filter((x) => !s.queue.some((q) => q.id === x.id))] })),
  shift: () => set((s) => ({ queue: s.queue.slice(1) })),
}))

/** Watches progress and unlocks achievements; renders the toast for each new one. */
export function AchievementWatcher() {
  const state = useProgress()
  const { queue, push, shift } = useToasts()

  useEffect(() => {
    const fresh = newlyUnlocked(state)
    if (fresh.length === 0) return
    fresh.forEach((a) => state.unlock(a.id))
    if (state.settings.sound) sfx.levelUp()
    push(fresh)
  }, [state.xp, state.stats, state.streak, state.cards]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = queue[0]
  useEffect(() => {
    if (queue.length === 0) return
    const t = setTimeout(shift, 3500)
    return () => clearTimeout(t)
  }, [queue, shift])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 safe-top">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="glass flex items-center gap-3 border-amber-400/40 px-4 py-3 shadow-xl shadow-amber-500/20"
          >
            <span className="text-3xl">{current.icon}</span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">Achievement</div>
              <div className="font-bold">{current.title}</div>
              <div className="text-xs text-slate-400">{current.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
