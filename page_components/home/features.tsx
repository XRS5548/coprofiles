// components/features.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Briefcase, UserCheck, FileCheck, MessageSquare,
  FileText, Mail, Zap, ShoppingBag
} from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Internship & Job Listings',
    description: 'Companies can post internships and jobs with smart application management and candidate filtering.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: UserCheck,
    title: 'Candidate Profiles',
    description: 'View projects, activities, performance, skills, exam reports, and portfolio data in one place.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileCheck,
    title: 'Integrated Exams',
    description: 'Direct integration with ExaminerMax for secure exams, automatic roll numbers, and API-key setup.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Integration',
    description: 'Connect WhatsApp business account for automated notifications and candidate communication.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: FileText,
    title: 'Smart Forms + Payments',
    description: 'Create forms, collect payments, application fees, and registration workflows seamlessly.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Mail,
    title: 'Email Automation',
    description: 'Connect email, use Nodemailer for automated responses, interview mails, and notifications.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Automation System',
    description: 'Auto shortlisting, reminders, workflow automations, and candidate status tracking.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: ShoppingBag,
    title: 'Future Marketplace',
    description: 'Connect with SQROCK Service Marketplace for businesses and freelancers to sell services.',
    color: 'from-teal-500 to-green-500',
  },
]

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative"
    >
      <div className="glass rounded-2xl p-8 h-full hover:border-purple-500/30 transition-all duration-300">
        {/* Gradient Border on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
        
        <div className="relative">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
            {feature.title}
          </h3>
          
          <p className="text-gray-400 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl" />
        </div>
      </div>
    </motion.div>
  )
}

export function Features() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
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
            <span className="gradient-text">Powerful Features</span>
            <br />
            <span className="text-white">For Modern Hiring</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to manage your entire hiring pipeline, from job postings to candidate onboarding.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}