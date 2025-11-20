import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/Layout';
import { ChapterSelect } from './pages/ChapterSelect';
import { LearningSession } from './pages/LearningSession';

function App() {
  return (
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
}

export default App;
