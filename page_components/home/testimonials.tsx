"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full Stack Intern → Developer",
    text: "The mentorship and real projects at SQROCK transformed my career. I got a full-time offer right after my internship.",
  },
  {
    name: "Priya Patel",
    role: "UI/UX Intern",
    text: "Working on real client projects gave me portfolio pieces that helped me land multiple job offers.",
  },
  {
    name: "Amit Kumar",
    role: "AI Developer Intern",
    text: "The certificate from SQROCK opened doors I never thought possible. Highly recommended for serious developers.",
  },
  {
    name: "Neha Singh",
    role: "Frontend Intern",
    text: "Best decision I made in college. The skills I learned here are exactly what the industry demands.",
  },
]

export function Testimonials() {
  return (
    <section className="py-32 px-6 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans">Student Success</span>
          <h2 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter text-white mt-4">
            Student
            <br />
            <span className="text-white/40">Success</span>
          </h2>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-6" />
        </motion.div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee gap-8" style={{ width: "max-content" }}>
          {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-[400px] p-8 border border-white/10 bg-luxury-bg/50 backdrop-blur-sm inline-block whitespace-normal flex-shrink-0"
            >
              <div className="font-serif text-7xl leading-none text-gold/20 mb-4 tracking-tighter">
                &rdquo;
              </div>
              <p className="text-white/60 text-base leading-relaxed mb-6 font-sans">
                {t.text}
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-sans font-bold uppercase text-sm tracking-widest text-white">
                  {t.name}
                </p>
                <p className="text-white/30 text-xs font-sans uppercase tracking-widest mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
