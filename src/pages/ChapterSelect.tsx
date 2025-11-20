import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { PageTransition } from '../components/ui/PageTransition';
import { useSound } from '../hooks/useSound';
import styles from './ChapterSelect.module.scss';
import { Lock, Star } from 'lucide-react';

export const ChapterSelect: React.FC = () => {
    const { chapters, gameState } = useGame();
    const navigate = useNavigate();
    const { playClick } = useSound();

    const handleChapterClick = (chapterId: string, isLocked: boolean) => {
        if (!isLocked) {
            playClick();
            navigate(`/learn/${chapterId}`);
        }
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>ChiLearn Adventure</h1>
                    <div className={styles.stats}>
                        <Star fill="#FFD60A" color="#FFD60A" />
                        <span>{gameState.stars}</span>
                    </div>
                </header>

                <div className={styles.grid}>
                    {chapters.map((chapter) => (
                        <motion.div
                            key={chapter.id}
                            className={`${styles.card} ${chapter.isLocked ? styles.locked : ''}`}
                            onClick={() => handleChapterClick(chapter.id, chapter.isLocked)}
                            whileHover={!chapter.isLocked ? { scale: 1.05, y: -5 } : {}}
                            whileTap={!chapter.isLocked ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Number(chapter.id) * 0.1 }}
                        >
                            {chapter.isLocked && (
                                <div className={styles.lockOverlay}>
                                    <Lock size={40} color="white" />
                                </div>
                            )}
                            <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                            <div className={styles.chapterInfo}>
                                <span>{chapter.characters.length} Characters</span>
                            </div>
                            {gameState.completedChapters.includes(chapter.id) && (
                                <div className={styles.completedBadge}>
                                    <Star size={20} fill="#FFD60A" color="#FFD60A" />
                                    <span>Done!</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
};
