'use client'; 

import React from 'react'; 
import { motion, Variants } from 'framer-motion'; // 

// Define the types of inputs (props) this component accepts
interface TextAnimationProps {
  text: string; // The text to animate
  color?: string; // Optional color of the text
  fontSize?: string; // Optional font size
  fontWeight?: string; // Optional font weight
  delay?: number; // Optional delay before animation starts
  duration?: number; // Optional duration between each character animation
}

// Create the animated text component
const TextAnimation = ({
  text, // The actual text to animate
  color = 'white', // Default color is white
  fontSize, // Font size is optional
  fontWeight = 'bold', // Default font weight is bold
  delay = 0.2, // Default delay before animation starts
  duration = 0.05, // Default time between each letter animation
}: TextAnimationProps) => {

  const characters = Array.from(text); // Split the text into individual characters

  // Define animation behavior for the container of the letters
  const containerVariants: Variants = {
    hidden: {}, // Nothing happens in hidden state
    visible: {
      transition: {
        staggerChildren: duration, // Delay between each letter
        delayChildren: delay, // Wait before the animation starts
      },
    },
  };

  // Define how each letter appears
  const letterVariants: Variants = {
    hidden: { 
      opacity: 0, // Start invisible
      y: 50, // Start lower
      rotateX: -90, // Rotate backwards
      filter: 'blur(10px)', // Start blurry
    },
    visible: { 
      opacity: 1, // Fade in
      y: 0, // Move to original position
      rotateX: 0, // Face forward
      filter: 'blur(0px)', // No blur
      transition: { 
        type: 'spring', // Spring motion
        damping: 12, // Controls bounciness
        stiffness: 100, // Controls resistance
      },
    },
  };

  // Build class names dynamically based on props
  const classNames = [
    `text-${color}`, // Text color
    fontSize ? `text-${fontSize}` : '', // Font size if provided
    `font-${fontWeight}`, // Font weight
    'flex flex-wrap' // Allow letters to wrap and align properly
  ].filter(Boolean).join(' '); // Join all class strings together

  return (
    <motion.div
      className="overflow-hidden" // Hide overflow for smoother animation
      variants={containerVariants} // Apply animation behavior to container
      initial="hidden" // Start in hidden state
      animate="visible" // Animate to visible
    >
      <div className={classNames}>
        {characters.map((char, index) => (
          <motion.span
            key={index} // Unique key for each letter
            className="inline-block px-[1px]" // Space between letters
            variants={letterVariants} // Apply animation to each letter
            whileHover={{
              scale: 1.2, // Slightly enlarge when hovered
              color: '#ff9500', // Change color on hover
              transition: { duration: 0.2 }, // Smooth hover transition
            }}
          >
            {char === ' ' ? '\u00A0' : char} {/* Keep spaces visible */}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default TextAnimation; // Export the component to use it elsewhere


// How to use it within the file you wanna import it?

// <TextAnimation  text=` Your text' color=`pick a color` fontWeight=`choose a style`/> //
