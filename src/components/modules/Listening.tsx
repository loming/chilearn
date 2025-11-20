import React, { useEffect } from 'react';
import { type CharacterData } from '../../data/curriculum';
import styles from './Listening.module.scss';
import { Volume2, ArrowRight } from 'lucide-react';

interface ListeningProps {
    character: CharacterData;
    onComplete: () => void;
}

export const Listening: React.FC<ListeningProps> = ({ character, onComplete }) => {

    const playAudio = () => {
        const utterance = new SpeechSynthesisUtterance(character.char);
        utterance.lang = 'zh-HK'; // Traditional Chinese
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        // Auto-play with a slight delay
        const timer = setTimeout(() => {
            playAudio();
        }, 500);
        return () => clearTimeout(timer);
    }, [character]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.character}>{character.char}</h1>
                <p className={styles.pinyin}>{character.pinyin}</p>
                <p className={styles.meaning}>{character.meaning}</p>

                <button className={styles.playButton} onClick={playAudio}>
                    <Volume2 size={48} color="white" />
                </button>
            </div>

            <button className={styles.nextButton} onClick={onComplete}>
                <span>I heard it!</span>
                <ArrowRight size={24} />
            </button>
        </div>
    );
};
