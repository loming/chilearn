import { useSoundContext } from '../context/SoundContext';

export const useSound = () => {
    const { playSound } = useSoundContext();

    const playClick = () => playSound('click');
    const playCorrect = () => playSound('correct');
    const playWrong = () => playSound('wrong');

    return {
        playClick,
        playCorrect,
        playWrong
    };
};
