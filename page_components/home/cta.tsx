// components/cta-section.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section ref={ref} className="py-32 px-6 border-t border-[#3F3F46]">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[1.1] mb-8 text-[#FAFAFA]"
        >
          READY TO BUILD<br />YOUR FUTURE?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="group px-10 py-5 bg-[#DFE104] text-black font-bold text-lg uppercase tracking-wide hover:bg-[#DFE104]/90 transition-all duration-200">
            Apply Now
            <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 border border-[#3F3F46] text-[#FAFAFA] font-bold text-lg uppercase tracking-wide hover:border-[#DFE104] hover:text-[#DFE104] transition-all duration-200">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  )
}