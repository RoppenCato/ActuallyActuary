import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { CategoryPage } from './pages/Category'
import { SettingsPage } from './pages/Settings'
import { PlayPage } from './pages/Play'
import { BlitzPage } from './pages/Blitz'
import { MatchPage } from './pages/Match'

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="text-xl font-bold">Sidan finns inte i den här versionen</h1>
      <p className="text-sm text-slate-400">Appen är troligen inte uppdaterad. Gå till Inställningar och tryck "Uppdatera appen".</p>
      <a href="#/settings" className="btn-primary">Inställningar</a>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/c/:catId" element={<CategoryPage />} />
          <Route path="/play/:catId" element={<PlayPage />} />
          <Route path="/play/:catId/:subId" element={<PlayPage />} />
          <Route path="/blitz/:catId" element={<BlitzPage />} />
          <Route path="/blitz/:catId/:subId" element={<BlitzPage />} />
          <Route path="/match/:catId" element={<MatchPage />} />
          <Route path="/match/:catId/:subId" element={<MatchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
