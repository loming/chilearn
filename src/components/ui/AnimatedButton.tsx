import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragStart" | "onDragEnd" | "ref"> {
    variant?: 'primary' | 'secondary' | 'accent';
    children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    variant = 'primary',
    onClick,
    className,
    ...props
}) => {
    const { playClick } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playClick();
        if (onClick) {
            onClick(e);
        }
    };

    const getVariantColor = () => {
        switch (variant) {
            case 'secondary': return 'var(--color-secondary)';
            case 'accent': return 'var(--color-accent)';
            default: return 'var(--color-primary)';
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            style={{
                backgroundColor: getVariantColor(),
                color: variant === 'accent' ? 'var(--color-text)' : 'white',
                border: 'none',
                // Add a fun border bottom for 3D effect
                borderBottom: `4px solid rgba(0,0,0,0.2)`,
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};
