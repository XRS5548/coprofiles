"use client"

import { motion } from "framer-motion"
import { FileText, CheckCircle, BarChart3, MessageSquare, CreditCard, TrendingUp, Users, Hash } from "lucide-react"

const floatingItems = [
  { icon: FileText, label: "Applications", value: "1,234", delay: 0 },
  { icon: CheckCircle, label: "Shortlisted", value: "456", delay: 0.2 },
  { icon: BarChart3, label: "Exam Scores", value: "89%", delay: 0.4 },
  { icon: MessageSquare, label: "WhatsApp Sent", value: "5,678", delay: 0.6 },
  { icon: CreditCard, label: "Payments", value: "$45K", delay: 0.8 },
  { icon: TrendingUp, label: "Performance", value: "92%", delay: 1.0 },
  { icon: Users, label: "Candidates", value: "789", delay: 1.2 },
  { icon: Hash, label: "Roll Numbers", value: "234", delay: 1.4 },
]

export function FloatingCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="relative mt-20"
    >
      <motion.div
        className="border-2 border-foreground bg-background p-8 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-foreground uppercase tracking-tight">
              Hiring Dashboard
            </h3>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Real-time analytics overview</p>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 border border-foreground" />
            <div className="w-3 h-3 border border-foreground" />
            <div className="w-3 h-3 border border-foreground bg-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {floatingItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.8 + item.delay }}
              className="border border-foreground/20 bg-background p-4 group hover:border-foreground transition-colors duration-100"
            >
              <item.icon size={16} className="text-foreground mb-3" />
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{item.label}</div>
              <div className="font-serif text-xl font-bold text-foreground mt-1">{item.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-end gap-2 h-32">
          {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: 2.5 + index * 0.05 }}
              className="flex-1 bg-foreground/20"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
