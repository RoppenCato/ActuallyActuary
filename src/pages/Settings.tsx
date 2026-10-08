import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../store/progress'
import { allItems, categories, itemsById } from '../content/loader'
import { itemPrompt } from '../content/types'

const REPO = 'https://github.com/RoppenCato/ActuallyActuary'

export function SettingsPage() {
  const settings = useProgress((s) => s.settings)
  const setSetting = useProgress((s) => s.setSetting)
  const exportJson = useProgress((s) => s.exportJson)
  const importJson = useProgress((s) => s.importJson)
  const reset = useProgress((s) => s.reset)
  const stats = useProgress((s) => s.stats)
  const flagged = useProgress((s) => s.flagged)
  const toggleFlag = useProgress((s) => s.toggleFlag)
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

  const flaggedList = Object.keys(flagged)
    .sort((a, b) => flagged[a] - flagged[b])
    .map((id) => ({ id, item: itemsById.get(id) }))
  const flaggedText = flaggedList
    .map(({ id, item }) => `- ${id}${item ? ` — ${itemPrompt(item)}` : ' (finns inte längre)'}`)
    .join('\n')
  const issueUrl =
    `${REPO}/issues/new?title=${encodeURIComponent('Flaggade kort att ta bort')}` +
    `&body=${encodeURIComponent(`Ta bort eller skriv om dessa kort:\n\n${flaggedText}\n`)}`

  const forceUpdate = async () => {
    setMsg('Letar efter ny version…')
    try {
      const regs = await navigator.serviceWorker?.getRegistrations?.() ?? []
      await Promise.all(regs.map((r) => r.update()))
    } catch { /* ignore */ }
    setTimeout(() => location.reload(), 800)
  }

  const hardReset = async () => {
    setMsg('Rensar…')
    try {
      const regs = await navigator.serviceWorker?.getRegistrations?.() ?? []
      await Promise.all(regs.map((r) => r.unregister()))
      const keys = await caches?.keys?.() ?? []
      await Promise.all(keys.map((k) => caches.delete(k)))
    } catch { /* ignore */ }
    location.href = location.pathname + '?t=' + Date.now()
  }

  const copyFlagged = async () => {
    try {
      await navigator.clipboard.writeText(flaggedText)
      setMsg('Listan är kopierad. Klistra in den i chatten med Claude.')
    } catch {
      setMsg('Kunde inte kopiera. Markera texten nedan och kopiera manuellt.')
    }
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Link to="/" className="text-sm text-slate-400 hover:text-white">← Hem</Link>
      <h1 className="text-2xl font-bold">Inställningar</h1>

      <section className="glass flex flex-col gap-3 p-4">
        <h2 className="font-semibold">🚩 Flaggade kort ({flaggedList.length})</h2>
        <p className="text-sm text-slate-400">
          Kort du flaggat under träning visas inte igen. Skicka listan till Claude så tas de bort ur innehållet.
        </p>
        {flaggedList.length > 0 && (
          <>
            <ul className="flex flex-col gap-1 text-sm">
              {flaggedList.map(({ id, item }) => (
                <li key={id} className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <span className="flex-1">
                    {item ? itemPrompt(item) : id}
                    <span className="block text-xs text-slate-500">{id}</span>
                  </span>
                  <button className="text-xs text-slate-400 hover:text-white" onClick={() => toggleFlag(id)}>Ångra</button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <a href={issueUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1 text-sm">Skicka som GitHub-ärende</a>
              <button className="btn-ghost flex-1 text-sm" onClick={copyFlagged}>Kopiera lista</button>
            </div>
          </>
        )}
      </section>

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

      <section className="glass flex flex-col gap-3 p-4">
        <h2 className="font-semibold">App</h2>
        <p className="text-sm text-slate-400">Version: byggd {__BUILD_TIME__} UTC</p>
        <div className="flex gap-2">
          <button className="btn-ghost flex-1 text-sm" onClick={forceUpdate}>Uppdatera appen</button>
          <button className="btn-ghost flex-1 text-sm" onClick={hardReset}>Rensa cache</button>
        </div>
        <p className="text-xs text-slate-500">"Rensa cache" tar bort den sparade appversionen och hämtar allt på nytt. Din progress påverkas inte.</p>
      </section>

      <section className="glass p-4 text-sm text-slate-400">
        <div>{categories.length} kategorier · {allItems.length} kort</div>
        <div>{stats.answered} svar · {stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0} % rätt · {stats.sessions} pass</div>
      </section>
    </div>
  )
}
