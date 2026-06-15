 "use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Users, Target, Clock } from "lucide-react"

export function DashboardShowcase() {
  const [activePeriod, setActivePeriod] = useState("1M")
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-32 px-6 bg-black relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-20"
        >
          <p className="text-[#CD7F32] text-xs uppercase tracking-[0.35em] mb-4">
            Analytics
          </p>

          <h2 className="font-serif text-5xl md:text-7xl font-bold text-white">
            Advanced Dashboard
          </h2>

          <div className="w-20 h-[1px] bg-[#CD7F32]/50 mx-auto mt-6" />

          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-6">
            Monitor hiring pipeline with real-time insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 border border-[#CD7F32]/20 bg-[#0A0A0A] p-8"
          >
            <div className="flex items-center justify-between mb-8">

              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Hiring Analytics
                </h3>
                <p className="text-xs text-white/50 uppercase tracking-widest">
                  Last 30 days performance
                </p>
              </div>

              {/* Period buttons */}
              <div className="flex gap-2">
                {["1W", "1M", "3M", "1Y"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`px-3 py-1 text-xs border transition
                      ${
                        period === activePeriod
                          ? "bg-[#CD7F32] text-black border-[#CD7F32]"
                          : "text-white/60 border-[#CD7F32]/20 hover:border-[#CD7F32]/50"
                      }
                    `}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Bars */}
            <div className="h-64 flex items-end gap-2">
              {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex-1 bg-white/10 hover:bg-[#CD7F32]/40 transition relative group"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs bg-black border border-[#CD7F32]/30 text-[#CD7F32] px-2 py-1">
                    {height}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {[
              { icon: Users, label: "Total Candidates", value: "2,847", change: "+12.5%" },
              { icon: Target, label: "Hired", value: "145", change: "+8.2%" },
              { icon: Clock, label: "Time to Hire", value: "12 days", change: "-15%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-[#CD7F32]/20 bg-[#0A0A0A] p-6 hover:border-[#CD7F32]/50 hover:bg-[#111111] transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon
                    size={20}
                    className="text-white/70 group-hover:text-[#CD7F32] transition"
                  />
                  <span className="text-xs text-white/50 group-hover:text-[#CD7F32] transition">
                    {stat.change}
                  </span>
                </div>

                <div className="font-serif text-3xl font-bold text-white group-hover:text-[#CD7F32] transition">
                  {stat.value}
                </div>

                <div className="text-xs text-white/40 uppercase tracking-widest group-hover:text-white/70 transition">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}