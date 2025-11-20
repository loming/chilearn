import React, { useState, useEffect, useRef } from 'react';
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
    x: number;
    y: number;
}

export const Puzzle: React.FC<PuzzleProps> = ({ characters, onComplete }) => {
    const [items, setItems] = useState<DraggableChar[]>([]);
    const [slots, setSlots] = useState<CharacterData[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Initialize game
    useEffect(() => {
        setSlots(characters);

        // Delay slightly to ensure container dimensions are available
        const timer = setTimeout(() => {
            initializeItems();
            playAllSounds(characters);
        }, 100);

        return () => clearTimeout(timer);
    }, [characters]);

    const initializeItems = () => {
        if (!containerRef.current) return;

        const { width, height } = containerRef.current.getBoundingClientRect();
        const padding = 50;
        const slotAreaHeight = 200; // Approximate height of the top slot area

        const newItems = characters.map((char, index) => ({
            ...char,
            id: `char-${index}`,
            isPlaced: false,
            x: Math.random() * (width - 100 - padding * 2) + padding,
            y: Math.random() * (height - slotAreaHeight - 100 - padding) + slotAreaHeight
        }));

        setItems(newItems);
    };

    const playAllSounds = (chars: CharacterData[]) => {
        // Cancel any existing speech
        window.speechSynthesis.cancel();

        chars.forEach(char => {
            const utterance = new SpeechSynthesisUtterance(char.char);
            utterance.lang = 'zh-HK';
            utterance.rate = 1.2; // Slightly faster
            window.speechSynthesis.speak(utterance);
        });
    };

    const handleDragStart = (char: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(char);
        utterance.lang = 'zh-HK';
        window.speechSynthesis.speak(utterance);
    };

    const handleDragEnd = (item: DraggableChar, info: any) => {
        const dropPoint = info.point;
        let closestSlotIndex = -1;
        let minDistance = Infinity;
        const threshold = 100; // Snap distance threshold

        // Find closest slot
        slotRefs.current.forEach((slotRef, index) => {
            if (slotRef) {
                const rect = slotRef.getBoundingClientRect();
                const slotCenter = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                const distance = Math.sqrt(
                    Math.pow(dropPoint.x - slotCenter.x, 2) +
                    Math.pow(dropPoint.y - slotCenter.y, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSlotIndex = index;
                }
            }
        });

        if (minDistance < threshold && closestSlotIndex !== -1) {
            const targetSlot = slots[closestSlotIndex];

            if (targetSlot.char === item.char) {
                // Correct match!
                setItems(prev => {
                    const updatedItems = prev.map(i =>
                        i.id === item.id ? { ...i, isPlaced: true } : i
                    );

                    // Check win condition
                    const allPlaced = updatedItems.every(i => i.isPlaced);
                    if (allPlaced) {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                        setTimeout(onComplete, 2000);
                    }
                    return updatedItems;
                });
            }
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.header}>
                <h2>Puzzle Mode</h2>
                <p>Drag the characters to the correct boxes!</p>
            </div>

            <div className={styles.slotsContainer}>
                {slots.map((char, index) => (
                    <div
                        key={`slot-${index}`}
                        className={styles.slot}
                        data-slot-id={char.char}
                        ref={el => { slotRefs.current[index] = el }}
                    >
                        <span className={styles.slotHint}>{char.pinyin}</span>
                        {items.find(i => i.char === char.char && i.isPlaced) && (
                            <motion.div
                                layoutId={`char-${char.char}`}
                                className={styles.placedChar}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {char.char}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.piecesContainer}>
                <AnimatePresence>
                    {items.map((item) => (
                        !item.isPlaced && (
                            <motion.div
                                key={item.id}
                                layoutId={`char-${item.char}`}
                                className={styles.piece}
                                drag
                                dragMomentum={false}
                                initial={{ x: item.x, y: item.y, scale: 0 }}
                                animate={{ x: item.x, y: item.y, scale: 1 }}
                                exit={{ scale: 0 }}
                                whileHover={{ scale: 1.1, zIndex: 100 }}
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
        </div>
    );
};
