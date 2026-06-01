// components/integrations.tsx
'use client'

import { motion } from 'framer-motion'
import { 
  MessageSquare, Mail, CreditCard, Code, Database, Cloud 
} from 'lucide-react'

const integrations = [
  { 
    icon: MessageSquare, 
    name: 'WhatsApp Business', 
    description: 'Automated notifications and candidate communication',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    icon: Mail, 
    name: 'Nodemailer', 
    description: 'Automated email responses and notifications',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    icon: CreditCard, 
    name: 'Razorpay/Stripe', 
    description: 'Secure payment collection and processing',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    icon: Code, 
    name: 'REST APIs', 
    description: 'Custom integrations and webhook support',
    color: 'from-orange-500 to-red-500'
  },
  { 
    icon: Database, 
    name: 'ExaminerMax', 
    description: 'Secure exam platform with analytics',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    icon: Cloud, 
    name: 'Cloud Storage', 
    description: 'Secure document and data storage',
    color: 'from-teal-500 to-green-500'
  },
]

export function Integrations() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            <span className="gradient-text">Seamless Integrations</span>
            <br />
            <span className="text-white">Connect Your Stack</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Integrate with your favorite tools and services for a seamless workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-8 text-center group cursor-pointer hover:border-purple-500/30 transition-all"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${integration.color} mb-6 group-hover:scale-110 transition-transform`}
              >
                <integration.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">{integration.name}</h3>
              <p className="text-gray-400">{integration.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}