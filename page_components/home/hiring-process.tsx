 "use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  FileText,
  Users,
  Briefcase,
  Award,
  GraduationCap,
} from "lucide-react"

const steps = [
  {
    title: "Application",
    icon: FileText,
    description: "Submit your profile",
  },
  {
    title: "Profile Review",
    icon: Users,
    description: "We assess your fit",
  },
  {
    title: "Compulsory Exam",
    icon: GraduationCap,
    description: "Must pass to qualify",
  },
  {
    title: "Internship",
    icon: Briefcase,
    description: "Real project work",
  },
  {
    title: "Certificate",
    icon: Award,
    description: "Auto-generated",
  },
  {
    title: "Job Offer",
    icon: Award,
    description: "Top performers only",
  },
]

export function HiringProcess() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  })

  return (
    <section
      id="hiring-process"
      ref={ref}
      className="relative overflow-hidden bg-black py-32 px-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[15vw] font-black tracking-tight text-[#CD7F32]/5 uppercase">
          SQROCK
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="block text-xs uppercase tracking-[0.35em] text-[#CD7F32]">
            Step By Step
          </span>

          <h2 className="mt-4 font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#CD7F32]">
            Hiring Process
          </h2>

          <div className="w-20 h-px bg-[#CD7F32]/50 mx-auto mt-6" />

          <p className="max-w-2xl mx-auto mt-8 text-lg leading-8 text-white/70">
            Your journey from application to internship, certification,
            and a possible full-time opportunity at SQROCK IT Solutions.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="group rounded-xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-5 text-center transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_25px_rgba(205,127,50,0.15)]"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#CD7F32]/20 bg-[#111111]">
                <step.icon className="h-7 w-7 text-[#CD7F32]" />
              </div>

              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#CD7F32] mb-2">
                Step {index + 1}
              </span>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {step.title}
              </h3>

              <p className="mt-2 text-xs text-white/50">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Exam Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="mb-12 rounded-2xl border border-[#CD7F32]/20 bg-[#0A0A0A] p-8 shadow-[0_0_35px_rgba(205,127,50,0.08)]"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#CD7F32]/20 bg-[#111111]">
              <GraduationCap className="h-8 w-8 text-[#CD7F32]" />
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-3xl font-bold text-[#CD7F32] mb-3">
                Compulsory Examination
              </h3>

              <p className="text-white/70 leading-7 mb-6">
                Every applicant must pass the technical and aptitude
                examination. Only successful candidates will be eligible
                to continue to the internship stage.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-lg bg-[#CD7F32] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-all hover:bg-[#D89247] hover:shadow-[0_0_20px_rgba(205,127,50,0.35)]"
                >
                  Take Sample Exam
                </Link>

                <button
                  className="rounded-lg border border-[#CD7F32]/20 px-6 py-3 text-sm uppercase tracking-[0.15em] text-[#CD7F32] transition-all hover:border-[#CD7F32]"
                >
                  View Syllabus
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Certificate */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.3,
            }}
            className="rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-8 transition-all duration-300 hover:border-[#CD7F32]/40"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-[#CD7F32]" />

              <h3 className="font-serif text-2xl font-bold text-[#CD7F32]">
                Basic Certificate
              </h3>
            </div>

            <p className="text-white/70 leading-7 mb-5">
              Automatically generated after successful completion of
              your internship program.
            </p>

            <span className="inline-block rounded-full border border-[#CD7F32]/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#CD7F32]">
              Auto Generated
            </span>
          </motion.div>

          {/* Custom Certificate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.35,
            }}
            className="rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-8 transition-all duration-300 hover:border-[#CD7F32]/40"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-[#CD7F32]" />

              <h3 className="font-serif text-2xl font-bold text-[#CD7F32]">
                Custom Certificate
              </h3>
            </div>

            <p className="text-white/70 leading-7 mb-5">
              Need a customized certificate with specific details?
              Contact our HR team for assistance.
            </p>

            <a
              href="mailto:hr@sqrock.cloud"
              className="inline-flex items-center rounded-lg border border-[#CD7F32]/20 px-4 py-3 text-sm uppercase tracking-[0.15em] text-[#CD7F32] transition-all hover:border-[#CD7F32] hover:bg-[#CD7F32] hover:text-black"
            >
              hr@sqrock.cloud
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
