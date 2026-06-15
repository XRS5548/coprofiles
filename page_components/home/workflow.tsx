 "use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Building2,
  FileEdit,
  Users,
  ClipboardCheck,
  UserCheck,
} from "lucide-react"

const steps = [
  {
    icon: Building2,
    title: "Create Company Profile",
    description:
      "Set up your company profile with branding, requirements, and hiring preferences.",
  },
  {
    icon: FileEdit,
    title: "Post Internship or Job",
    description:
      "Create detailed listings with requirements, skills, and assessment criteria.",
  },
  {
    icon: Users,
    title: "Receive Applications",
    description:
      "Get applications from qualified students with portfolios and project experience.",
  },
  {
    icon: ClipboardCheck,
    title: "Conduct Exams",
    description:
      "Run secure assessments with automated evaluation and candidate ranking.",
  },
  {
    icon: UserCheck,
    title: "Shortlist & Hire",
    description:
      "Review candidates, conduct interviews, and make data-driven hiring decisions.",
  },
]

export function Workflow() {
  const ref = useRef(null)

  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
  })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black py-32 px-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="select-none text-[14vw] font-black uppercase tracking-tight text-[#CD7F32]/5">
          WORKFLOW
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
            HOW IT WORKS
          </span>

          <h2 className="mt-4 font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#CD7F32]">
            How CoProfiles Works
          </h2>

          <div className="w-20 h-px bg-[#CD7F32]/50 mx-auto mt-6" />

          <p className="max-w-2xl mx-auto mt-8 text-lg leading-8 text-white/70">
            Simplify hiring with a structured workflow designed to help
            companies discover, assess, and recruit top talent efficiently.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {steps.map((step, index) => (
            <StepCard
              key={step.title}
              step={step}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  index,
  isInView,
}: {
  step: (typeof steps)[0]
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 30 }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className="relative group"
    >
      <div className="rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-6 text-center transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_25px_rgba(205,127,50,0.12)] h-full">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-[#CD7F32]/20 bg-[#111111]">
          <step.icon
            size={28}
            className="text-[#CD7F32]"
          />
        </div>

        {/* Step Number */}
        <span className="block mb-3 text-[10px] uppercase tracking-[0.25em] text-[#CD7F32]">
          Step {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <h3 className="mb-3 font-serif text-xl font-bold text-[#CD7F32]">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-6 text-white/60">
          {step.description}
        </p>

        {/* Bottom Accent Line */}
        <div className="mt-6 mx-auto h-px w-12 bg-[#CD7F32]/30 transition-all duration-300 group-hover:w-20 group-hover:bg-[#CD7F32]" />
      </div>

      {/* Desktop Arrow */}
      {index < steps.length - 1 && (
        <div className="hidden md:flex absolute top-1/2 -right-6 -translate-y-1/2 z-20">
          <span className="text-[#CD7F32]/40 text-2xl">
            →
          </span>
        </div>
      )}
    </motion.div>
  )
}