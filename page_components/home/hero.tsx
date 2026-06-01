// components/hero.tsx
"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { AnimatedBgText } from "./animated-bg-text"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBgText />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[clamp(4rem,10vw,12rem)] font-bold leading-[0.9] tracking-tighter mb-6 text-[#FAFAFA]"
        >
          BUILD.<br />
          LEARN.<br />
          GET HIRED.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-[#A1A1AA] text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          The Official Internship & Hiring Platform of SQROCK IT Solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="group px-8 py-4 bg-[#DFE104] text-black font-medium text-base uppercase tracking-wide hover:bg-[#DFE104]/90 transition-all duration-200">
            Apply For Internship
            <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border border-[#3F3F46] text-[#FAFAFA] font-medium text-base uppercase tracking-wide hover:border-[#DFE104] hover:text-[#DFE104] transition-all duration-200">
            Explore Opportunities
          </button>
        </motion.div>
      </div>
    </section>
  )
}