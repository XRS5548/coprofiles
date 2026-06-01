// components/stats-counter.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Briefcase, GraduationCap, Building2 } from 'lucide-react'

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
  { icon: Building2, value: 5000, label: 'Companies', color: 'from-purple-400 to-purple-600' },
  { icon: Users, value: 50000, label: 'Active Students', color: 'from-blue-400 to-blue-600' },
  { icon: Briefcase, value: 25000, label: 'Jobs Posted', color: 'from-indigo-400 to-indigo-600' },
  { icon: GraduationCap, value: 100000, label: 'Exams Conducted', color: 'from-violet-400 to-violet-600' },
]

export function StatsCounter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
          className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform"
        >
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold gradient-text">
            <AnimatedNumber value={stat.value} />
          </div>
          <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}