import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

// Import sound assets (placeholders for now)
// In a real app, these would be actual paths
import bgmUrl from '../assets/sounds/bgm.wav';
import clickUrl from '../assets/sounds/click.wav';
import correctUrl from '../assets/sounds/correct.wav';
import wrongUrl from '../assets/sounds/wrong.wav';

type SoundType = 'click' | 'correct' | 'wrong';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playSound: (type: SoundType) => void;
    volume: number;
    setVolume: (vol: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const bgmRef = useRef<HTMLAudioElement | null>(null);

    // Initialize BGM
    useEffect(() => {
        bgmRef.current = new Audio(bgmUrl);
        bgmRef.current.loop = true;
        bgmRef.current.volume = volume * 0.5; // BGM slightly lower

        // Try to play automatically (might be blocked by browser policy)
        const playPromise = bgmRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented:", error);
            });
        }

        return () => {
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current = null;
            }
        };
    }, []);

    // Handle Mute/Volume changes
    useEffect(() => {
        if (bgmRef.current) {
            bgmRef.current.muted = isMuted;
            bgmRef.current.volume = isMuted ? 0 : volume * 0.5;
        }
    }, [isMuted, volume]);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const playSound = (type: SoundType) => {
        if (isMuted) return;

        let url = '';
        switch (type) {
            case 'click': url = clickUrl; break;
            case 'correct': url = correctUrl; break;
            case 'wrong': url = wrongUrl; break;
        }

        if (url) {
            const audio = new Audio(url);
            audio.volume = volume;
            audio.play().catch(e => console.log("SFX play failed:", e));
        }
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playSound, volume, setVolume }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSoundContext must be used within a SoundProvider');
    }
    return context;
};
