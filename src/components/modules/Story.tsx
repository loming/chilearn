import React, { useState, useEffect, useRef } from 'react';
import type { CharacterData } from '../../data/curriculum';
import styles from './Story.module.scss';
import { Play, RotateCcw, Check } from 'lucide-react';
import { AnimatedButton } from '../ui/AnimatedButton';

interface StoryProps {
    character: CharacterData;
    onComplete: () => void;
}

export const Story: React.FC<StoryProps> = ({ character, onComplete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [words, setWords] = useState<string[]>([]);
    const [storyComplete, setStoryComplete] = useState(false);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Reset state when character changes
        setStoryComplete(false);
        setHighlightedIndex(-1);
        setIsPlaying(false);
        window.speechSynthesis.cancel();

        if (character.story) {
            // Simple word splitting by space for English stories
            // For Chinese stories, this would need a more sophisticated segmenter
            // Assuming the story is in English based on the curriculum update
            const storyWords = character.story.split(' ');
            setWords(storyWords);
        }
    }, [character]);

    const playStory = () => {
        if (!character.story) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(character.story);
        utterance.lang = 'en-US'; // Assuming English story for now
        utterance.rate = 0.8; // Slower rate for kids

        utterance.onstart = () => {
            setIsPlaying(true);
            setHighlightedIndex(-1);
        };

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                // Calculate which word index corresponds to the char index
                // This is an approximation. For perfect syncing, we'd need to map char indices to word indices
                // accurately.
                // A simpler visual approach for now:
                // We can just highlight the whole sentence or try to map it.

                // Let's try to map character index to word index
                const charIndex = event.charIndex;
                const textBefore = character.story!.substring(0, charIndex);
                const wordIndex = textBefore.split(' ').length - 1;
                // Adjust for leading spaces if any, but split usually handles it
                setHighlightedIndex(wordIndex);
            }
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setHighlightedIndex(-1);
            setStoryComplete(true);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handleReplay = () => {
        playStory();
    };

    return (
        <div className={styles.container}>
            <h2>Story Time</h2>
            <div className={styles.characterDisplay}>
                <span className={styles.largeChar}>{character.char}</span>
                <span className={styles.pinyin}>{character.pinyin}</span>
            </div>

            <div className={styles.storyBox}>
                <p>
                    {words.map((word, index) => (
                        <span
                            key={index}
                            className={`${styles.word} ${index === highlightedIndex ? styles.highlight : ''} ${word.includes(character.char) ? styles.targetChar : ''}`}
                        >
                            {word}{' '}
                        </span>
                    ))}
                </p>
            </div>

            <div className={styles.controls}>
                {!isPlaying && !storyComplete && (
                    <AnimatedButton className={styles.playButton} onClick={playStory} variant="primary">
                        <Play size={24} />
                        Read to Me
                    </AnimatedButton>
                )}

                {isPlaying && (
                    <div className={styles.playingIndicator}>
                        Listening...
                    </div>
                )}

                {storyComplete && (
                    <div className={styles.completeControls}>
                        <AnimatedButton className={styles.replayButton} onClick={handleReplay} variant="secondary">
                            <RotateCcw size={20} />
                            Again
                        </AnimatedButton>
                        <AnimatedButton className={styles.nextButton} onClick={onComplete} variant="primary">
                            <Check size={24} />
                            Next
                        </AnimatedButton>
                    </div>
                )}
            </div>
        </div>
    );
};
