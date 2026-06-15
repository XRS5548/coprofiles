"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-bg/80 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')",
          backgroundPosition: "50% 30%",
        }}
      />
      <div className="absolute inset-0 bg-texture-noise pointer-events-none z-10 opacity-30" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="inline-block mb-6">
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans">
              SQROCK IT Solutions
            </span>
          </div>

          <h1 className="font-serif text-[clamp(3.5rem,12vw,10rem)] font-bold leading-[0.88] tracking-tighter text-white mb-8">
            BUILD.
            <br />
            LEARN.
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              GET HIRED.
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-sans leading-relaxed">
            The Official Internship &amp; Hiring Platform of SQROCK IT Solutions — bridging academic learning with industry excellence.
          </p>

          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-8 h-px bg-gold/40" />
            <div className="w-2 h-2 bg-gold rotate-45" />
            <div className="w-8 h-px bg-gold/40" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group px-10 py-4 bg-white text-luxury-bg font-sans text-sm uppercase tracking-[0.2em] font-medium hover:bg-gold transition-colors duration-500"
            >
              Apply For Internship
              <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/#internships"
              className="px-10 py-4 border border-white/20 text-white/80 font-sans text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-luxury-bg transition-all duration-500"
            >
              Explore Opportunities
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </div>
    </section>
  )
}
