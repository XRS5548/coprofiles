 "use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const reasons = [
  {
    number: "01",
    title: "Real Projects",
    description:
      "Work on production-ready applications used by real clients and users.",
  },
  {
    number: "02",
    title: "Certification",
    description:
      "Earn industry-recognized certificates upon successful completion.",
  },
  {
    number: "03",
    title: "Mentorship",
    description:
      "Learn from senior engineers and industry experts through guided mentorship.",
  },
  {
    number: "04",
    title: "Placement",
    description:
      "Top-performing interns receive direct job opportunities from SQROCK.",
  },
]

export function WhyJoinSection() {
  const ref = useRef(null)

  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  })

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-black py-32 px-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="select-none text-[14vw] font-black uppercase tracking-tight text-[#CD7F32]/5">
          SQROCK
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-20"
        >
          <span className="block text-xs uppercase tracking-[0.35em] text-[#CD7F32]">
            WHY CHOOSE US
          </span>

          <h2 className="mt-4 font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#CD7F32]">
            Why Join SQROCK
          </h2>

          <div className="mt-6 h-px w-20 bg-[#CD7F32]/50" />

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Gain practical experience, work on real-world projects, earn
            certifications, and build a strong foundation for your future
            career.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="group rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-8 transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_30px_rgba(205,127,50,0.12)]"
            >
              {/* Large Number */}
              <div className="mb-4 font-serif text-7xl md:text-8xl font-bold leading-none text-[#CD7F32]/10 transition-all duration-300 group-hover:text-[#CD7F32]/20">
                {reason.number}
              </div>

              {/* Title */}
              <h3 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#CD7F32]">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-base leading-7 text-white/65">
                {reason.description}
              </p>

              {/* Bottom Line */}
              <div className="mt-6 h-px w-12 bg-[#CD7F32]/30 transition-all duration-300 group-hover:w-20 group-hover:bg-[#CD7F32]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}