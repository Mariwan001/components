'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, stagger } from 'framer-motion'
import {
  FaLightbulb,
  FaRocket,
  FaCogs,
  FaGlobe,
  FaChartLine,
  FaSyncAlt,
  FaShieldAlt,
} from 'react-icons/fa'

const CardFocus = () => {
  const [isClient, setIsClient] = useState(false)
  const [width, setWidth] = useState<number | null>(null)
  const [clickFocusScreenImage, setClickFocusScreenImage] = useState(false)
  const [textAnimationLargeScreen, setTextAnimationLargeScreen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const listItems = [
    {
      icon: <FaLightbulb className="mt-1 text-indigo-500" />,
      text: 'Innovative ideas spark when you step outside the usual boundaries.',
    },
    {
      icon: <FaRocket className="mt-1 text-indigo-500" />,
      text: 'Momentum builds through steady progress and fearless experimentation.',
    },
    {
      icon: <FaCogs className="mt-1 text-indigo-500" />,
      text: 'Every small detail contributes to the bigger masterpiece.',
    },
    {
      icon: <FaGlobe className="mt-1 text-indigo-500" />,
      text: 'Collaboration connects diverse minds to amplify creativity.',
    },
    {
      icon: <FaChartLine className="mt-1 text-indigo-500" />,
      text: 'Growth emerges when challenges are embraced.',
    },
    {
      icon: <FaSyncAlt className="mt-1 text-indigo-500" />,
      text: 'Continuous learning fuels innovation and adaptability.',
    },
    {
      icon: <FaShieldAlt className="mt-1 text-indigo-500" />,
      text: 'Integrity builds trust and lasting relationships.',
    },
  ]

  const isLargeScreen = isClient && width !== null && width >= 1024
  const isTabletOrMobile = isClient && width !== null && width < 1024

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(15px)',
      y: 10,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 2,
        ease: 'easeOut',
      },
    },
  }

  const overlayTextVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  }

  return (
    <div className="p-1 border-2 border-neutral-600/65 rounded-lg inline-block max-w-full">
      <div className="bg-white rounded-md overflow-hidden flex flex-col h-[35rem] w-[26rem] lg:flex-row lg:w-[70rem] lg:h-[35rem]">
        {/* Left: Image */}
        <div className="relative w-full h-1/2 lg:w-1/2 lg:h-full">
          {isTabletOrMobile ? (
            <motion.div
              className={`relative w-full h-full cursor-pointer ${
                clickFocusScreenImage ? 'fixed inset-0 z-50' : ''
              }`}
              animate={{
                height: clickFocusScreenImage ? '100vh' : '100%',
                width: clickFocusScreenImage ? '100vw' : '100%',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onClick={() => setClickFocusScreenImage(!clickFocusScreenImage)}
            >
              <Image
                src="/mariwan.jpg"
                alt="now"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-md lg:rounded-l-md lg:rounded-tr-none"
                priority
              />

              {clickFocusScreenImage && (
                <>
                  {/* Blur Overlay - Only bottom half */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 via-black/20 to-transparent backdrop-blur-[2px]" />

                  {/* Text Container - Adjusted position */}
                  <motion.div
                    className="absolute bottom-[23%] left-1 max-w-[400px] p-4"
                    initial="hidden"
                    animate="visible"
                    variants={overlayTextVariants}
                  >
                    <h2 className="text-3xl font-bold mb-3 text-white [text-shadow:_0_1px_20px_rgb(0_0_0_/_40%)]">
                      Creative Vision
                    </h2>
                    <p className="text-base font-medium leading-relaxed text-white/90 [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)]">
                      Exploring the boundaries of imagination and reality through the lens of
                      innovation
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          ) : (
            <Image
              src="/mariwan.jpg"
              alt="now"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-md lg:rounded-l-md lg:rounded-tr-none"
              priority
            />
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[2px] bg-neutral-300"></div>

        <div className="flex flex-col justify-between p-6 w-full h-1/2 lg:w-[calc(50%-2px)] lg:h-full overflow-hidden">
          {/* Buttons top center on mobile & iPad */}
          {isTabletOrMobile && (
            <div className="flex justify-center gap-5 mb-5 lg:hidden">
              <button className="h-[45px] w-[130px] rounded-lg bg-blue-700 text-white font-bold text-lg shadow-[inset_0_-4px_0_rgba(0,0,0,0.2),0_4px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] transition-all duration-150">
                Hey
              </button>
              <button className="h-[45px] w-[130px] rounded-lg bg-black text-white font-bold text-lg shadow-[inset_0_-4px_0_rgba(255,255,255,0.05),0_4px_0_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] transition-all duration-150">
                Read
              </button>
            </div>
          )}

          {/* Text and List */}
          <div className="lg:h-full lg:relative">
            {isLargeScreen && (
              <>
                <motion.p
                  className="text-2xl font-semibold mb-8 text-center"
                  initial="hidden"
                  animate="visible"
                  transition={{
                    staggerChildren: 0.15,
                    delayChildren: 0.2,
                  }}
                >
                  {['Integrity', 'builds', 'trust', 'and', 'lasting', 'relationships'].map(
                    (word, i) => (
                      <motion.span
                        key={i}
                        variants={wordVariants}
                        className="inline-block mr-[0.25em] bg-gradient-to-bl from-stone-900 via-zinc-500 to-neutral-100 bg-clip-text text-transparent"
                      >
                        {word}
                      </motion.span>
                    )
                  )}
                </motion.p>

                <ul className="mt-5 space-y-6 text-sm md:text-base">
                  {listItems.map((item, index) => {
                    // Remove this condition since we want to show all items
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.25 + 0.8,
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                        className="flex items-start gap-3 text-gray-800 cursor-default"
                      >
                        {item.icon}
                        <span className="max-w-[90%] sm:max-w-full">{item.text}</span>
                      </motion.li>
                    )
                  })}
                </ul>
              </>
            )}

            {/* Mobile and Tablet Specific Rendering */}
            {isTabletOrMobile && (
              <ul className="mt-5 space-y-6 text-sm md:text-base">
                {listItems.slice(0, 3).map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.25 + 0.8,
                      duration: 0.6,
                      ease: 'easeOut',
                    }}
                    className="flex items-start gap-3 text-gray-800 cursor-default"
                  >
                    {item.icon}
                    <span className="max-w-[90%] sm:max-w-full">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Buttons container with absolute positioning */}
            {isLargeScreen && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 flex justify-center gap-5 mt-6 bg-white pb-6"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
              >
                <button className="h-[45px] w-[130px] rounded-lg bg-blue-700 text-white font-bold text-lg shadow-[inset_0_-4px_0_rgba(0,0,0,0.2),0_4px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] transition-all duration-150">
                  Hey
                </button>
                <button className="h-[45px] w-[130px] rounded-lg bg-black text-white font-bold text-lg shadow-[inset_0_-4px_0_rgba(255,255,255,0.05),0_4px_0_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] transition-all duration-150">
                  Read
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardFocus
