import React, { useState, useEffect, useRef } from 'react';
import { type CharacterData } from '../../data/curriculum';
import styles from './Speaking.module.scss';
import { Mic, CheckCircle, XCircle } from 'lucide-react';

interface SpeakingProps {
    character: CharacterData;
    onComplete: () => void;
}

export const Speaking: React.FC<SpeakingProps> = ({ character, onComplete }) => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'zh-HK';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                console.log('Heard:', transcript);
                checkPronunciation(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                setFeedback('wrong');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            console.warn('Speech recognition not supported');
        }
    }, [character]);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setFeedback('idle');
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e);
                setIsListening(false);
            }
        } else {
            // Fallback for no support - just auto pass for now or show alert
            alert('Speech recognition not supported in this browser. Auto-passing.');
            onComplete();
        }
    };

    const checkPronunciation = (transcript: string) => {
        // Simple check: if the transcript contains the character
        if (transcript.includes(character.char)) {
            setFeedback('correct');
            setTimeout(onComplete, 1500);
        } else {
            setFeedback('wrong');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.character}>{character.char}</h1>
                <p className={styles.instruction}>Read it aloud!</p>

                <div className={styles.feedbackContainer}>
                    {feedback === 'correct' && <CheckCircle size={60} color="#70E000" className={styles.iconPop} />}
                    {feedback === 'wrong' && <XCircle size={60} color="#F72585" className={styles.iconShake} />}
                </div>
            </div>

            <button
                className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
                onClick={startListening}
                disabled={feedback === 'correct'}
            >
                <Mic size={48} color="white" />
            </button>

            {isListening && <p className={styles.statusText}>Listening...</p>}
        </div>
    );
};
