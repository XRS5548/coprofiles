// components/hiring-process.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { FileText, Users, Briefcase, Award, Star, GraduationCap, Mail } from "lucide-react"

const steps = [
  { title: "APPLICATION", icon: FileText },
  { title: "PROFILE REVIEW", icon: Users },
  { title: "COMPULSORY EXAM", icon: GraduationCap, description: "Must pass to qualify" },
  { title: "INTERNSHIP", icon: Briefcase },
  { title: "BASIC CERTIFICATE", icon: Award, description: "Auto-generated after completion" },
  { title: "JOB OFFER", icon: Star, description: "Top performers only" },
]

export function HiringProcess() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [showCertificateModal, setShowCertificateModal] = useState(false)

  return (
    <section id="hiring-process" className="py-24 px-6 border-t border-[#3F3F46]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-[#FAFAFA]">
            Hiring Process
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Your journey from application to full-time role at SQROCK.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center relative"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 border flex items-center justify-center mb-3 ${
                step.title === "COMPULSORY EXAM" ? "border-[#DFE104] bg-[#DFE104]/10" : "border-[#DFE104]"
              }`}>
                <step.icon size={32} className="text-[#DFE104]" />
              </div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-center text-[#FAFAFA]">
                {step.title}
              </span>
              {step.description && (
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wide mt-1">
                  {step.description}
                </span>
              )}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute transform translate-x-32 text-[#DFE104] text-2xl">
                  ↓
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Exam Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-[#DFE104] p-8 mb-12"
        >
          <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
            <div className="p-3 border border-[#DFE104] bg-[#DFE104]/5">
              <GraduationCap size={32} className="text-[#DFE104]" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-[#FAFAFA] mb-2">
                Compulsory Examination
              </h3>
              <p className="text-[#A1A1AA] mb-4">
                All applicants must pass the compulsory technical and aptitude exam. 
                Only candidates who clear the exam will be eligible for the internship.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 bg-[#DFE104] text-black font-medium uppercase tracking-wide text-sm hover:bg-[#DFE104]/90 transition-all">
                  Take Sample Exam
                </button>
                <button className="px-6 py-2 border border-[#3F3F46] text-[#FAFAFA] font-medium uppercase tracking-wide text-sm hover:border-[#DFE104] hover:text-[#DFE104] transition-all">
                  View Syllabus
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificate Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Certificate */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border border-[#3F3F46] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award size={28} className="text-[#DFE104]" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#FAFAFA]">
                Basic Certificate
              </h3>
            </div>
            <p className="text-[#A1A1AA] text-sm mb-4">
              Automatically generated upon internship completion. No additional steps required.
            </p>
            <div className="inline-block px-3 py-1 border border-[#DFE104] text-[#DFE104] text-xs uppercase tracking-wide">
              AUTO-GENERATED
            </div>
          </motion.div>

          {/* Custom Certificate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="border border-[#3F3F46] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail size={28} className="text-[#DFE104]" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#FAFAFA]">
                Custom Certificate
              </h3>
            </div>
            <p className="text-[#A1A1AA] text-sm mb-4">
              Need a custom certificate with specific details? Email us your request.
            </p>
            <a 
              href="mailto:hr@sqrock.cloud"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#DFE104] text-[#DFE104] text-sm uppercase tracking-wide hover:bg-[#DFE104] hover:text-black transition-all duration-200"
            >
              <Mail size={14} />
              hr@sqrock.cloud
            </a>
          </motion.div>
        </div>

        {/* Exam Pass Requirement Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center p-4 border border-[#DFE104]/30 bg-[#DFE104]/5"
        >
          <p className="text-[#A1A1AA] text-sm uppercase tracking-wide">
            ⚠️ IMPORTANT: You must pass the compulsory exam to qualify for the internship. 
            Basic certificate is auto-generated. For custom certificates, email <span className="text-[#DFE104]">hr@sqrock.cloud</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}