// components/workflow.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Building2, FileEdit, Users, ClipboardCheck, UserCheck, ArrowRight 
} from 'lucide-react'

const steps = [
  {
    icon: Building2,
    title: 'Create Company Profile',
    description: 'Set up your company profile with branding, requirements, and hiring preferences.',
    color: 'from-purple-500 to-blue-500',
  },
  {
    icon: FileEdit,
    title: 'Post Internship or Job',
    description: 'Create detailed job listings with requirements, skills, and assessment criteria.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Receive Applications',
    description: 'Get applications from qualified students with detailed profiles and portfolios.',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Conduct Exams',
    description: 'Run secure assessments through ExaminerMax with automated evaluation.',
    color: 'from-teal-500 to-green-500',
  },
  {
    icon: UserCheck,
    title: 'Shortlist & Hire',
    description: 'Review candidates, conduct interviews, and make data-driven hiring decisions.',
    color: 'from-green-500 to-emerald-500',
  },
]

export function Workflow() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            <span className="text-white">How </span>
            <span className="gradient-text">CoProfiles</span>
            <span className="text-white"> Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Streamline your hiring process with our intelligent workflow system.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <WorkflowStep key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowStep({ step, index }: { step: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Step Number */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 glow relative z-10`}
      >
        <step.icon className="w-8 h-8 text-white" />
      </motion.div>

      {/* Content */}
      <div className="glass rounded-xl p-6 w-full">
        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
        <p className="text-sm text-gray-400">{step.description}</p>
      </div>

      {/* Arrow for mobile */}
      {index < steps.length - 1 && (
        <div className="lg:hidden mt-4">
          <ArrowRight className="w-6 h-6 text-purple-400" />
        </div>
      )}
    </motion.div>
  )
}