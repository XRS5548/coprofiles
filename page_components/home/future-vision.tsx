"use client"

import { motion } from "framer-motion"
import { Brain, Sparkles, ShoppingBag, Cog, TrendingUp, BarChart3 } from "lucide-react"

const futureFeatures = [
  { icon: Brain, title: "AI Candidate Analysis", description: "Intelligent candidate evaluation using machine learning algorithms." },
  { icon: Sparkles, title: "Smart Recommendations", description: "AI-powered hiring recommendations based on company needs." },
  { icon: ShoppingBag, title: "Freelancer Marketplace", description: "Connect with freelancers and service providers seamlessly." },
  { icon: Cog, title: "Advanced Automation", description: "End-to-end hiring automation with custom workflows." },
  { icon: TrendingUp, title: "Performance Intelligence", description: "Predictive analytics for student and candidate performance." },
  { icon: BarChart3, title: "AI Exam Analytics", description: "Deep insights into exam patterns and candidate capabilities." },
]

export function FutureVision() {
  return (
    <section className="py-32 px-6 bg-background">
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-20"
        >
          <span className="inline-block font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Coming Soon
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Future Vision
          </h2>
          <div className="w-16 h-px bg-foreground mx-auto mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 font-serif">
            We&apos;re building the future of intelligent hiring with AI-powered tools and automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group border-2 border-foreground p-8 bg-background transition-colors duration-100 hover:bg-foreground hover:text-background"
            >
              <feature.icon size={24} className="text-foreground group-hover:text-background transition-colors duration-100 mb-6" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-background transition-colors duration-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-background/80 transition-colors duration-100 font-serif">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-foreground group-hover:bg-background transition-colors duration-100" />
                <span className="font-mono text-xs text-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest">
                  In Development
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
