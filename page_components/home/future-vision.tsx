 "use client"

import { motion } from "framer-motion"
import {
  Brain,
  Sparkles,
  ShoppingBag,
  Cog,
  TrendingUp,
  BarChart3,
} from "lucide-react"

const futureFeatures = [
  {
    icon: Brain,
    title: "AI Candidate Analysis",
    description:
      "Intelligent candidate evaluation using advanced machine learning algorithms and behavioral insights.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description:
      "AI-powered hiring recommendations tailored to company goals and talent requirements.",
  },
  {
    icon: ShoppingBag,
    title: "Freelancer Marketplace",
    description:
      "Connect with freelancers, agencies, and service providers through a unified ecosystem.",
  },
  {
    icon: Cog,
    title: "Advanced Automation",
    description:
      "Automate hiring workflows, screening processes, onboarding, and candidate communication.",
  },
  {
    icon: TrendingUp,
    title: "Performance Intelligence",
    description:
      "Predictive analytics to identify top-performing candidates and future talent trends.",
  },
  {
    icon: BarChart3,
    title: "AI Exam Analytics",
    description:
      "Gain deep insights into exam performance, strengths, weaknesses, and candidate potential.",
  },
]

export function FutureVision() {
  return (
    <section className="relative overflow-hidden bg-black py-32 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="select-none text-[14vw] font-black uppercase tracking-tight text-[#CD7F32]/5">
          FUTURE
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
            COMING SOON
          </span>

          <h2 className="mt-4 font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#CD7F32]">
            Future Vision
          </h2>

          <div className="mx-auto mt-6 h-px w-20 bg-[#CD7F32]/50" />

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Building the next generation of intelligent hiring through AI,
            automation, predictive analytics, and advanced talent discovery.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="group rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-8 transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_30px_rgba(205,127,50,0.12)]"
            >
              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#CD7F32]/20 bg-[#111111]">
                <feature.icon
                  size={26}
                  className="text-[#CD7F32]"
                />
              </div>

              {/* Title */}
              <h3 className="mb-4 font-serif text-2xl font-bold text-[#CD7F32]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="leading-7 text-white/65">
                {feature.description}
              </p>

              {/* Status */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#CD7F32]" />

                <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                  In Development
                </span>
              </div>

              {/* Bottom Accent */}
              <div className="mt-6 h-px w-12 bg-[#CD7F32]/30 transition-all duration-300 group-hover:w-24 group-hover:bg-[#CD7F32]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}