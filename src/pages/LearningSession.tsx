import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Listening } from '../components/modules/Listening';
import { Speaking } from '../components/modules/Speaking';
import { Writing } from '../components/modules/Writing';
import { Puzzle } from '../components/modules/Puzzle';
import { Story } from '../components/modules/Story';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { useSound } from '../hooks/useSound';
import styles from './LearningSession.module.scss';
import { ArrowLeft } from 'lucide-react';

type LearningMode = 'listening' | 'speaking' | 'writing';
type SessionPhase = 'learning' | 'puzzle' | 'story';

export const LearningSession: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { chapters, completeChapter, addStars } = useGame();
    const navigate = useNavigate();
    const { playCorrect } = useSound();

    const chapter = chapters.find(c => c.id === chapterId);

    const [phase, setPhase] = useState<SessionPhase>('learning');
    const [charIndex, setCharIndex] = useState(0);
    const [mode, setMode] = useState<LearningMode>('listening');

    useEffect(() => {
        if (!chapter) {
            navigate('/');
        }
    }, [chapter, navigate]);

    if (!chapter) return null;

    const currentCharacter = chapter.characters[charIndex];

    const handleLearningComplete = () => {
        playCorrect();
        if (charIndex < chapter.characters.length - 1) {
            setCharIndex(prev => prev + 1);
            setMode('listening');
        } else {
            // All characters learned, move to Puzzle phase
            setPhase('puzzle');
        }
    };

    const handleNext = () => {
        if (phase === 'learning') {
            if (mode === 'listening') {
                setMode('speaking');
            } else if (mode === 'speaking') {
                setMode('writing');
            } else {
                handleLearningComplete();
            }
        } else if (phase === 'puzzle') {
            // Puzzle complete, move to Story phase
            setPhase('story');
            setCharIndex(0); // Reset index for story mode
        } else if (phase === 'story') {
            if (charIndex < chapter.characters.length - 1) {
                setCharIndex(prev => prev + 1);
            } else {
                // Story complete (Chapter Complete)
                playCorrect();
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                completeChapter(chapter.id);
                addStars(chapter.characters.length * 5); // Bonus stars for full completion
                setTimeout(() => navigate('/'), 2000);
            }
        }
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                    <AnimatedButton
                        variant="secondary"
                        onClick={() => navigate('/')}
                        style={{ padding: '0.5em', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowLeft size={24} />
                    </AnimatedButton>
                </div>

                <div className={styles.progress}>
                    {phase === 'learning' && `Learning: Character ${charIndex + 1} / ${chapter.characters.length}`}
                    {phase === 'puzzle' && `Puzzle Challenge!`}
                    {phase === 'story' && `Story Time: ${charIndex + 1} / ${chapter.characters.length}`}
                </div>

                <div className={styles.content}>
                    {phase === 'learning' && (
                        <>
                            {mode === 'listening' && (
                                <Listening
                                    character={currentCharacter}
                                    onComplete={handleNext}
                                />
                            )}
                            {mode === 'speaking' && <Speaking character={currentCharacter} onComplete={handleNext} />}
                            {mode === 'writing' && <Writing character={currentCharacter} onComplete={handleNext} />}
                        </>
                    )}

                    {phase === 'puzzle' && (
                        <Puzzle
                            characters={chapter.characters}
                            onComplete={handleNext}
                        />
                    )}

                    {phase === 'story' && (
                        <Story
                            character={currentCharacter}
                            onComplete={handleNext}
                        />
                    )}
                </div>
            </div>
        </PageTransition>
    );
};
