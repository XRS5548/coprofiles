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
    <section id="internships" className="py-32 px-6 bg-background" ref={ref}>
      {/* Thick rule */}
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Featured Opportunities
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Featured Internships
          </h2>
          <div className="w-16 h-px bg-foreground mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mt-6 font-serif">
            Launch your career with real-world experience at SQROCK IT Solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship, index) => (
            <motion.div
              key={internship.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <InternshipCard
                {...internship}
                index={index}
                isLoggedIn={isLoggedIn}
              />
            </motion.div>
          ))}
        </div>

        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-12 text-center p-8 border-2 border-foreground bg-muted"
          >
            <p className="text-muted-foreground mb-4 font-serif">
              Login to apply for internships and build your professional profile
            </p>
            <button
              onClick={() => window.location.href = "/login"}
              className="px-8 py-3 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-foreground transition-none duration-0"
            >
              Login Now
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
