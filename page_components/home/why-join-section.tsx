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
    <section id="about" className="py-32 px-6 bg-background" ref={ref}>
      {/* Thick rule */}
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Why Choose Us
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Why Join SQROCK
          </h2>
          <div className="w-16 h-px bg-foreground mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.number}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-l-2 border-foreground pl-6"
            >
              <div className="font-serif text-8xl md:text-9xl font-bold text-foreground/10 leading-none mb-4">
                {reason.number}
              </div>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground mb-3">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-serif">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
