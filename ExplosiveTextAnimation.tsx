'use client'

import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ExplosiveTextAnimationProps {
  text: string;
  className?: string;
}

const ExplosiveTextAnimation: React.FC<ExplosiveTextAnimationProps> = ({ 
  text, 
  className = '' 
}) => {
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Generate random position for particles
  const getRandomPosition = () => {
    return {
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      rotate: Math.random() * 720 - 360
    };
  };
  
  // Generate random bright color
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
  };
  
  // Create particles for explosion effect
  const createParticles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        initial={{ scale: 0 }}
        animate={{
          ...getRandomPosition(),
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
          borderRadius: '50%',
          backgroundColor: getRandomColor(),
          boxShadow: `0 0 10px ${getRandomColor()}`
        }}
      />
    ));
  };

  return (
    <div 
      className={`${className} relative cursor-pointer`}
      onClick={() => setIsExploded(!isExploded)}
    >
      <div className="relative inline-block">
        {text.split('').map((char, index) => {
          const isHovered = hoveredIndex === index;
          
          return (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: 1,
                scale: isHovered ? 1.5 : 1,
                rotate: isExploded ? Math.random() * 360 - 180 : 0,
                x: isExploded ? Math.random() * 100 - 50 : 0,
                y: isExploded ? Math.random() * 100 - 50 : 0,
                color: isHovered || isExploded ? getRandomColor() : 'white'
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
                delay: index * 0.05,
              }}
              style={{
                display: 'inline-block',
                position: 'relative',
                margin: '0 1px',
                fontWeight: 'bold',
                textShadow: isHovered || isExploded ? `0 0 10px ${getRandomColor()}` : 'none',
                transformOrigin: 'center',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileTap={{
                scale: 0.8,
                rotate: 360,
                transition: { duration: 0.2 }
              }}
            >
              {char === ' ' ? '\u00A0' : char}
              {(isHovered || isExploded) && createParticles(5)}
            </motion.span>
          );
        })}
      </div>
      
      {isExploded && (
        <div className="absolute inset-0 pointer-events-none">
          {createParticles(50)}
        </div>
      )}
      
      <motion.div 
        className="mt-4 text-center text-sm opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Click text to explode! Hover over characters for effects!
      </motion.div>
    </div>
  );
};

export default ExplosiveTextAnimation;
