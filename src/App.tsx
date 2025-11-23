import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ChapterSelect } from './pages/ChapterSelect'
import { LearningSession } from './pages/LearningSession'
import { GameProvider } from './context/GameContext'
import './App.css'
import { CloudBackground } from './components/CloudBackground'

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
    <GameProvider>
      <Router>
        <CloudBackground />
        <AnimatedRoutes />
      </Router>
    </GameProvider>
  )
}

export default App
