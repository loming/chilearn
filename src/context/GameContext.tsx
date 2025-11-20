import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRICULUM, type ChapterData } from '../data/curriculum';

interface GameState {
    unlockedChapters: string[];
    completedChapters: string[];
    stars: number;
}

interface GameContextType {
    gameState: GameState;
    unlockChapter: (chapterId: string) => void;
    completeChapter: (chapterId: string) => void;
    addStars: (amount: number) => void;
    chapters: ChapterData[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_STATE: GameState = {
    unlockedChapters: ['chap_1'],
    completedChapters: [],
    stars: 0,
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const saved = localStorage.getItem('chilearn_save');
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem('chilearn_save', JSON.stringify(gameState));
    }, [gameState]);

    const unlockChapter = (chapterId: string) => {
        setGameState(prev => {
            if (prev.unlockedChapters.includes(chapterId)) return prev;
            return { ...prev, unlockedChapters: [...prev.unlockedChapters, chapterId] };
        });
    };

    const completeChapter = (chapterId: string) => {
        setGameState(prev => {
            if (prev.completedChapters.includes(chapterId)) return prev;
            return { ...prev, completedChapters: [...prev.completedChapters, chapterId] };
        });
    };

    const addStars = (amount: number) => {
        setGameState(prev => ({ ...prev, stars: prev.stars + amount }));
    };

    const chapters = CURRICULUM.map(chap => ({
        ...chap,
        isLocked: !gameState.unlockedChapters.includes(chap.id),
    }));

    return (
        <GameContext.Provider value={{ gameState, unlockChapter, completeChapter, addStars, chapters }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
