import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ChapterSelect } from './pages/ChapterSelect'
import { LearningSession } from './pages/LearningSession'
import { SoundProvider, useSoundContext } from './context/SoundContext'
import { AnimatedButton } from './components/ui/AnimatedButton'
import { Volume2, VolumeX } from 'lucide-react'
import { GameProvider } from './context/GameContext'
import './App.css'

const MusicToggle = () => {
  const { isMuted, toggleMute } = useSoundContext();
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <AnimatedButton
        variant="accent"
        onClick={toggleMute}
        style={{ padding: '0.5em', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </AnimatedButton>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ChapterSelect />} />
        <Route path="/learn/:chapterId" element={<LearningSession />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <SoundProvider>
      <GameProvider>
        <Router>
          <MusicToggle />
          <AnimatedRoutes />
        </Router>
      </GameProvider>
    </SoundProvider>
  )
}

export default App
