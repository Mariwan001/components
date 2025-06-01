import React, { useEffect, useState } from 'react'

const TextRevealScroll = () => {
  const [scroll, setScroll] = useState(0)

  const speech = `Everything has own meanings in this universe. You are one the reasons to give the universe a purpose of having a meaning`

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScroll(scrollPosition)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className='min-h-[300vh]'> {/* Increased scroll space */}
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4'>
        <p className='text-white/50 md:text-3xl lg:text-4xl text-xl flex flex-wrap gap-[8px]'>
          {speech.split(' ').map((word, index) => (
            <span
              key={index}
              className='transition-all duration-300 ease-in-out'
              style={{
                opacity: scroll > index * 15 ? 1 : 0, 
                transform: `translateY(${scroll > index * 15 ? 0 :                        '20px'})`,
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </main>
  )
}

export default TextRevealScroll
