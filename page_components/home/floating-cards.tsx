 "use client"

import { motion } from "framer-motion"
import {
  FileText,
  CheckCircle,
  BarChart3,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Users,
  Hash,
} from "lucide-react"

const floatingItems = [
  {
    icon: FileText,
    label: "Applications",
    value: "1,234",
    delay: 0,
  },
  {
    icon: CheckCircle,
    label: "Shortlisted",
    value: "456",
    delay: 0.2,
  },
  {
    icon: BarChart3,
    label: "Exam Scores",
    value: "89%",
    delay: 0.4,
  },
  {
    icon: MessageSquare,
    label: "WhatsApp Sent",
    value: "5,678",
    delay: 0.6,
  },
  {
    icon: CreditCard,
    label: "Payments",
    value: "$45K",
    delay: 0.8,
  },
  {
    icon: TrendingUp,
    label: "Performance",
    value: "92%",
    delay: 1.0,
  },
  {
    icon: Users,
    label: "Candidates",
    value: "789",
    delay: 1.2,
  },
  {
    icon: Hash,
    label: "Roll Numbers",
    value: "234",
    delay: 1.4,
  },
]

export function FloatingCards() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-32">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[14vw] font-black uppercase tracking-tight text-[#CD7F32]/5 select-none">
          ANALYTICS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="block text-xs uppercase tracking-[0.35em] text-[#CD7F32]">
            LIVE DASHBOARD
          </span>

          <h2 className="mt-4 font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#CD7F32]">
            Hiring Analytics
          </h2>

          <div className="w-20 h-px bg-[#CD7F32]/50 mx-auto mt-6" />

          <p className="max-w-2xl mx-auto mt-8 text-lg leading-8 text-white/70">
            Track applications, exams, candidate performance, and hiring
            activities through an intelligent analytics dashboard.
          </p>
        </motion.div>

        {/* Dashboard Card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-[#CD7F32]/20 bg-[#0A0A0A] p-8 md:p-10 shadow-[0_0_40px_rgba(205,127,50,0.08)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-[#CD7F32]">
                Hiring Dashboard
              </h3>

              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">
                Real-Time Analytics Overview
              </p>
            </div>

            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full border border-[#CD7F32]/50" />
              <div className="h-3 w-3 rounded-full border border-[#CD7F32]/50" />
              <div className="h-3 w-3 rounded-full bg-[#CD7F32]" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {floatingItems.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: item.delay,
                }}
                className="group rounded-2xl border border-[#CD7F32]/15 bg-[#111111] p-5 transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_20px_rgba(205,127,50,0.1)]"
              >
                <item.icon
                  size={18}
                  className="mb-3 text-[#CD7F32]"
                />

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {item.label}
                </p>

                <h4 className="mt-2 font-serif text-2xl font-bold text-[#CD7F32]">
                  {item.value}
                </h4>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="mt-12">
            <div className="flex items-end gap-3 h-40">
              {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50].map(
                (height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + index * 0.08,
                    }}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-[#CD7F32] to-[#E6A75A]"
                  />
                )
              )}
            </div>

            <div className="mt-6 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}