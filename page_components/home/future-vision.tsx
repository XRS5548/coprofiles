// components/future-vision.tsx
'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, ShoppingBag, Cog, TrendingUp, BarChart3 } from 'lucide-react'

const futureFeatures = [
  {
    icon: Brain,
    title: 'AI Candidate Analysis',
    description: 'Intelligent candidate evaluation using machine learning algorithms.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Recommendations',
    description: 'AI-powered hiring recommendations based on company needs.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: ShoppingBag,
    title: 'Freelancer Marketplace',
    description: 'Connect with freelancers and service providers seamlessly.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Cog,
    title: 'Advanced Automation',
    description: 'End-to-end hiring automation with custom workflows.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: TrendingUp,
    title: 'Performance Intelligence',
    description: 'Predictive analytics for student and candidate performance.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'AI Exam Analytics',
    description: 'Deep insights into exam patterns and candidate capabilities.',
    color: 'from-indigo-500 to-purple-500',
  },
]

export function FutureVision() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">Coming Soon</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            <span className="gradient-text">Future Vision</span>
            <br />
            <span className="text-white">Next-Gen Hiring</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We're building the future of intelligent hiring with AI-powered tools and automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative"
            >
              <div className="glass rounded-2xl p-8 h-full hover:border-purple-500/30 transition-all">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-xs text-purple-400">In Development</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}