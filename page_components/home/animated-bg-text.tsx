"use client"

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
        <div
          key={word}
          className="absolute text-7xl md:text-9xl font-bold text-foreground/5 whitespace-nowrap uppercase tracking-tighter font-serif"
          style={{
            top: positions[index]?.top,
            left: positions[index]?.left,
          }}
        >
          {word}
        </div>
      ))}
    </div>
  )
}
