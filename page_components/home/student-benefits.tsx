"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Search, Bell, FileText, TrendingUp, Users, MessageSquare, Award, Zap } from "lucide-react"

const benefits = [
  { icon: Search, title: "Discover Opportunities", description: "Find internships and jobs matching your skills" },
  { icon: Bell, title: "Stay Updated", description: "Receive instant notifications for new opportunities" },
  { icon: FileText, title: "Track Applications", description: "Monitor your application status in real-time" },
  { icon: TrendingUp, title: "Build Visibility", description: "Create a compelling profile that stands out" },
  { icon: Users, title: "Direct Connection", description: "Connect with companies directly" },
  { icon: MessageSquare, title: "Quick Communication", description: "Get updates via WhatsApp and email" },
  { icon: Award, title: "Showcase Skills", description: "Display projects, certifications, and achievements" },
  { icon: Zap, title: "Fast-track Career", description: "Accelerate your career growth" },
]

export function StudentBenefits() {
  return (
    <section className="py-32 px-6 bg-background">
      <div className="h-1 bg-foreground mb-32 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
              For Students
            </p>
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6">
              Launch Your<br />Career
            </h2>
            <div className="w-16 h-px bg-foreground mb-6" />
            <p className="text-muted-foreground text-lg leading-relaxed font-serif mb-8">
              Discover opportunities, showcase your skills, and connect with top companies looking for talent like you.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border border-foreground/20 p-4 hover:border-foreground transition-colors duration-100"
                >
                  <benefit.icon size={20} className="text-foreground mb-2" />
                  <h3 className="font-serif text-sm font-bold text-foreground">{benefit.title}</h3>
                  <p className="font-serif text-xs text-muted-foreground mt-1">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="border-2 border-foreground p-8 bg-background">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border-2 border-foreground flex items-center justify-center">
                    <span className="font-serif text-xl font-bold">PS</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">Priya Sharma</h3>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Computer Science &bull; 3rd Year</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Applications", value: "12" },
                    { label: "Shortlisted", value: "5" },
                    { label: "Interviews", value: "3" },
                    { label: "Offers", value: "2" },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-foreground/20 p-4 text-center">
                      <div className="font-serif text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    { skill: "React", level: 85 },
                    { skill: "Node.js", level: 75 },
                    { skill: "Python", level: 90 },
                  ].map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <span className="text-foreground uppercase tracking-widest">{skill.skill}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-foreground/10">
                        <div
                          className="h-full bg-foreground transition-all duration-100"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
