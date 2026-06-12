"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section ref={ref} className="relative bg-foreground text-background overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-texture-lines-inverted pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-40 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="font-serif text-5xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[1.1] mb-8"
        >
          Ready to Build
          <br />
          Your Future?
        </motion.h2>

        <div className="w-16 h-px bg-background/40 mx-auto mb-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="group px-10 py-5 bg-background text-foreground font-mono text-sm uppercase tracking-widest hover:bg-transparent hover:text-background hover:outline hover:outline-2 hover:outline-background transition-none duration-0">
            Apply Now
            <ArrowRight className="inline ml-2 w-5 h-5" />
          </button>
          <button className="px-10 py-5 border-2 border-background text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-none duration-0">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  )
}
