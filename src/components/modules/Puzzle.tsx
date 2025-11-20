import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterData } from '../../data/curriculum';
import styles from './Puzzle.module.scss';
import confetti from 'canvas-confetti';

interface PuzzleProps {
    characters: CharacterData[];
    onComplete: () => void;
}

interface DraggableChar extends CharacterData {
    id: string;
    isPlaced: boolean;
}

export const Puzzle: React.FC<PuzzleProps> = ({ characters, onComplete }) => {
    const [items, setItems] = useState<DraggableChar[]>([]);
    const [slots, setSlots] = useState<CharacterData[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    // Initialize game
    useEffect(() => {
        const initialItems = characters.map((char, index) => ({
            ...char,
            id: `char-${index}`,
            isPlaced: false
        }));
        setItems(initialItems);
        setSlots(characters);

        // Play all sounds initially
        playAllSounds(characters);
    }, [characters]);

    const playAllSounds = async (chars: CharacterData[]) => {
        for (const char of chars) {
            await playSound(char.char);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        scatterItems();
    };

    const playSound = (text: string) => {
        return new Promise<void>((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.onend = () => resolve();
            window.speechSynthesis.speak(utterance);
        });
    };

    const scatterItems = () => {
        setGameStarted(true);
        setItems(prev => {
            const newItems = [...prev];
            // Fisher-Yates shuffle
            for (let i = newItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
            }
            return newItems;
        });
    };

    const handleDragStart = (char: string) => {
        playSound(char);
    };

    const handleDragEnd = (item: DraggableChar, info: any) => {
        const point = info.point;
        const element = document.elementFromPoint(point.x, point.y);
        const slotId = element?.getAttribute('data-slot-id');

        if (slotId === item.char) {
            // Correct match!
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, isPlaced: true } : i
            ));

            // Check win condition
            const allPlaced = items.every(i => i.id === item.id ? true : i.isPlaced);
            if (allPlaced) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setTimeout(onComplete, 2000);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2>Puzzle Mode</h2>
            <p>Listen and drag the characters to the correct boxes!</p>

            <div className={styles.slotsContainer}>
                {slots.map((char, index) => (
                    <div
                        key={`slot-${index}`}
                        className={styles.slot}
                        data-slot-id={char.char}
                    >
                        <span className={styles.slotHint}>{char.pinyin}</span>
                        {items.find(i => i.char === char.char && i.isPlaced) && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={styles.placedChar}
                            >
                                {char.char}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.piecesContainer}>
                <AnimatePresence>
                    {gameStarted && items.map((item) => (
                        !item.isPlaced && (
                            <motion.div
                                key={item.id}
                                className={styles.piece}
                                drag
                                dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                                whileHover={{ scale: 1.1 }}
                                whileDrag={{ scale: 1.2, zIndex: 100 }}
                                onDragStart={() => handleDragStart(item.char)}
                                onDragEnd={(_, info) => handleDragEnd(item, info)}
                            >
                                {item.char}
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>

            {!gameStarted && (
                <div className={styles.overlay}>
                    <p>Listen carefully...</p>
                </div>
            )}
        </div>
    );
};
