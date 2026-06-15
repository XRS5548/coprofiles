"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const reasons = [
  { number: "01", title: "Real Projects", description: "Work on production-ready applications used by real clients and users." },
  { number: "02", title: "Certification", description: "Earn industry-recognized certificates upon successful completion." },
  { number: "03", title: "Mentorship", description: "Learn from senior engineers and industry experts 1-on-1." },
  { number: "04", title: "Placement", description: "Top performers get direct job offers from SQROCK." },
]

export function WhyJoinSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="about" className="py-32 px-6 bg-[#050505]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans">Why Choose Us</span>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-white mt-4">
            Why Join SQROCK
          </h2>
          <div className="w-16 h-px bg-gold/50 mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.number}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="border-l border-white/10 pl-6 hover:border-gold/50 transition-colors duration-500"
            >
              <div className="font-serif text-8xl md:text-9xl font-bold text-white/[0.04] leading-none mb-4">
                {reason.number}
              </div>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-white/40 text-base leading-relaxed font-sans">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
