 "use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { InternshipCard } from "./internship-card"

const internships = [
  { id: 1, title: "Full Stack Developer", duration: "3 months", location: "Remote", certificate: true, skills: ["React", "Node.js", "TypeScript"] },
  { id: 2, title: "Frontend Developer", duration: "2 months", location: "Remote", certificate: true, skills: ["React", "Tailwind", "Next.js"] },
  { id: 3, title: "Backend Developer", duration: "3 months", location: "Remote", certificate: true, skills: ["Python", "Django", "PostgreSQL"] },
  { id: 4, title: "UI/UX Designer", duration: "2 months", location: "Remote", certificate: true, skills: ["Figma", "Adobe XD", "Prototyping"] },
  { id: 5, title: "Graphic Designer", duration: "2 months", location: "Remote", certificate: true, skills: ["Photoshop", "Illustrator", "Branding"] },
  { id: 6, title: "AI Developer", duration: "4 months", location: "Remote", certificate: true, skills: ["Python", "TensorFlow", "NLP"] },
]

export function InternshipsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!(token || user))
  }, [])

  return (
    <section
      id="internships"
      ref={ref}
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#CD7F32] text-xs uppercase tracking-[0.35em]">
            Featured Opportunities
          </span>

          <h2 className="font-serif text-5xl md:text-7xl font-bold text-[#CD7F32] mt-8">
            Internships
          </h2>

          <div className="w-20 h-[1px] bg-[#CD7F32]/50 mt-6" />

          <p className="text-white/70 text-lg max-w-2xl mt-6">
            Real-world experience to build your future with CO-PROFILES.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <InternshipCard
                {...internship}
                index={index}
                isLoggedIn={isLoggedIn}
              />
            </motion.div>
          ))}
        </div>

        {/* Login Prompt */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14 text-center p-8 border border-[#CD7F32]/20 bg-[#0A0A0A]"
          >
            <p className="text-white/70 mb-4">
              Login to apply for internships and unlock opportunities
            </p>

            <button
              onClick={() => (window.location.href = "/login")}
              className="px-8 py-3 bg-[#CD7F32] text-black font-semibold uppercase tracking-[0.15em] hover:bg-[#D89247] transition"
            >
              Login Now
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}