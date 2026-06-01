// components/student-benefits.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Search, Bell, FileText, TrendingUp, 
  Users, MessageSquare, Award, Zap
} from 'lucide-react'

const benefits = [
  { icon: Search, title: 'Discover Opportunities', description: 'Find internships and jobs matching your skills' },
  { icon: Bell, title: 'Stay Updated', description: 'Receive instant notifications for new opportunities' },
  { icon: FileText, title: 'Track Applications', description: 'Monitor your application status in real-time' },
  { icon: TrendingUp, title: 'Build Visibility', description: 'Create a compelling profile that stands out' },
  { icon: Users, title: 'Direct Connection', description: 'Connect with companies directly' },
  { icon: MessageSquare, title: 'Quick Communication', description: 'Get updates via WhatsApp and email' },
  { icon: Award, title: 'Showcase Skills', description: 'Display projects, certifications, and achievements' },
  { icon: Zap, title: 'Fast-track Career', description: 'Accelerate your career growth' },
]

export function StudentBenefits() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
              <span className="gradient-text">For Students</span>
              <br />
              <span className="text-white">Launch Your Career</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Discover opportunities, showcase your skills, and connect with top companies 
              looking for talent like you.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-xl p-4 hover:border-purple-500/30 transition-all"
                >
                  <benefit.icon className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-8 glow">
              {/* Mock Student Dashboard */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Priya Sharma</h3>
                    <p className="text-gray-400">Computer Science • 3rd Year</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Applications', value: '12' },
                    { label: 'Shortlisted', value: '5' },
                    { label: 'Interviews', value: '3' },
                    { label: 'Offers', value: '2' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Skill Bars */}
                <div className="space-y-3">
                  {[
                    { skill: 'React', level: 85 },
                    { skill: 'Node.js', level: 75 },
                    { skill: 'Python', level: 90 },
                  ].map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{skill.skill}</span>
                        <span className="text-purple-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 glass rounded-xl p-3 glow"
            >
              <Award className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}