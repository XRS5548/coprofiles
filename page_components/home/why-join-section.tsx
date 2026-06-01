// components/why-join-section.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const reasons = [
  { number: "01", title: "REAL PROJECTS", description: "Work on production-ready applications used by real clients and users." },
  { number: "02", title: "CERTIFICATION", description: "Earn industry-recognized certificates upon successful completion." },
  { number: "03", title: "MENTORSHIP", description: "Learn from senior engineers and industry experts 1-on-1." },
  { number: "04", title: "PLACEMENT OPPORTUNITIES", description: "Top performers get direct job offers from SQROCK." },
]

export function WhyJoinSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="about" className="py-24 px-6 border-t border-[#3F3F46]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-[#FAFAFA]">
            Why Join SQROCK
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.number}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-l-2 border-[#DFE104] pl-6"
            >
              <div className="text-8xl md:text-9xl font-bold text-[#DFE104]/30 leading-none mb-4">
                {reason.number}
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-tight mb-3 text-[#FAFAFA]">
                {reason.title}
              </h3>
              <p className="text-[#A1A1AA] text-base leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}