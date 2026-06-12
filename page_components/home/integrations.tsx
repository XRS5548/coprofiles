"use client"

import { motion } from "framer-motion"
import { MessageSquare, Mail, CreditCard, Code, Database, Cloud } from "lucide-react"

const integrations = [
  { icon: MessageSquare, name: "WhatsApp Business", description: "Automated notifications and candidate communication" },
  { icon: Mail, name: "Nodemailer", description: "Automated email responses and notifications" },
  { icon: CreditCard, name: "Razorpay/Stripe", description: "Secure payment collection and processing" },
  { icon: Code, name: "REST APIs", description: "Custom integrations and webhook support" },
  { icon: Database, name: "ExaminerMax", description: "Secure exam platform with analytics" },
  { icon: Cloud, name: "Cloud Storage", description: "Secure document and data storage" },
]

export function Integrations() {
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
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Integrations
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            Seamless Integrations
          </h2>
          <div className="w-16 h-px bg-foreground mx-auto mt-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 font-serif">
            Integrate with your favorite tools and services for a seamless workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group border-2 border-foreground p-8 text-center bg-background transition-colors duration-100 hover:bg-foreground hover:text-background cursor-pointer"
            >
              <integration.icon size={32} className="text-foreground group-hover:text-background transition-colors duration-100 mb-6 mx-auto" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-background transition-colors duration-100 mb-3">
                {integration.name}
              </h3>
              <p className="text-muted-foreground group-hover:text-background/80 transition-colors duration-100 font-serif">
                {integration.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
