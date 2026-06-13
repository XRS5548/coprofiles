"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Target, Clock } from "lucide-react"

export function DashboardShowcase() {
  const [activePeriod, setActivePeriod] = useState("1M")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-32 px-6 bg-background">
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Analytics
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Advanced Dashboard
          </h2>
          <div className="w-16 h-px bg-foreground mx-auto mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 font-serif">
            Monitor your hiring pipeline with real-time analytics and intelligent insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 border-2 border-foreground p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Hiring Analytics</h3>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Last 30 days performance</p>
              </div>
              <div className="flex gap-1">
                {["1W", "1M", "3M", "1Y"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`px-3 py-1 font-mono text-xs border ${
                      period === activePeriod ? "bg-foreground text-background border-foreground" : "text-muted-foreground border-foreground/20 hover:border-foreground"
                    } transition-colors duration-100`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 flex items-end gap-2">
              {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex-1 bg-foreground/20 relative group"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs text-foreground bg-background border border-foreground px-2 py-1">
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
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-2 border-foreground p-6 group hover:bg-foreground hover:text-background transition-colors duration-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon size={20} className="text-foreground group-hover:text-background transition-colors duration-100" />
                  <span className={`font-mono text-xs ${stat.change.startsWith("+") ? "text-foreground" : "text-foreground"} group-hover:text-background/80 transition-colors duration-100`}>
                    {stat.change}
                  </span>
                </div>
                <div className="font-serif text-3xl font-bold text-foreground group-hover:text-background transition-colors duration-100">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest">
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
