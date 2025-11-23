import React from 'react';
import { motion } from 'framer-motion';

const CloudShape1 = () => (
  <path d="M25 45C25 53.2843 31.7157 60 40 60H85C93.2843 60 100 53.2843 100 45C100 37.5 94.5 31.5 87.5 30.5C87.5 30.5 87.5 30.5 87.5 30.5C87.5 13.6553 73.8447 0 57 0C42.5 0 30.5 10 27.5 23.5C12 24.5 0 37.5 0 45C0 53.2843 6.71573 60 15 60H25V45Z" />
);

const CloudShape2 = () => (
  <path d="M15 35C15 43.2843 21.7157 50 30 50H75C83.2843 50 90 43.2843 90 35C90 27.5 84.5 21.5 77.5 20.5C77.5 20.5 77.5 20.5 77.5 20.5C77.5 3.6553 63.8447 -10 47 -10C32.5 -10 20.5 0 17.5 13.5C2 14.5 -10 27.5 -10 35C-10 43.2843 -3.28427 50 5 50H15V35Z" transform="translate(10, 10)" />
);

const CloudShape3 = () => (
  <path d="M10 40C10 48.2843 16.7157 55 25 55H80C88.2843 55 95 48.2843 95 40C95 32.5 89.5 26.5 82.5 25.5C82.5 25.5 82.5 25.5 82.5 25.5C82.5 8.6553 68.8447 -5 52 -5C37.5 -5 25.5 5 22.5 18.5C7 19.5 -5 32.5 -5 40C-5 48.2843 1.71573 55 10 55H10V40Z" transform="translate(5, 5)" />
);

const CloudShape4 = () => (
  <path d="M10 30C10 38.2843 16.7157 45 25 45H70C78.2843 45 85 38.2843 85 30C85 22.5 79.5 16.5 72.5 15.5C72.5 15.5 72.5 15.5 72.5 15.5C72.5 -1.3447 58.8447 -15 42 -15C27.5 -15 15.5 -5 12.5 8.5C-3 9.5 -15 22.5 -15 30C-15 38.2843 -8.28427 45 0 45H10V30Z" transform="translate(15, 15)" />
);

const CloudShape5 = () => (
  <path d="M20 40C20 48.2843 26.7157 55 35 55H90C98.2843 55 105 48.2843 105 40C105 32.5 99.5 26.5 92.5 25.5C92.5 25.5 92.5 25.5 92.5 25.5C92.5 8.6553 78.8447 -5 62 -5C47.5 -5 35.5 5 32.5 18.5C17 19.5 5 32.5 5 40C5 48.2843 11.7157 55 20 55H20V40Z" />
);


const Cloud = ({
  top,
  scale = 1,
  opacity = 0.8,
  duration = 20,
  delay = 0,
  variant = 1
}: {
  top: string;
  scale?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  variant?: 1 | 2 | 3 | 4 | 5;
}) => {
  return (
    <motion.div
      initial={{ x: '-150px' }} // Start just off-screen left
      animate={{ x: '100vw' }} // Move to off-screen right
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay, // Negative delay to start mid-animation
        repeatType: "loop"
      }}
      style={{
        position: 'absolute',
        top,
        opacity,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        width={100 * scale}
        height={60 * scale}
        viewBox="0 0 100 60"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {variant === 1 && <CloudShape1 />}
        {variant === 2 && <CloudShape2 />}
        {variant === 3 && <CloudShape3 />}
        {variant === 4 && <CloudShape4 />}
        {variant === 5 && <CloudShape5 />}
      </svg>
    </motion.div>
  );
};

export const CloudBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: Slow, massive clouds in back */}
      <Cloud top="5%" scale={2.5} opacity={0.4} duration={60} delay={-10} variant={1} />
      <Cloud top="40%" scale={2.2} opacity={0.3} duration={70} delay={-45} variant={2} />
      <Cloud top="70%" scale={2.8} opacity={0.35} duration={65} delay={-20} variant={3} />
      <Cloud top="20%" scale={2.6} opacity={0.3} duration={68} delay={-55} variant={4} />

      {/* Layer 2: Medium-Large clouds */}
      <Cloud top="15%" scale={1.8} opacity={0.6} duration={45} delay={-5} variant={2} />
      <Cloud top="55%" scale={1.6} opacity={0.5} duration={50} delay={-30} variant={1} />
      <Cloud top="85%" scale={1.9} opacity={0.55} duration={48} delay={-15} variant={5} />
      <Cloud top="30%" scale={1.7} opacity={0.5} duration={52} delay={-40} variant={3} />

      {/* Layer 3: Regular clouds */}
      <Cloud top="25%" scale={1.2} opacity={0.7} duration={35} delay={-12} variant={3} />
      <Cloud top="65%" scale={1.3} opacity={0.65} duration={38} delay={-28} variant={4} />
      <Cloud top="10%" scale={1.4} opacity={0.7} duration={36} delay={-22} variant={5} />
      <Cloud top="95%" scale={1.2} opacity={0.6} duration={40} delay={-8} variant={2} />

      {/* Layer 4: Fast, small clouds in front */}
      <Cloud top="10%" scale={0.8} opacity={0.8} duration={25} delay={-18} variant={1} />
      <Cloud top="35%" scale={0.9} opacity={0.75} duration={28} delay={-5} variant={3} />
      <Cloud top="80%" scale={0.7} opacity={0.85} duration={30} delay={-25} variant={2} />
      <Cloud top="90%" scale={0.6} opacity={0.8} duration={22} delay={-10} variant={4} />
      <Cloud top="50%" scale={0.8} opacity={0.8} duration={26} delay={-20} variant={5} />

      {/* Extra filler clouds for density */}
      <Cloud top="20%" scale={1.4} opacity={0.5} duration={52} delay={-35} variant={1} />
      <Cloud top="50%" scale={1.1} opacity={0.6} duration={42} delay={-17} variant={2} />
      <Cloud top="5%" scale={1.0} opacity={0.5} duration={48} delay={-42} variant={4} />
      <Cloud top="75%" scale={1.3} opacity={0.55} duration={45} delay={-2} variant={5} />
    </div>
  );
};
