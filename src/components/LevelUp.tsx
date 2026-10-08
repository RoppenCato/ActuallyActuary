import { motion, AnimatePresence } from 'framer-motion'

export function LevelUp({ level, onClose }: { level: number | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass flex w-full max-w-xs flex-col items-center gap-3 p-8 text-center"
            initial={{ scale: 0.6, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              ⭐
            </motion.div>
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-400">Nivå upp</div>
            <div className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-5xl font-black text-transparent">{level}</div>
            <p className="text-sm text-slate-400">Fortsätt så!</p>
            <button className="btn-primary mt-2 w-full" onClick={onClose}>Fortsätt</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
