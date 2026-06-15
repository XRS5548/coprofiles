"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section ref={ref} className="relative bg-luxury-bg overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-texture-noise pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 py-40 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-serif text-5xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[1.1] mb-8 text-white"
        >
          Ready to Build
          <br />
          <span className="text-white/40">Your Future?</span>
        </motion.h2>

        <div className="w-16 h-px bg-gold/50 mx-auto mb-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/register"
            className="group px-10 py-5 bg-white text-luxury-bg font-sans text-sm uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-500"
          >
            Apply Now
            <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/contact"
            className="px-10 py-5 border border-white/20 text-white/80 font-sans text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-luxury-bg transition-all duration-500"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
