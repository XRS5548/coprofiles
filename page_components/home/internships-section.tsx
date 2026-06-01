// components/internships-section.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { InternshipCard } from "./internship-card"

const internships = [
  { id: 1, title: "Full Stack Developer", duration: "3 months", location: "Remote", certificate: true, skills: ["React", "Node.js", "TypeScript"] },
  { id: 2, title: "Frontend Developer", duration: "2 months", location: "Remote", certificate: true, skills: ["React", "Tailwind", "Next.js"] },
  { id: 3, title: "Backend Developer", duration: "3 months", location: "Remote", certificate: true, skills: ["Python", "Django", "PostgreSQL"] },
  { id: 4, title: "UI/UX Designer", duration: "2 months", location: "Remote", certificate: true, skills: ["Figma", "Adobe XD", "Prototyping"] },
  { id: 5, title: "Graphic Designer", duration: "2 months", location: "Remote", certificate: true, skills: ["Photoshop", "Illustrator", "Branding"] },
  { id: 6, title: "AI Developer", duration: "4 months", location: "Remote", certificate: true, skills: ["Python", "TensorFlow", "NLP"] },
  { id: 7, title: "Digital Marketing", duration: "2 months", location: "Remote", certificate: true, skills: ["SEO", "Social Media", "Analytics"] },
]

export function InternshipsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token")
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!(token || user))
  }, [])

  return (
    <section id="internships" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-[#FAFAFA]">
            Featured Internships
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl">
            Launch your career with real-world experience at SQROCK IT Solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship, index) => (
            <InternshipCard 
              key={internship.title} 
              {...internship} 
              index={index}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>

        {/* Show login prompt if not logged in */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center p-6 border border-[#DFE104] bg-[#DFE104]/5"
          >
            <p className="text-[#A1A1AA] mb-4">
                Login to apply for internships and build your professional profile
            </p>
            <button className="px-6 py-3 bg-[#DFE104] text-black font-medium uppercase tracking-wide hover:bg-[#DFE104]/90 transition-all duration-200">
              Login Now
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}