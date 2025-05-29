'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'

const AllFaqs = [
  {
    question: "What is the purpose of this FAQ section?",
    answer: "This section provides answers to common questions about our services and features."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team via email at support@example.com."
  },
  {
    question: "Where can I find the user manual?",
    answer: "The user manual is available for download on our website under the 'Resources' section."
  }
]

// Variants for the parent container to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.8, // Start staggering after H1 animation (0.8s duration)
      staggerChildren: 0.2 // Delay between each child animation
    }
  }
};

// Variants for each individual FAQ item
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.4, ease: "easeOut" },
      y: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
      scale: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  }
};

// SVG path animation variants
const pathVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { 
        duration: 1.5, 
        ease: "easeInOut", 
        repeat: Infinity, 
        repeatType: "loop", 
        repeatDelay: 0 
      },
      opacity: { duration: 0.5, ease: "easeIn" }
    }
  }
};

const Faqs: React.FC = () => {
  const [showAnswer, setShowAnswer] = useState<number | false>(false);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleAnswer = (index: number) => {
    setShowAnswer(prev => prev === index ? false : index);
  }

  return (
    <div className='flex flex-col items-center min-h-screen py-10'>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Added motion and animation properties for blur-in effect */}
        <motion.h1
          className='text-center mb-6 sm:mb-8 md:mb-10 text-2xl sm:text-3xl lg:text-4xl'
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
        >
          That is a FAQ section
        </motion.h1>
        
        <motion.div 
          className=""
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {AllFaqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 overflow-hidden relative"
              variants={itemVariants}
              initial={{ 
                opacity: 0, 
                y: 20,
                boxShadow: "0 0 0 0px rgba(64, 64, 64, 0)" 
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                boxShadow: "0 0 0 1px rgba(64, 64, 64, 1)" 
              }}
              transition={{
                opacity: { duration: 0.4, ease: "easeOut" },
                y: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                boxShadow: { 
                  delay: 0.3, 
                  duration: 0.6, 
                  ease: "easeOut" 
                }
              }}
              ref={el => {
                itemRefs.current[index] = el;
              }}
            >
              {/* Animated border line */}
              {showAnswer === index && (
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  style={{ zIndex: 10 }}
                >
                  <motion.rect 
                    x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    rx="16" 
                    ry="16"
                    fill="none" 
                    stroke="rgba(64, 64, 64, 1)" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial="hidden"
                    animate="visible"
                    variants={pathVariants}
                    style={{ 
                      filter: "drop-shadow(0 0 2px rgba(64, 64, 64, 0.5))"
                    }}
                  />
                </svg>
              )}
              <div className="flex justify-between items-start sm:items-center">
                <p className="text-lg sm:text-xl">{faq.question}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border p-2 sm:p-3 rounded-3xl ml-4 sm:ml-6 flex-shrink-0"
                  style={{
                    backgroundColor: showAnswer === index ? 'black' : 'white',
                    color: showAnswer === index ? 'white' : 'black'
                  }}
                  onClick={() => toggleAnswer(index)}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <AnimatePresence mode="wait">
                    {showAnswer === index ? (
                      <motion.div
                        key="minus"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="plus"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              
              <AnimatePresence mode="sync">
                {showAnswer === index && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      filter: 'blur(15px)',
                      transformOrigin: "top center",
                      scale: 0.9,
                      y: -20
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      filter: 'blur(0px)',
                      scale: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      filter: 'blur(15px)',
                      scale: 0.9,
                      y: -20,
                      transition: {
                        opacity: { duration: 0.25, ease: "easeInOut" },
                        height: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
                        filter: { duration: 0.25, ease: "easeInOut" },
                        scale: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
                      }
                    }}
                    transition={{
                      opacity: { duration: 0.6, ease: "easeOut" },
                      height: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                      filter: { duration: 0.7, ease: "easeOut" },
                      scale: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                      y: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
                    }}
                    key={`answer-${index}`}
                    className="text-sm sm:text-base text-neutral-600 overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                      className="mt-3 sm:mt-4 pt-2 border-t border-neutral-200"
                    >
                      {faq.answer}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Faqs
