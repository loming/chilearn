import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/Layout';
import { ChapterSelect } from './pages/ChapterSelect';
import { LearningSession } from './pages/LearningSession';

import { CloudBackground } from './components/CloudBackground'

function App() {
  return (
<<<<<<< HEAD
    <GameProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ChapterSelect />} />
            <Route path="/learn/:chapterId" element={<LearningSession />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </GameProvider>
  );
=======
    <SoundProvider>
      <GameProvider>
        <Router>
          <CloudBackground />
          <MusicToggle />
          <AnimatedRoutes />
        </Router>
      </GameProvider>
    </SoundProvider>
  )
>>>>>>> b0c222b (Animated cloud background and new image assets)
}

export default App;
