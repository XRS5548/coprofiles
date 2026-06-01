// components/animated-bg-text.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const words = ["DEVELOPERS", "INTERNS", "ENGINEERS", "DESIGNERS", "SQROCK"]

export function AnimatedBgText() {
  const [positions, setPositions] = useState<Array<{ top: string; left: string }>>([])

  useEffect(() => {
    const generatePositions = () => {
      return words.map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }))
    }
    setPositions(generatePositions())
  }, [])

  if (positions.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {words.map((word, index) => (
        <motion.div
          key={word}
          className="absolute text-7xl md:text-9xl font-bold text-white/5 whitespace-nowrap uppercase tracking-tighter"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: index * 2,
          }}
          style={{
            top: positions[index]?.top,
            left: positions[index]?.left,
          }}
        >
          {word}
        </motion.div>
      ))}
    </div>
  )
}