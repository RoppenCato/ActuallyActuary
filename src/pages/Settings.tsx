import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../store/progress'
import { allItems, categories } from '../content/loader'

export function SettingsPage() {
  const settings = useProgress((s) => s.settings)
  const setSetting = useProgress((s) => s.setSetting)
  const exportJson = useProgress((s) => s.exportJson)
  const importJson = useProgress((s) => s.importJson)
  const reset = useProgress((s) => s.reset)
  const stats = useProgress((s) => s.stats)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `actuallyactuary-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = async (f: File | undefined) => {
    if (!f) return
    const ok = importJson(await f.text())
    setMsg(ok ? 'Progress importerad.' : 'Kunde inte läsa filen.')
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Link to="/" className="text-sm text-slate-400 hover:text-white">← Hem</Link>
      <h1 className="text-2xl font-bold">Inställningar</h1>

      <section className="glass flex flex-col gap-3 p-4">
        <label className="flex items-center justify-between">
          <span>Ljud</span>
          <input type="checkbox" className="h-5 w-5 accent-brand-500" checked={settings.sound} onChange={(e) => setSetting('sound', e.target.checked)} />
        </label>
        <label className="flex items-center justify-between">
          <span>Kort per pass</span>
          <select
            className="rounded-lg bg-white/10 px-2 py-1"
            value={settings.sessionSize}
            onChange={(e) => setSetting('sessionSize', Number(e.target.value))}
          >
            {[10, 15, 20, 30].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </section>

      <section className="glass flex flex-col gap-3 p-4">
        <h2 className="font-semibold">Progress</h2>
        <p className="text-sm text-slate-400">
          Progress sparas i den här webbläsaren. Exportera en fil för backup eller för att flytta till en annan enhet.
        </p>
        <div className="flex gap-2">
          <button className="btn-ghost flex-1" onClick={doExport}>Exportera</button>
          <button className="btn-ghost flex-1" onClick={() => fileRef.current?.click()}>Importera</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => doImport(e.target.files?.[0])} />
        </div>
        {msg && <p className="text-sm text-emerald-300">{msg}</p>}
        <button
          className="btn-ghost text-rose-300"
          onClick={() => { if (confirm('Nollställa all progress? Det går inte att ångra.')) { reset(); setMsg('Progress nollställd.') } }}
        >
          Nollställ progress
        </button>
      </section>

      <section className="glass p-4 text-sm text-slate-400">
        <div>{categories.length} kategorier · {allItems.length} kort</div>
        <div>{stats.answered} svar · {stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0} % rätt · {stats.sessions} pass</div>
      </section>
    </div>
  )
}
