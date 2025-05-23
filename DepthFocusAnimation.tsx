"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useInView, Variants, useMotionValue, useTransform } from 'framer-motion';

interface DepthFocusAnimationProps {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  perspective?: number;
  depthIntensity?: number;
  focusScale?: number;
  // New advanced props
  motionIntensity?: number;
  useParallax?: boolean;
  useScrollEffect?: boolean;
  enhancedPhysics?: boolean;
  textFragmentation?: 'none' | 'subtle' | 'medium' | 'high';
}

const DepthFocusAnimation: React.FC<DepthFocusAnimationProps> = ({
  text,
  className = '',
  delay = 0.2,
  staggerChildren = 0.03,
  perspective = 1000,
  depthIntensity = 30,
  focusScale = 1.05,
  // New advanced props with defaults
  motionIntensity = 1,
  useParallax = true,
  useScrollEffect = true,
  enhancedPhysics = true,
  textFragmentation = 'subtle',
}) => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  
  // Motion values for advanced animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  
  // Parallax effect values
  const parallaxX = useTransform(mouseX, [-1, 1], [-15 * motionIntensity, 15 * motionIntensity]);
  const parallaxY = useTransform(mouseY, [-1, 1], [-15 * motionIntensity, 15 * motionIntensity]);
  
  // Split text into words and then characters with memoization
  const words = useMemo(() => text.split(' '), [text]);
  
  // Calculate fragmentation offsets for each character
  const fragmentationOffsets = useMemo(() => {
    const offsets: {[key: string]: {x: number, y: number, rotation: number}} = {};
    
    if (textFragmentation === 'none') return offsets;
    
    const intensityMap = {
      'subtle': 0.5,
      'medium': 1,
      'high': 2
    };
    
    const intensity = intensityMap[textFragmentation] || 0.5;
    
    words.forEach((word, wordIndex) => {
      word.split('').forEach((_, charIndex) => {
        const index = `${wordIndex}-${charIndex}`;
        offsets[index] = {
          x: (Math.random() - 0.5) * 10 * intensity,
          y: (Math.random() - 0.5) * 10 * intensity,
          rotation: (Math.random() - 0.5) * 5 * intensity
        };
      });
    });
    
    return offsets;
  }, [words, textFragmentation]);
  
  // Handle viewport visibility
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView]);
  
  // Handle mouse movement for parallax and hover effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        
        setMousePosition({ x, y });
        mouseX.set(x);
        mouseY.set(y);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Handle scroll effects
  useEffect(() => {
    if (!useScrollEffect) return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollProgress.set(maxScroll ? window.scrollY / maxScroll : 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollProgress, useScrollEffect]);
  
  // Enhanced animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };
  
  const wordVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren / 2,
      },
    },
  };
  
  // Enhanced character variants with improved physics
  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      z: -depthIntensity,
      rotateX: 10,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      z: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: enhancedPhysics ? 8 : 12,
        stiffness: enhancedPhysics ? 120 : 100,
        mass: enhancedPhysics ? 0.8 : 1,
        velocity: enhancedPhysics ? 2 : 0,
      },
    },
  };
  
  // Get advanced transform for each character
  const getAdvancedTransform = (index: string, isHovered: boolean) => {
    const idx = parseInt(index);
    const offset = fragmentationOffsets[index] || { x: 0, y: 0, rotation: 0 };
    
    // Calculate scroll effect
    const scrollEffect = useScrollEffect 
      ? `translateY(${Math.sin(scrollY * 0.01 + idx * 0.1) * 5 * motionIntensity}px)` 
      : '';
    
    // Calculate parallax effect
    const parallaxEffect = useParallax 
      ? `translate(${parallaxX.get() * (idx % 5 + 1) * 0.2}px, ${parallaxY.get() * (idx % 3 + 1) * 0.2}px)` 
      : '';
    
    // Calculate hover effect
    const hoverEffect = `
      translateZ(${isHovered ? depthIntensity : 0}px)
      rotateX(${mousePosition.y * (isHovered ? 15 : 5) * motionIntensity}deg)
      rotateY(${mousePosition.x * (isHovered ? 15 : 5) * motionIntensity}deg)
    `;
    
    // Calculate fragmentation effect
    const fragmentEffect = textFragmentation !== 'none' 
      ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotation}deg)` 
      : '';
    
    return `${hoverEffect} ${parallaxEffect} ${scrollEffect} ${fragmentEffect}`;
  };
  
  // Get advanced filter for each character
  const getAdvancedFilter = (index: string, isHovered: boolean) => {
    const idx = parseInt(index);
    const baseBlur = isHovered ? 0 : Math.abs(mousePosition.x * mousePosition.y) * 2;
    
    // Add subtle depth-based blur variation
    const depthBlur = useParallax 
      ? (idx % 3) * 0.5 * (1 - Math.abs(mousePosition.x)) 
      : 0;
    
    return `blur(${baseBlur + depthBlur}px)`;
  };
  
  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ 
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex flex-wrap justify-center">
        {words.map((word, wordIndex) => (
          <motion.span 
            key={`word-${wordIndex}`}
            className="mr-2 mb-1 relative"
            variants={wordVariants}
            style={{ 
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              // Add subtle word-level transformations
              transform: useParallax 
                ? `translateX(${Math.sin(wordIndex * 0.5) * parallaxX.get() * 0.5}px)` 
                : '',
            }}
          >
            {word.split('').map((char, charIndex) => {
              const index = `${wordIndex}-${charIndex}`;
              const isHovered = hoveredIndex === parseInt(index);
              
              return (
                <motion.span
                  key={`char-${index}`}
                  variants={charVariants}
                  className="inline-block relative"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: getAdvancedTransform(index, isHovered),
                    filter: getAdvancedFilter(index, isHovered),
                    transition: 'transform 0.2s ease-out, filter 0.3s ease-out',
                  }}
                  whileHover={{
                    scale: focusScale,
                    z: depthIntensity,
                    filter: 'blur(0px)',
                    transition: {
                      type: 'spring',
                      stiffness: enhancedPhysics ? 400 : 300,
                      damping: enhancedPhysics ? 8 : 10,
                      mass: enhancedPhysics ? 0.6 : 1,
                    },
                  }}
                  whileTap={{
                    scale: focusScale * 0.9,
                    rotateZ: Math.random() * 10 - 5,
                    transition: {
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    },
                  }}
                  onHoverStart={() => setHoveredIndex(parseInt(index))}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default DepthFocusAnimation;


// //how to use ? 

//         text="FOCUS ON DEPTH AND DIMENSION WITH PROFESSIONAL MOTION" 
//         className="text-white text-center font-bold tracking-wider"
//         perspective={1200}
//         depthIntensity={50}
//         focusScale={1.08}
//         motionIntensity={1.2}
//         useParallax={true}
//         useScrollEffect={true}
//         enhancedPhysics={true}
//         textFragmentation="subtle"
