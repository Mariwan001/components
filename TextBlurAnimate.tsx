"use client"

import { FC, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface TextBlurAnimateProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  duration?: number
}

const TextBlurAnimate: FC<TextBlurAnimateProps> = ({
  text,
  className = "",
  delay = 0.3,
  staggerDelay = 0.08,
  duration = 1.2,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const words = text.split(" ")

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
          animate={isInView ? { 
            opacity: 1, 
            filter: "blur(0px)",
            scale: 1
          } : {}}
          transition={{
            duration: duration,
            delay: delay + index * staggerDelay,
            ease: [0.1, 0.8, 0.2, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export { TextBlurAnimate } 




//how to use ?

//<TextBlur text='paste your text here' delay={"type a number "} duration={"type a number"} staggerDelay={"id does control the time gap between each word's animation start."}/>
