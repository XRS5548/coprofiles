"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
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
    <section id="hiring-process" className="py-32 px-6 bg-background" ref={ref}>
      {/* Thick rule */}
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Step by Step
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Hiring Process
          </h2>
          <div className="w-16 h-px bg-foreground mx-auto mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 font-serif">
            Your journey from application to full-time role at SQROCK.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto border-2 border-foreground flex items-center justify-center mb-4 bg-background group-hover:bg-foreground transition-colors duration-100">
                <step.icon size={24} className="text-foreground" />
              </div>
              <span className="font-mono text-xs text-muted-foreground block mb-1 uppercase tracking-widest">
                Step {index + 1}
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground block">
                {step.title}
              </span>
              {step.description && (
                <span className="font-serif text-xs text-muted-foreground mt-1 block">
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
          transition={{ duration: 0.3, delay: 0.2 }}
          className="border-2 border-foreground p-8 mb-12 bg-foreground text-background"
        >
          <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
            <div className="p-3 border-2 border-background">
              <GraduationCap size={32} className="text-background" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-background mb-2">
                Compulsory Examination
              </h3>
              <p className="text-background/80 mb-4 font-serif">
                All applicants must pass the compulsory technical and aptitude exam. Only candidates who clear the exam will be eligible for the internship.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 bg-background text-foreground font-mono text-sm uppercase tracking-widest hover:bg-transparent hover:text-background hover:outline hover:outline-2 hover:outline-background transition-none duration-0">
                  Take Sample Exam
                </button>
                <button className="px-6 py-2 border-2 border-background text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-none duration-0">
                  View Syllabus
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificate types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="border-2 border-foreground p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-foreground" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
                Basic Certificate
              </h3>
            </div>
            <p className="text-muted-foreground font-serif mb-4">
              Automatically generated upon internship completion. No additional steps required.
            </p>
            <span className="inline-block px-3 py-1 border border-foreground text-foreground font-mono text-xs uppercase tracking-widest">
              Auto-Generated
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="border-2 border-foreground p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-foreground" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
                Custom Certificate
              </h3>
            </div>
            <p className="text-muted-foreground font-serif mb-4">
              Need a custom certificate with specific details? Email us your request.
            </p>
            <a
              href="mailto:hr@sqrock.cloud"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-foreground text-foreground font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-none duration-0"
            >
              hr@sqrock.cloud
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
