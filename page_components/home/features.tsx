"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Briefcase, UserCheck, FileCheck, MessageSquare,
  FileText, Mail, Zap, ShoppingBag,
} from "lucide-react"

const features = [
  { icon: Briefcase, title: "Internship & Job Listings", description: "Companies can post internships and jobs with smart application management and candidate filtering." },
  { icon: UserCheck, title: "Candidate Profiles", description: "View projects, activities, performance, skills, exam reports, and portfolio data in one place." },
  { icon: FileCheck, title: "Integrated Exams", description: "Direct integration with ExaminerMax for secure exams, automatic roll numbers, and API-key setup." },
  { icon: MessageSquare, title: "WhatsApp Integration", description: "Connect WhatsApp business account for automated notifications and candidate communication." },
  { icon: FileText, title: "Smart Forms + Payments", description: "Create forms, collect payments, application fees, and registration workflows seamlessly." },
  { icon: Mail, title: "Email Automation", description: "Connect email, use Nodemailer for automated responses, interview mails, and notifications." },
  { icon: Zap, title: "Automation System", description: "Auto shortlisting, reminders, workflow automations, and candidate status tracking." },
  { icon: ShoppingBag, title: "Future Marketplace", description: "Connect with SQROCK Service Marketplace for businesses and freelancers to sell services." },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border-2 border-foreground p-8 bg-background transition-colors duration-100 hover:bg-foreground hover:text-background"
    >
      <div className="mb-6">
        <feature.icon size={24} className="text-foreground group-hover:text-background transition-colors duration-100" />
      </div>
      <h3 className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-background transition-colors duration-100 mb-3">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed font-serif group-hover:text-background/80 transition-colors duration-100">
        {feature.description}
      </p>
    </motion.div>
  )
}

export function Features() {
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
          className="mb-16"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Platform Capabilities
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Features
          </h2>
          <div className="w-16 h-px bg-foreground mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mt-6 font-serif">
            Everything you need to manage your entire hiring pipeline, from job postings to candidate onboarding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
