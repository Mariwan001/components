'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { useEffect, useState } from 'react'

interface RevealTextAnimationProps {
  text: string;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
}

const RevealTextAnimation: React.FC<RevealTextAnimationProps> = ({ 
  text, 
  className = '',
  minFontSize = 16, // minimum font size in pixels
  maxFontSize = 64  // maximum font size in pixels
}) => {
  const [fontSize, setFontSize] = useState(maxFontSize);
  const characters = Array.from(text);
  
  useEffect(() => {
    const handleResize = () => {
      // Calculate font size based on viewport width
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      
      // Responsive breakpoints
      const calculateFontSize = () => {
        if (vw < 480) { // Mobile
          return minFontSize + (vw / 480) * (maxFontSize - minFontSize);
        } else if (vw < 768) { // Tablet
          return minFontSize + (vw / 768) * (maxFontSize - minFontSize);
        } else if (vw < 1024) { // Laptop
          return minFontSize + (vw / 1024) * (maxFontSize - minFontSize);
        } else { // Desktop
          return maxFontSize;
        }
      };

      setFontSize(calculateFontSize());
    };

    // Initial calculation
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [minFontSize, maxFontSize]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  return (
    <motion.h1
      className={`${className} whitespace-normal break-words`}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: '1.2',
        textAlign: 'center',
        padding: '0.5rem',
        maxWidth: '100%',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {characters.map((char, index) => (
        <motion.span 
          key={`${char}-${index}`} 
          variants={item}
          style={{
            display: 'inline-block',
            whiteSpace: 'pre-wrap'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default RevealTextAnimation;
