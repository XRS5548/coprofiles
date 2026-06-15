 "use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section
      ref={ref}
      className="relative bg-black overflow-hidden border-t border-[#CD7F32]/10"
    >
      {/* Gold Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-40 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[1.1] mb-8 text-white"
        >
          Ready to Build
          <br />
          <span className="text-[#CD7F32]">Your Future?</span>
        </motion.h2>

        {/* Line */}
        <div className="w-20 h-[1px] bg-[#CD7F32]/50 mx-auto mb-10" />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >

          {/* Primary Button */}
          <Link
            href="/register"
            className="group px-10 py-5 bg-[#CD7F32] text-black font-semibold text-sm uppercase tracking-[0.2em] hover:bg-[#D89247] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>

          {/* Secondary Button */}
          <Link
            href="/contact"
            className="px-10 py-5 border border-[#CD7F32]/30 text-[#CD7F32] font-medium text-sm uppercase tracking-[0.2em] hover:bg-[#CD7F32] hover:text-black transition-all duration-300"
          >
            Contact Us
          </Link>

        </motion.div>
      </div>
    </section>
  )
}