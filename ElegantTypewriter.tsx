'use client';


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This defines the shape of props (parameters) the component accepts
interface ElegantTypewriterProps {
  phrases: string[];           // List of phrases to type out
  typingSpeed?: number;        // How fast to type (milliseconds per character)
  deleteSpeed?: number;        // How fast to delete (milliseconds per character)
  delayBetweenPhrases?: number; // How long to pause between phrases (milliseconds)
  cursorColor?: string;        // Color of the blinking cursor
  textColor?: string;          // Color of the text
  highlightColor?: string;     // Color when text is highlighted
  fontSize?: string;           // Size of the font
  fontWeight?: string;         // Weight of the font (bold, normal, etc.)
  className?: string;          // Additional CSS classes
  letterSpacing?: string;      // Space between letters
}

// Main component definition with default values for optional props
const ElegantTypewriter = ({
  phrases,
  typingSpeed = 60,            // Default: 60ms per character when typing
  deleteSpeed = 40,            // Default: 40ms per character when deleting (faster than typing)
  delayBetweenPhrases = 2000,  // Default: 2 seconds pause between phrases
  cursorColor = '#64ffda',     // Default: teal color for cursor
  textColor = '#ffffff',       // Default: white text
  highlightColor = '#64ffda',  // Default: teal highlight (same as cursor)
  fontSize = '6xl',            // Default: extra large font
  fontWeight = 'bold',         // Default: bold text
  className = '',              // Default: no extra classes
  letterSpacing = 'normal',    // Default: normal letter spacing
}: ElegantTypewriterProps) => {
  // State variables to track component status
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);  // Which phrase we're currently showing
  const [displayText, setDisplayText] = useState('');               // Current text being displayed
  const [isDeleting, setIsDeleting] = useState(false);              // Whether we're deleting or typing
  const [isHighlighted, setIsHighlighted] = useState(false);        // Whether text is highlighted
  const [isMounted, setIsMounted] = useState(false);                // Whether component has loaded
  const [isTransitioning, setIsTransitioning] = useState(false);    // Whether text is changing
  const previousTextLength = useRef(displayText.length);            // Remember previous text length for animation
  const containerRef = useRef<HTMLDivElement>(null);                // Reference to container element
  
  // Width of each character (in em units) for spacing calculations
  const charWidth = 0.55; 
  
  // When component loads, set isMounted to true
  useEffect(() => {
    setIsMounted(true);
    // When component unloads, set isMounted to false
    return () => setIsMounted(false);
  }, []);
  
  // Track when text length changes to animate transitions
  useEffect(() => {
    // Check if text length changed from previous
    setIsTransitioning(previousTextLength.current !== displayText.length);
    // Update our reference to current length
    previousTextLength.current = displayText.length;
  }, [displayText.length]);
  
  // Main typing animation logic
  useEffect(() => {
    // Don't do anything if component isn't mounted yet
    if (!isMounted) return;
    
    let timeout: NodeJS.Timeout;  // Variable to store our timing function
    const currentPhrase = phrases[currentPhraseIndex];  // Get the current phrase
    
    if (isDeleting) {
      // If we're deleting characters
      if (displayText.length > 0) {
        // If there's still text to delete
        timeout = setTimeout(() => {
          // Remove last character from displayed text
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // If all text is deleted
        setIsDeleting(false);
        timeout = setTimeout(() => {
          // Move to next phrase (loop back to first if needed)
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        }, delayBetweenPhrases / 2);
      }
    } else {
      // If we're typing characters
      if (displayText.length < currentPhrase.length) {
        // If we haven't typed the full phrase yet
        timeout = setTimeout(() => {
          // Add one more character to displayed text
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // If full phrase is typed
        timeout = setTimeout(() => {
          // Highlight the text
          setIsHighlighted(true);
          timeout = setTimeout(() => {
            // Then unhighlight and start deleting
            setIsHighlighted(false);
            setIsDeleting(true);
          }, delayBetweenPhrases / 2);
        }, delayBetweenPhrases);
      }
    }
    
    // Clean up by clearing timeout when component updates
    return () => clearTimeout(timeout);
  }, [currentPhraseIndex, displayText, isDeleting, isHighlighted, isMounted, phrases, typingSpeed, deleteSpeed, delayBetweenPhrases]);

  // Calculate maximum length of any phrase to keep container width consistent
  const maxLength = Math.max(...phrases.map(phrase => phrase.length));
  
  return (
    <div className="relative overflow-hidden px-2" ref={containerRef}>
      {/* Subtle background gradient that appears when text is highlighted */}
      <motion.div 
        className="absolute inset-0 opacity-0 rounded-lg"
        style={{
          background: `linear-gradient(90deg, transparent, ${cursorColor}05, transparent)`,
          backdropFilter: 'blur(8px)',
        }}
        animate={{
          opacity: isHighlighted ? 0.15 : 0,  // Show when highlighted, hide otherwise
          x: isHighlighted ? ['-100%', '100%'] : 0,  // Animate from left to right
        }}
        transition={{
          opacity: { duration: 0.4, ease: "easeInOut" },
          x: { duration: 1.2, ease: "easeInOut" }
        }}
      />
      
      {/* Main text container that holds all the characters */}
      <motion.div
        className={`py-1 inline-flex relative text-${fontSize} font-${fontWeight} tracking-${letterSpacing} leading-tight ${className}`}
        style={{ 
          color: textColor,
          minWidth: `${maxLength * charWidth}em`,  // Set width based on longest phrase
          filter: `drop-shadow(0 0 1px ${textColor}20)`,  // Subtle text shadow
        }}
        initial={{ opacity: 0 }}  // Start invisible
        animate={{ 
          opacity: isMounted ? 1 : 0,  // Fade in when mounted
          scale: isHighlighted ? [1, 1.005, 1] : 1,  // Subtle pulse when highlighted
          filter: isHighlighted 
            ? `drop-shadow(0 0 2px ${highlightColor}40)` 
            : `drop-shadow(0 0 1px ${textColor}20)`,  // Enhanced glow when highlighted
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          scale: { duration: 0.6, ease: "easeInOut" },
          filter: { duration: 0.4 }
        }}
      >
        <div className="relative z-10">
          <div className="relative">
            {/* Loop through each character and animate them individually */}
            {displayText.split('').map((char, index) => (
              <motion.span
                key={`${index}-${char}-${currentPhraseIndex}`}  // Unique key for React
                className="inline-block origin-center"  // Display as inline and set transform origin
                initial={false}
                animate={{ 
                  opacity: 1,
                  scale: isTransitioning && index === displayText.length - 1 && !isDeleting 
                    ? [1, 1.05, 1]  // Make last character pop when typing
                    : 1,
                  y: 0,
                  filter: `blur(0px) brightness(${isHighlighted && index % 2 ? 1.1 : 1})`,  // Alternate brightness when highlighted
                  color: isHighlighted ? highlightColor : textColor,  // Change color when highlighted
                  textShadow: isHighlighted 
                    ? `0 0 3px ${highlightColor}30`  // Add glow when highlighted
                    : 'none',
                }}
                transition={{ 
                  opacity: { duration: isDeleting ? 0.2 : 0.15, ease: "easeOut" },
                  scale: { 
                    duration: 0.25, 
                    ease: "backOut"
                  },
                  y: { 
                    duration: isDeleting ? 0.2 : 0.15,
                    ease: isDeleting ? "circOut" : "circOut" 
                  },
                  filter: { 
                    duration: 0.3,
                    ease: "easeInOut"
                  },
                  color: { 
                    duration: 0.4,
                    ease: "easeInOut"
                  },
                  textShadow: { 
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
              >
                {char === " " ? "\u00A0" : char}  {/* Use non-breaking space for spaces */}
              </motion.span>
            ))}

            {/* Ghost effect when characters are deleted */}
            <AnimatePresence mode="popLayout">
              {isDeleting && displayText.length > 0 && (
                <motion.span 
                  key={`ghost-${displayText.length}`}
                  className="inline-block absolute pointer-events-none"
                  style={{ 
                    left: `calc(${(displayText.length - 1) * charWidth}em)`,  // Position at last character
                    color: textColor,
                    opacity: 0.4,
                  }}
                  initial={{ 
                    opacity: 0.6, 
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  animate={{ 
                    opacity: 0,  // Fade out
                    y: [0, 8, 15],  // Float upward
                    x: [0, Math.random() > 0.5 ? 2 : -2, 0],  // Random left/right drift
                    scale: 0.92,  // Shrink slightly
                    filter: "blur(4px)",  // Blur as it fades
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut",
                    y: { 
                      duration: 0.4,
                      ease: "easeOut",
                      times: [0, 0.6, 1]
                    }
                  }}
                >
                  {displayText[displayText.length - 1] === " " ? "\u00A0" : displayText[displayText.length - 1]}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Preview animation for the next character before it appears */}
            <AnimatePresence mode="popLayout">
              {!isDeleting && displayText.length < phrases[currentPhraseIndex].length && (
                <motion.span 
                  key={`hint-${displayText.length}`}
                  className="inline-block absolute pointer-events-none"
                  style={{ 
                    left: `calc(${displayText.length * charWidth}em)`,  // Position where next char will appear
                    color: textColor,
                  }}
                  initial={{ 
                    opacity: 0, 
                    y: -12,  // Start above
                    filter: "blur(4px)",
                  }}
                  animate={{ 
                    opacity: [0, 0.15, 0],  // Fade in briefly then out
                    y: [-12, -4, 0],  // Move down into position
                    filter: ["blur(4px)", "blur(2px)", "blur(0px)"],  // Get clearer
                  }}
                  transition={{ 
                    duration: 0.25,
                    ease: "circOut",
                    times: [0, 0.7, 1]
                  }}
                >
                  {phrases[currentPhraseIndex][displayText.length] === " " ? 
                    "\u00A0" : phrases[currentPhraseIndex][displayText.length]}
                </motion.span>
              )}
            </AnimatePresence>
          
            {/* Blinking cursor that moves with the text */}
            <motion.div
              className="inline-flex items-center"
              animate={{
                x: isDeleting ? [-0.5, 0.5, -0.5, 0] : 0,  // Shake slightly when deleting
              }}
              transition={{ 
                x: { 
                  duration: 0.1, 
                  repeat: isDeleting ? Infinity : 0,  // Keep shaking while deleting
                  repeatType: "mirror", 
                  ease: "easeInOut" 
                }
              }}
            >
              <motion.span
                className="inline-block w-[1.5px] ml-1 rounded-full"
                style={{ 
                  backgroundColor: cursorColor,  // Color of cursor
                  height: "1em",  // Height matches text
                  boxShadow: `0 0 4px ${cursorColor}80`,  // Glow effect
                }}
                animate={{ 
                  opacity: [1, 0.3, 1],  // Fading blink effect
                  height: isHighlighted ? "1.1em" : "1em",  // Taller when highlighted
                  scaleY: isDeleting ? [1, 0.85, 1] : isHighlighted ? [1, 1.1, 1] : 1,  // Different animations based on state
                }}
                transition={{ 
                  opacity: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },  // Continuous blinking
                  height: { duration: 0.2, ease: "easeOut" },
                  scaleY: { 
                    duration: isDeleting ? 0.12 : 0.4, 
                    repeat: isDeleting ? Infinity : 0, 
                    repeatType: "mirror", 
                    ease: "easeInOut" 
                  }
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress bar that shows how much of the phrase is typed */}
      <motion.div 
        className="absolute left-0 right-0 bottom-0 h-[1px] origin-left"
        style={{ 
          backgroundImage: `linear-gradient(to right, ${cursorColor}99, ${cursorColor}50, ${cursorColor}10)`,  // Gradient
          backgroundSize: "200% 100%",
          boxShadow: `0 0 3px ${cursorColor}40`,  // Subtle glow
        }}
        initial={{ width: '0%', opacity: 0 }}
        animate={{ 
          width: isHighlighted ? '100%' : `${(displayText.length / phrases[currentPhraseIndex].length) * 100}%`,  // Width based on progress
          opacity: displayText.length > 0 ? 0.8 : 0,  // Only visible when text is showing
          backgroundPosition: isHighlighted ? ["0% 0%", "100% 0%"] : "0% 0%"  // Animate gradient when highlighted
        }}
        transition={{ 
          width: { 
            duration: isDeleting ? 0.08 : 0.15,  // Quicker transition when deleting
            ease: isDeleting ? "circIn" : "circOut" 
          },
          opacity: { duration: 0.3 },
          backgroundPosition: { duration: 1.2, ease: "easeInOut" }
        }}
      />
      
      {/* Subtle shimmer effect that moves across the text */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${cursorColor}08, transparent)`,  // Very subtle gradient
          opacity: 0,
        }}
        animate={{ 
          opacity: isDeleting ? 0.7 : 0.2,  // More visible when deleting
          x: ['100%', '-100%'],  // Move from right to left
        }}
        transition={{ 
          opacity: { duration: 0.3 },
          x: { 
            duration: isDeleting ? 1 : 2,  // Faster when deleting
            repeat: Infinity,  // Keep moving forever
            ease: "easeInOut",
          }
        }}
      />
      
      {/* Small decorative dot on left side */}
      <motion.div 
        className="absolute -left-2 top-1/2 w-[2px] h-[2px] transform -translate-y-1/2 rounded-full"
        style={{ 
          backgroundColor: cursorColor,
          boxShadow: `0 0 2px ${cursorColor}`,  // Glow
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isMounted ? [0.4, 0.7, 0.4] : 0,  // Pulse when mounted
          scale: isMounted ? 1 : 0,
        }}
        transition={{ 
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },  // Continuous pulse
          scale: { duration: 0.3, ease: "easeOut" }
        }}
      />
      
      {/* Small decorative dot on right side */}
      <motion.div 
        className="absolute -right-2 top-1/2 w-[2px] h-[2px] transform -translate-y-1/2 rounded-full"
        style={{ 
          backgroundColor: cursorColor,
          boxShadow: `0 0 2px ${cursorColor}`,  // Glow
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isMounted ? [0.4, 0.2, 0.4] : 0,  // Pulse when mounted
          scale: isMounted ? 1 : 0,
        }}
        transition={{ 
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 },  // Pulse out of sync with left dot
          scale: { duration: 0.3, ease: "easeOut", delay: 0.2 }
        }}
      />
    </div>
  );
};

export default ElegantTypewriter;  
