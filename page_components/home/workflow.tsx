"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Building2, FileEdit, Users, ClipboardCheck, UserCheck } from "lucide-react"

const steps = [
  { icon: Building2, title: "Create Company Profile", description: "Set up your company profile with branding, requirements, and hiring preferences." },
  { icon: FileEdit, title: "Post Internship or Job", description: "Create detailed job listings with requirements, skills, and assessment criteria." },
  { icon: Users, title: "Receive Applications", description: "Get applications from qualified students with detailed profiles and portfolios." },
  { icon: ClipboardCheck, title: "Conduct Exams", description: "Run secure assessments through ExaminerMax with automated evaluation." },
  { icon: UserCheck, title: "Shortlist & Hire", description: "Review candidates, conduct interviews, and make data-driven hiring decisions." },
]

export function Workflow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-32 px-6 bg-background">
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            How It Works
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            How CoProfiles Works
          </h2>
          <div className="w-16 h-px bg-foreground mx-auto mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 font-serif">
            Streamline your hiring process with our intelligent workflow system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, index, isInView }: { step: typeof steps[0]; index: number; isInView: boolean }) {
  const ref = useRef(null)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="text-center"
    >
      <div className="w-16 h-16 mx-auto border-2 border-foreground flex items-center justify-center mb-6">
        <step.icon size={28} className="text-foreground" />
      </div>
      <div className="relative">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block mb-2">
          Step {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-serif text-lg font-bold tracking-tight text-foreground mb-2">{step.title}</h3>
        <p className="font-serif text-sm text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-foreground/30">
          <span className="text-2xl">&rarr;</span>
        </div>
      )}
    </motion.div>
  )
}
