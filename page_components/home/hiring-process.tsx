"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { FileText, Users, Briefcase, Award, GraduationCap } from "lucide-react"

const steps = [
  { title: "Application", icon: FileText, description: "Submit your profile" },
  { title: "Profile Review", icon: Users, description: "We assess your fit" },
  { title: "Compulsory Exam", icon: GraduationCap, description: "Must pass to qualify" },
  { title: "Internship", icon: Briefcase, description: "Real project work" },
  { title: "Certificate", icon: Award, description: "Auto-generated" },
  { title: "Job Offer", icon: Award, description: "Top performers only" },
]

export function HiringProcess() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="hiring-process" className="py-32 px-6 bg-luxury-bg" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans">Step by Step</span>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-white mt-4">
            Hiring Process
          </h2>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-6" />
          <p className="text-white/40 text-lg max-w-2xl mx-auto mt-6 font-sans">
            Your journey from application to full-time role at SQROCK.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto border border-white/20 flex items-center justify-center mb-4 group-hover:border-gold/50 transition-colors duration-300">
                <step.icon size={24} className="text-white/60 group-hover:text-gold transition-colors duration-300" />
              </div>
              <span className="text-gold text-[10px] font-sans block mb-1 uppercase tracking-[0.2em]">
                Step {index + 1}
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-white font-sans block">
                {step.title}
              </span>
              {step.description && (
                <span className="text-xs text-white/30 mt-1 block font-sans">
                  {step.description}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Exam Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-gold/30 p-8 mb-12 bg-gradient-to-r from-gold/5 to-transparent"
        >
          <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
            <div className="p-3 border border-gold/30">
              <GraduationCap size={32} className="text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">
                Compulsory Examination
              </h3>
              <p className="text-white/50 mb-4 font-sans">
                All applicants must pass the compulsory technical and aptitude exam. Only candidates who clear the exam will be eligible for the internship.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="px-6 py-2 bg-white text-luxury-bg font-sans text-sm uppercase tracking-[0.15em] font-medium hover:bg-gold transition-colors duration-300">
                  Take Sample Exam
                </Link>
                <span className="px-6 py-2 border border-white/20 text-white/60 font-sans text-sm uppercase tracking-[0.15em] hover:border-white/40 transition-colors duration-300 cursor-default">
                  View Syllabus
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificate types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/10 p-8 hover:border-white/20 transition-colors duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-gold" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                Basic Certificate
              </h3>
            </div>
            <p className="text-white/40 font-sans mb-4">
              Automatically generated upon internship completion. No additional steps required.
            </p>
            <span className="inline-block px-3 py-1 border border-white/20 text-white/40 font-sans text-xs uppercase tracking-widest">
              Auto-Generated
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="border border-white/10 p-8 hover:border-white/20 transition-colors duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-gold" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                Custom Certificate
              </h3>
            </div>
            <p className="text-white/40 font-sans mb-4">
              Need a custom certificate with specific details? Email us your request.
            </p>
            <a
              href="mailto:hr@sqrock.cloud"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 font-sans text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-luxury-bg transition-all duration-300"
            >
              hr@sqrock.cloud
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
