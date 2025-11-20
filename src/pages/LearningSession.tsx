import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Listening } from '../components/modules/Listening';
import { Speaking } from '../components/modules/Speaking';
import { Writing } from '../components/modules/Writing';
import styles from './LearningSession.module.scss';
import { ArrowLeft } from 'lucide-react';

type LearningMode = 'listening' | 'speaking' | 'writing';

export const LearningSession: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { chapters, completeChapter, addStars } = useGame();
    const navigate = useNavigate();

    const chapter = chapters.find(c => c.id === chapterId);

    const [charIndex, setCharIndex] = useState(0);
    const [mode, setMode] = useState<LearningMode>('listening');

    useEffect(() => {
        if (!chapter) {
            navigate('/');
        }
    }, [chapter, navigate]);

    if (!chapter) return null;

    const currentCharacter = chapter.characters[charIndex];

    const handleCharacterComplete = () => {
        if (charIndex < chapter.characters.length - 1) {
            setCharIndex(prev => prev + 1);
            setMode('listening');
        } else {
            // Chapter Complete
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            completeChapter(chapter.id);
            addStars(chapter.characters.length * 3); // 3 stars per char
            setTimeout(() => navigate('/'), 2000);
        }
    };

    const handleNext = () => {
        if (mode === 'listening') {
            setMode('speaking');
        } else if (mode === 'speaking') {
            setMode('writing');
        } else {
            handleCharacterComplete();
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                <ArrowLeft size={32} color="#3A0CA3" />
            </button>

            <div className={styles.progress}>
                Character {charIndex + 1} / {chapter.characters.length}
            </div>

            <div className={styles.content}>
                {mode === 'listening' && (
                    <Listening
                        character={currentCharacter}
                        onComplete={handleNext}
                    />
                )}
                {mode === 'speaking' && <Speaking character={currentCharacter} onComplete={handleNext} />}
                {mode === 'writing' && <Writing character={currentCharacter} onComplete={handleNext} />}
            </div>
        </div>
    );
};
