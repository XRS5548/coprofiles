// components/floating-cards.tsx
'use client'

import { motion } from 'framer-motion'
import { 
  FileText, CheckCircle, BarChart3, MessageSquare, 
  CreditCard, TrendingUp, Users, Hash 
} from 'lucide-react'

const floatingItems = [
  { icon: FileText, label: 'Applications', value: '1,234', color: 'from-blue-500 to-cyan-500', delay: 0 },
  { icon: CheckCircle, label: 'Shortlisted', value: '456', color: 'from-green-500 to-emerald-500', delay: 0.2 },
  { icon: BarChart3, label: 'Exam Scores', value: '89%', color: 'from-purple-500 to-pink-500', delay: 0.4 },
  { icon: MessageSquare, label: 'WhatsApp Sent', value: '5,678', color: 'from-yellow-500 to-orange-500', delay: 0.6 },
  { icon: CreditCard, label: 'Payments', value: '$45K', color: 'from-indigo-500 to-purple-500', delay: 0.8 },
  { icon: TrendingUp, label: 'Performance', value: '92%', color: 'from-red-500 to-pink-500', delay: 1.0 },
  { icon: Users, label: 'Candidates', value: '789', color: 'from-teal-500 to-green-500', delay: 1.2 },
  { icon: Hash, label: 'Roll Numbers', value: '234', color: 'from-orange-500 to-red-500', delay: 1.4 },
]

export function FloatingCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="relative mt-20"
    >
      {/* Main Dashboard Card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-[#18181B] border border-[#3F3F46] p-8 max-w-4xl mx-auto relative"
        style={{ borderRadius: '4px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
        
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8 relative">
          <div>
            <h3 className="text-2xl font-bold text-[#FAFAFA] uppercase">Hiring Dashboard</h3>
            <p className="text-[#A1A1AA] text-sm">Real-time analytics overview</p>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {floatingItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 + item.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="border border-[#3F3F46] bg-[#09090B] p-4 cursor-pointer transition-all"
              style={{ borderRadius: '4px' }}
            >
              <div className={`inline-flex p-2 rounded-sm bg-gradient-to-br ${item.color} mb-3`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs text-[#A1A1AA]">{item.label}</div>
              <div className="text-lg font-bold text-[#FAFAFA] mt-1">{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart Mock */}
        <div className="mt-8 flex items-end space-x-2 h-32 relative">
          {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 1, delay: 2.5 + index * 0.1 }}
              className="flex-1 bg-gradient-to-t from-[#DFE104]/30 to-[#DFE104]/10 rounded-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Mini Cards */}
      {[
        { position: 'top-20 -left-16', icon: FileText, label: 'New Application', color: 'from-blue-500' },
        { position: 'top-1/2 -left-20', icon: CheckCircle, label: 'Hired!', color: 'from-green-500' },
        { position: 'top-32 -right-16', icon: CreditCard, label: 'Payment Received', color: 'from-yellow-500' },
        { position: 'top-3/4 -right-20', icon: MessageSquare, label: 'WhatsApp Alert', color: 'from-purple-500' },
      ].map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 3 + index * 0.2 }}
          className={`absolute hidden lg:block ${card.position}`}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
              ease: 'easeInOut'
            }}
            className="border border-[#3F3F46] bg-[#09090B] p-3 flex items-center space-x-3"
            style={{ borderRadius: '4px' }}
          >
            <div className={`p-2 rounded-sm bg-gradient-to-br ${card.color} to-transparent`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-[#FAFAFA] whitespace-nowrap uppercase">{card.label}</span>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}