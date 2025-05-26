'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VerticalCutRevealProps {
  children: string;
  splitBy?: "words" | "characters" | "lines" | "string";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random";
  reverse?: boolean;
  transition?: any;
  delimiter?: string;
}

const VerticalCutReveal = ({
  children,
  splitBy = "characters",
  staggerDuration = 0.025,
  staggerFrom = "first",
  reverse = false,
  transition = {
    type: "spring",
    stiffness: 200,
    damping: 21,
  },
  delimiter = " "
}: VerticalCutRevealProps) => {
  const [randomDelays, setRandomDelays] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  const splitText = (text: string, method: string): string[] => {
    switch (method) {
      case "words":
        return text.split(" ");
      case "characters":
        return text.split("");
      case "lines":
        return text.split("\n");
      case "string":
        return text.split(delimiter);
      default:
        return text.split("");
    }
  };

  const textPieces = splitText(children, splitBy);

  useEffect(() => {
    setIsClient(true);
    if (staggerFrom === "random") {
      const delays = textPieces.map(() => Math.random() * staggerDuration * textPieces.length);
      setRandomDelays(delays);
    }
  }, [children, staggerFrom, staggerDuration, textPieces.length]);

  const getStaggerDelay = (index: number, total: number): number => {
    const baseDelay = transition.delay || 0;
    
    switch (staggerFrom) {
      case "first":
        return baseDelay + (index * staggerDuration);
      case "last":
        return baseDelay + ((total - 1 - index) * staggerDuration);
      case "center":
        const center = Math.floor(total / 2);
        const distance = Math.abs(index - center);
        return baseDelay + (distance * staggerDuration);
      case "random":
        return baseDelay + (randomDelays[index] || 0);
      default:
        return baseDelay + (index * staggerDuration);
    }
  };

  // Prevent hydration mismatch by not rendering animation until client-side
  if (!isClient) {
    return <span className="inline-block">{children}</span>;
  }

  return (
    <span className="inline-block">
      {textPieces.map((piece, index) => (
        <span
          key={index}
          className="relative inline-block overflow-hidden"
          style={{ 
            whiteSpace: splitBy === "words" ? "nowrap" : "normal",
            marginRight: splitBy === "words" && piece !== "" ? "0.25em" : "0"
          }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: reverse ? -100 : 100 }}
            animate={{ y: 0 }}
            transition={{
              ...transition,
              delay: getStaggerDelay(index, textPieces.length)
            }}
          >
            {piece === " " ? "\u00A0" : piece}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const VerticalTextReveal = () => {
  return (
    <div className="w-screen h-screen text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl flex flex-col items-start justify-center font-sans p-10 md:p-16 lg:p-24 text-neutral-500 tracking-wide uppercase bg-white">
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="first"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
        }}
      >
        {`I'm Mariwan`}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="last"
        reverse={true}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 0.5,
        }}
      >
        {`a software engineer`}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="center"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 1.1,
        }}
      >
        {`this is my component.`}
      </VerticalCutReveal>
    </div>
  );
};

export default VerticalTextReveal;
