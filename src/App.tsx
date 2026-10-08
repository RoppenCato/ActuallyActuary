import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { CategoryPage } from './pages/Category'
import { SettingsPage } from './pages/Settings'
import { PlayPage } from './pages/Play'
import { BlitzPage } from './pages/Blitz'
import { MatchPage } from './pages/Match'

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
        </Route>
      </Routes>
    </HashRouter>
  )
}
