 "use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full Stack Intern → Developer",
    text: "The mentorship and real projects at SQROCK transformed my career. I received a full-time offer immediately after completing my internship.",
  },
  {
    name: "Priya Patel",
    role: "UI/UX Intern",
    text: "Working on real client projects helped me build a strong portfolio that attracted multiple job opportunities.",
  },
  {
    name: "Amit Kumar",
    role: "AI Developer Intern",
    text: "The experience and certification from SQROCK gave me confidence and opened new career opportunities.",
  },
  {
    name: "Neha Singh",
    role: "Frontend Intern",
    text: "One of the best learning experiences of my college life. The skills I gained are directly relevant to the industry.",
  },
]

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-black py-32 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="select-none text-[14vw] font-black uppercase tracking-tight text-[#CD7F32]/5">
          SUCCESS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="block text-xs uppercase tracking-[0.35em] text-[#CD7F32]">
            STUDENT SUCCESS
          </span>

          <h2 className="mt-4 font-serif text-5xl md:text-8xl font-bold tracking-tight text-[#CD7F32]">
            Student
            <br />
            <span className="text-[#CD7F32]/40">
              Success
            </span>
          </h2>

          <div className="mx-auto mt-6 h-px w-20 bg-[#CD7F32]/50" />

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Hear from students who transformed their careers through
            internships, mentorship, and real-world project experience.
          </p>
        </motion.div>
      </div>

      {/* Marquee Testimonials */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-8 animate-marquee"
          style={{ width: "max-content" }}
        >
          {[...testimonials, ...testimonials, ...testimonials].map(
            (testimonial, index) => (
              <div
                key={index}
                className="w-[380px] flex-shrink-0 rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_30px_rgba(205,127,50,0.12)]"
              >
                {/* Quote */}
                <div className="mb-4 font-serif text-7xl leading-none text-[#CD7F32]/20">
                  ”
                </div>

                {/* Testimonial */}
                <p className="mb-8 text-base leading-7 text-white/65">
                  {testimonial.text}
                </p>

                {/* Divider */}
                <div className="border-t border-[#CD7F32]/10 pt-5">
                  <h3 className="font-serif text-lg font-bold text-[#CD7F32]">
                    {testimonial.name}
                  </h3>

                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
                    {testimonial.role}
                  </p>
                </div>

                {/* Accent Line */}
                <div className="mt-5 h-px w-12 bg-[#CD7F32]/30 transition-all duration-300 hover:w-20 hover:bg-[#CD7F32]" />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}