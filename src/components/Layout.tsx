import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress, levelFromXp } from '../store/progress'

export function Layout() {
  const xp = useProgress((s) => s.xp)
  const streak = useProgress((s) => s.streak)
  const { level, into, needed } = levelFromXp(xp)
  const loc = useLocation()
  const inSession = loc.pathname.startsWith('/play')

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col safe-top">
      {!inSession && (
        <header className="sticky top-0 z-20 px-4 pt-3 pb-2 backdrop-blur-md">
          <div className="glass flex items-center gap-3 px-3 py-2">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm text-white shadow-lg">AA</span>
              <span className="hidden sm:inline">ActuallyActuary</span>
            </Link>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1" title="Streak">
                <span className={streak.count > 0 ? '' : 'grayscale opacity-50'}>🔥</span>
                <span className="font-semibold tabular-nums">{streak.count}</span>
              </div>
              <div className="flex flex-col items-end leading-tight">
                <span className="text-xs text-slate-400">Nivå {level}</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-400 to-accent-400"
                    animate={{ width: `${(into / needed) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                  />
                </div>
              </div>
              <Link to="/settings" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Inställningar">
                ⚙️
              </Link>
            </div>
          </div>
        </header>
      )}
      <main className="flex flex-1 flex-col px-4 pb-6 safe-bottom">
        <AnimatePresence mode="wait">
          <motion.div
            key={loc.pathname}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
