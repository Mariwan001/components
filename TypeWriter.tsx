'use client'

import {useState, useEffect, useRef} from 'react';
import {motion, Variants} from 'framer-motion';

interface TypeWriterProp {
  text: string | string[]; // Text or list of texts to show and animate.
  speed?: number; // Typing speed in milliseconds.
  initialDelay?: number; // Start animation after a specific delay.
  waitTime: number; // do not delete till the specific amount
  loop: boolean; // no stop {true} | stop {false}
  deleteSpeed: number; // Delete speed in milliseconds for each letter and word.
  className?: string; // you can customized by using CSS classes
  showCursor?: boolean; // show cursor {true} | if not {false}
  hideCursorOnType?: boolean; // while typing show cursor {true} | do not show {false}
  cursorChar?: string | React.ReactNode; // Character or symbol can be used as cursor.
  cursorClassName?: string; // Additional CSS classes for cursor styling. 
  cursorAnimationVariants?: { // framer-motion has been using fot this
        initial: Variants["initial"];
        animate: Variants["animate"]
    };
}


// having default values for each Props
export default function TypeWrite({
    text,
    speed = 50,
    initialDelay = 0,
    waitTime = 2000,
    loop = true,
    deleteSpeed = 30,
    className = '',
    showCursor = true,
    hideCursorOnType = false,
    cursorChar = '|',
    cursorClassName = 'ml-1',
    cursorAnimationVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.01,
                repeat: Infinity,
                repeatDelay: 0.4,
                repeatType: "mirror"
            }
        }
    }
}: TypeWriteProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Convert single string to array
    const textArray = Array.isArray(text) ? text : [text];

    useEffect(() => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Initial delay
        const startTyping = () => {
            timeoutRef.current = setTimeout(() => {
                setIsTyping(true);
            }, initialDelay);
        };

        startTyping();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [initialDelay]);

    useEffect(() => {
        if (!isTyping) return;

        const currentText = textArray[textIndex];

        if (isDeleting) {
            if (displayedText.length > 0) {
                // Delete one character
                timeoutRef.current = setTimeout(() => {
                    setDisplayedText(prev => prev.slice(0, -1));
                }, deleteSpeed);
            } else {
                // Move to next text
                setIsDeleting(false);
                setTextIndex(prevIndex =>
                    loop ? (prevIndex + 1) % textArray.length :
                    prevIndex < textArray.length - 1 ? prevIndex + 1 : prevIndex
                );
            }
        } else {
            if (displayedText.length < currentText.length) {
                // Type one character
                timeoutRef.current = setTimeout(() => {
                    setDisplayedText(prev => currentText.slice(0, prev.length + 1));
                }, speed);
            } else {
                // Wait before deleting
                timeoutRef.current = setTimeout(() => {
                    if (textArray.length > 1 || loop) {
                        setIsDeleting(true);
                    }
                }, waitTime);
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [displayedText, isDeleting, textIndex, textArray, speed, deleteSpeed, waitTime, loop, isTyping]);
    return (
        <span className={className}>
            {displayedText}
            {showCursor && (!hideCursorOnType || !isTyping) && (
                <motion.span
                    className={cursorClassName}
                    initial="initial"
                    animate="animate"
                    variants={cursorAnimationVariants}
                >
                    {cursorChar}
                </motion.span>
            )}
        </span>
    );
}


// how to use it ?
  const textArray = [
    "Developer",
    "Designer",
    "Creator",
    "Problem Solver",
    "Innovator"
  ];

<span>I am</span>
<TypeWrite 
  text={textArray}
  speed={70}
  deleteSpeed={45}
  waitTime={130}
  loop={true}
  />
