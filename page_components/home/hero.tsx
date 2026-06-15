 "use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />

      {/* Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,127,50,0.18),transparent_60%)]" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >

          {/* Brand */}
          <span className="text-[#CD7F32] text-xs uppercase tracking-[0.4em] font-medium">
            SQROCK IT SOLUTIONS
          </span>

          {/* BIG SPACED HEADING */}
          <h1 className="mt-10 font-['Playfair_Display'] text-[clamp(3.5rem,11vw,10rem)] font-bold leading-[1.05] tracking-wide text-white">

            BUILD<br />
            <span className="inline-block mt-4">LEARN</span><br />

            <span className="inline-block mt-6 text-transparent bg-clip-text bg-gradient-to-r from-[#CD7F32] via-[#D89247] to-[#CD7F32]">
              GET HIRED
            </span>

          </h1>

          {/* SUBTEXT (MORE SPACE) */}
          <p className="mt-14 text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-[1.8] font-[Inter]">
            The official internship & hiring platform connecting students with real industry experience,
            projects, and career opportunities that actually matter.
          </p>

          {/* DECOR LINE */}
          <div className="flex items-center justify-center gap-6 mt-14 mb-14">
            <div className="w-16 h-[1px] bg-[#CD7F32]/40" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#CD7F32]" />
            <div className="w-16 h-[1px] bg-[#CD7F32]/40" />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center">

            <Link
              href="/register"
              className="px-12 py-4 bg-[#CD7F32] text-black font-semibold text-sm uppercase tracking-[0.25em] hover:bg-[#D89247] transition"
            >
              Apply For Internship
            </Link>

            <Link
              href="/#internships"
              className="px-12 py-4 border border-[#CD7F32]/40 text-[#CD7F32] font-medium text-sm uppercase tracking-[0.25em] hover:bg-[#CD7F32] hover:text-black transition"
            >
              Explore Opportunities
            </Link>

          </div>

        </motion.div>
      </div>
    </section>
  )
}