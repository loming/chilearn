import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import styles from './ChapterSelect.module.scss';
import { Lock, Star } from 'lucide-react';

export const ChapterSelect: React.FC = () => {
    const { chapters, gameState } = useGame();
    const navigate = useNavigate();

    const handleChapterClick = (chapterId: string, isLocked: boolean) => {
        if (!isLocked) {
            navigate(`/learn/${chapterId}`);
        }
    };

    return (
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
                    <div
                        key={chapter.id}
                        className={`${styles.card} ${chapter.isLocked ? styles.locked : ''}`}
                        onClick={() => handleChapterClick(chapter.id, chapter.isLocked)}
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
                    </div>
                ))}
            </div>
        </div>
    );
};
