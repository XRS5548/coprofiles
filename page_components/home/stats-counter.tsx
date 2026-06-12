"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Briefcase, GraduationCap, Building2 } from "lucide-react"

function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [value, duration, isInView])

  return <span ref={ref}>{count.toLocaleString()}+</span>
}

const stats = [
  { icon: Building2, value: 5000, label: "Companies" },
  { icon: Users, value: 50000, label: "Active Students" },
  { icon: Briefcase, value: 25000, label: "Jobs Posted" },
  { icon: GraduationCap, value: 100000, label: "Exams Conducted" },
]

export function StatsCounter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="border-2 border-foreground p-6 text-center group hover:bg-foreground hover:text-background transition-colors duration-100"
        >
          <stat.icon size={24} className="text-foreground group-hover:text-background transition-colors duration-100 mx-auto mb-4" />
          <div className="font-serif text-3xl font-bold text-foreground group-hover:text-background transition-colors duration-100">
            <AnimatedNumber value={stat.value} />
          </div>
          <div className="font-mono text-xs text-muted-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest mt-2">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
