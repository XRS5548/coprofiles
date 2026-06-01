// components/internship-card.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Briefcase, MapPin, Award, Lock } from "lucide-react"

interface InternshipCardProps {
  id: number
  title: string
  duration: string
  location: string
  certificate: boolean
  skills: string[]
  index: number
  isLoggedIn: boolean
}

export function InternshipCard({ 
  id, 
  title, 
  duration, 
  location, 
  certificate, 
  skills, 
  index, 
  isLoggedIn 
}: InternshipCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const handleApplyClick = () => {
    if (isLoggedIn) {
      // Proceed with application
      console.log(`Applying for ${title}`)
      // You can redirect to application form or show modal
      window.location.href = `/apply/${id}`
    } else {
      // Redirect to login page
      window.location.href = "/login"
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ backgroundColor: "#DFE104", y: -4 }}
      className="group p-6 border border-[#3F3F46] bg-[#09090B] transition-all duration-300 cursor-pointer"
    >
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 group-hover:text-black transition-colors duration-300 text-[#FAFAFA]">
        {title}
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-[#A1A1AA] group-hover:text-black/70 transition-colors duration-300">
          <Briefcase size={16} />
          <span className="text-sm uppercase tracking-wide">{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-[#A1A1AA] group-hover:text-black/70 transition-colors duration-300">
          <MapPin size={16} />
          <span className="text-sm uppercase tracking-wide">{location}</span>
        </div>
        {certificate && (
          <div className="flex items-center gap-2 text-[#DFE104] group-hover:text-black transition-colors duration-300">
            <Award size={16} />
            <span className="text-sm uppercase tracking-wide">Certificate Available</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 text-xs uppercase tracking-wide border border-[#3F3F46] group-hover:border-black/30 group-hover:text-black/80 transition-colors duration-300 text-[#A1A1AA]"
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={handleApplyClick}
        className="w-full py-3 text-center border border-[#DFE104] bg-transparent uppercase tracking-wide text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoggedIn ? (
          <>
            Apply Now
            <Briefcase size={14} />
          </>
        ) : (
          <>
            <Lock size={14} />
            Login to Apply
          </>
        )}
      </button>

      {!isLoggedIn && (
        <p className="text-xs text-center mt-3 text-[#A1A1AA] group-hover:text-black/60 transition-colors duration-300">
          Login required to apply
        </p>
      )}
    </motion.div>
  )
}