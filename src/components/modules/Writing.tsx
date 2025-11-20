import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { type CharacterData } from '../../data/curriculum';
import styles from './Writing.module.scss';
import { Pencil, RefreshCw, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '../ui/AnimatedButton';

interface WritingProps {
    character: CharacterData;
    onComplete: () => void;
}

export const Writing: React.FC<WritingProps> = ({ character, onComplete }) => {
    const writerRef = useRef<HanziWriter | null>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [mistakes, setMistakes] = useState(0);

    useEffect(() => {
        if (targetRef.current) {
            // Clean up previous instance if any (though React key should handle this)
            targetRef.current.innerHTML = '';

            writerRef.current = HanziWriter.create(targetRef.current, character.char, {
                width: 300,
                height: 300,
                padding: 20,
                showOutline: true,
                strokeAnimationSpeed: 1,
                delayBetweenStrokes: 500,
                radicalColor: '#F72585',
                strokeColor: '#4CC9F0',
                outlineColor: '#ddd',
                drawingWidth: 20,
                showCharacter: false,
                showHintAfterMisses: 3,
                highlightOnComplete: true,
                highlightCompleteColor: '#70E000',
            });

            animate();
        }
    }, [character]);

    const startQuiz = () => {
        if (writerRef.current) {
            setIsComplete(false);
            setMistakes(0);
            writerRef.current.quiz({
                onMistake: () => {
                    setMistakes(prev => prev + 1);
                },
                onComplete: () => {
                    setIsComplete(true);
                }
            });
        }
    };

    const animate = () => {
        if (writerRef.current) {
            writerRef.current.animateCharacter({
                onComplete: () => {
                    startQuiz();
                }
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Write: {character.char}</h2>
                <div className={styles.controls}>
                    <AnimatedButton className={styles.iconButton} onClick={animate} title="Show Stroke Order" variant="secondary">
                        <RefreshCw size={24} color="#3A0CA3" />
                    </AnimatedButton>
                </div>
            </div>

            <div className={styles.canvasContainer}>
                <div ref={targetRef} className={styles.writerTarget} />
                <div className={styles.pencilIcon}>
                    <Pencil size={32} color="#F72585" />
                </div>
            </div>

            {isComplete ? (
                <AnimatedButton className={styles.nextButton} onClick={onComplete} variant="primary">
                    <span>Great Job!</span>
                    <ArrowRight size={24} />
                </AnimatedButton>
            ) : (
                <p className={styles.instruction}>Trace the strokes!</p>
            )}

            {mistakes > 2 && !isComplete && (
                <p className={styles.hint}>Watch the animation if you're stuck!</p>
            )}
        </div>
    );
};
