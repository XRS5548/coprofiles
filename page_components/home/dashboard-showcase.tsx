// components/dashboard-showcase.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  BarChart3, TrendingUp, Users, Target, 
  Activity, Award, Clock, Zap
} from 'lucide-react'

export function DashboardShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
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
            <span className="gradient-text">Advanced Dashboard</span>
            <br />
            <span className="text-white">Powerful Analytics</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitor your hiring pipeline with real-time analytics and intelligent insights.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analytics Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 glass rounded-3xl p-8 glow"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Hiring Analytics</h3>
                <p className="text-gray-400 text-sm">Last 30 days performance</p>
              </div>
              <div className="flex space-x-2">
                {['1W', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      period === '1M'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end space-x-2">
              {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90].map((height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-purple-500/20 to-blue-500/20 rounded-t-lg relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded">
                    {height}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {[
              { icon: Users, label: 'Total Candidates', value: '2,847', change: '+12.5%', color: 'from-purple-500 to-blue-500' },
              { icon: Target, label: 'Hired', value: '145', change: '+8.2%', color: 'from-green-500 to-emerald-500' },
              { icon: Clock, label: 'Time to Hire', value: '12 days', change: '-15%', color: 'from-yellow-500 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass rounded-2xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Row */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">Candidate Leaderboard</h3>
            <div className="space-y-4">
              {[
                { name: 'Rahul Kumar', score: 98, avatar: 'RK' },
                { name: 'Ananya Patel', score: 95, avatar: 'AP' },
                { name: 'Vikram Singh', score: 92, avatar: 'VS' },
                { name: 'Neha Gupta', score: 89, avatar: 'NG' },
              ].map((candidate, index) => (
                <div key={candidate.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                      {candidate.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium">{candidate.name}</div>
                      <div className="text-xs text-gray-400">Rank #{index + 1}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold gradient-text">{candidate.score}%</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">Activity Feed</h3>
            <div className="space-y-4">
              {[
                { action: 'New application received', time: '2 min ago', icon: Users },
                { action: 'Exam completed', time: '15 min ago', icon: Award },
                { action: 'Payment processed', time: '1 hour ago', icon: Zap },
                { action: 'Candidate shortlisted', time: '3 hours ago', icon: Target },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <activity.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">Automation Panel</h3>
            <div className="space-y-3">
              {[
                { name: 'Auto Shortlisting', status: 'Active' },
                { name: 'Email Notifications', status: 'Active' },
                { name: 'WhatsApp Alerts', status: 'Paused' },
                { name: 'Payment Reminders', status: 'Active' },
              ].map((automation) => (
                <div key={automation.name} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{automation.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    automation.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {automation.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}