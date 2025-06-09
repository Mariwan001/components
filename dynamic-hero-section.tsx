"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Star } from "lucide-react"

interface FloatingElementProps {
  delay?: number
  duration?: number
  children: React.ReactNode
  className?: string
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  delay = 0, 
  duration = 3, 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, opacity: 0.6 }}
      animate={{ 
        y: [-10, 10, -10],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10 
        rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        hover:bg-white/10 transition-all duration-500
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

interface TypewriterTextProps {
  text: string
  delay?: number
  speed?: number
  className?: string
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = "" 
}) => {
  const [displayText, setDisplayText] = React.useState("")
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay, speed])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-white/80 ml-1"
      />
    </span>
  )
}

const HyperIronicHero: React.FC = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const ironicPhrases = [
    "Effortlessly Complex",
    "Seriously Playful", 
    "Minimally Maximal",
    "Perfectly Imperfect"
  ]

  const [currentPhrase, setCurrentPhrase] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % ironicPhrases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900">
      {/* Ultra-smooth animated background */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-slate-800/20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Glass-like texture overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Dynamic mouse-following glow */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating geometric elements */}
        <FloatingElement delay={0} duration={4} className="absolute top-20 left-20">
          <div className="w-2 h-2 bg-white/20 rounded-full" />
        </FloatingElement>
        <FloatingElement delay={1} duration={5} className="absolute top-40 right-32">
          <div className="w-1 h-8 bg-white/10 rounded-full rotate-45" />
        </FloatingElement>
        <FloatingElement delay={2} duration={3.5} className="absolute bottom-32 left-1/4">
          <div className="w-3 h-3 border border-white/20 rounded-full" />
        </FloatingElement>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        
        {/* Ironic badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <GlassCard className="px-6 py-3 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80 font-light tracking-wide">
              Hyper-Ironically Advanced
            </span>
          </GlassCard>
        </motion.div>

        {/* Main headline with kinetic typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-thin tracking-tighter text-white/90 leading-none">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Ultra
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Smooth
            </motion.span>
          </h1>
        </motion.div>

        {/* Rotating ironic phrases */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mb-8 h-16 flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPhrase}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl md:text-3xl text-white/60 font-light tracking-wide"
            >
              {ironicPhrases[currentPhrase]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Subtitle with typewriter effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed">
            <TypewriterText 
              text="Where digital dreams meet glass-like reality in a symphony of contradictory perfection"
              delay={1500}
              speed={30}
            />
          </p>
        </motion.div>

        {/* CTA buttons with advanced interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button
              size="lg"
              className="
                relative overflow-hidden px-8 py-4 text-lg font-light
                bg-white/10 hover:bg-white/20 text-white border border-white/20
                backdrop-blur-xl transition-all duration-500
                group
              "
            >
              <span className="relative z-10 flex items-center gap-2">
                Experience Perfection
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
              
              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="
                px-8 py-4 text-lg font-light
                border-white/30 text-white/80 hover:text-white
                hover:border-white/50 transition-all duration-500
                backdrop-blur-xl bg-transparent hover:bg-white/5
              "
            >
              <Zap className="w-5 h-5 mr-2" />
              Embrace Irony
            </Button>
          </motion.div>
        </motion.div>

        {/* Bottom floating cards */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <GlassCard delay={2} className="p-4 max-w-xs hidden lg:block">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-white/60" />
              <span className="text-white/80 font-light">Effortless Complexity</span>
            </div>
            <p className="text-sm text-white/50 font-light">
              Where simplicity meets sophistication in perfect contradiction
            </p>
          </GlassCard>

          <GlassCard delay={2.2} className="p-4 max-w-xs hidden lg:block">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-white/60" />
              <span className="text-white/80 font-light">Glass Dreams</span>
            </div>
            <p className="text-sm text-white/50 font-light">
              Transparent intentions with crystalline execution
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingElement
          key={i}
          delay={i * 0.2}
          duration={3 + (i % 3)}
          className={`
            absolute w-1 h-1 bg-white/20 rounded-full
            ${i % 4 === 0 ? 'top-1/4 left-1/4' : ''}
            ${i % 4 === 1 ? 'top-3/4 right-1/4' : ''}
            ${i % 4 === 2 ? 'top-1/2 left-1/3' : ''}
            ${i % 4 === 3 ? 'bottom-1/3 right-1/3' : ''}
          `}
        >
          <div className="w-full h-full bg-white/20 rounded-full" />
        </FloatingElement>
      ))}
    </section>
  )
}

export default function HyperIronicHeroDemo() {
  return <HyperIronicHero />
}
