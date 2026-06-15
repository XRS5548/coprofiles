 "use client"

import { motion } from "framer-motion"
import {
  Search,
  Bell,
  FileText,
  TrendingUp,
  Users,
  MessageSquare,
  Award,
  Zap,
} from "lucide-react"

const benefits = [
  {
    icon: Search,
    title: "Discover Opportunities",
    description: "Find internships and jobs matching your skills",
  },
  {
    icon: Bell,
    title: "Stay Updated",
    description: "Receive instant notifications for new opportunities",
  },
  {
    icon: FileText,
    title: "Track Applications",
    description: "Monitor your application status in real-time",
  },
  {
    icon: TrendingUp,
    title: "Build Visibility",
    description: "Create a compelling profile that stands out",
  },
  {
    icon: Users,
    title: "Direct Connection",
    description: "Connect with companies directly",
  },
  {
    icon: MessageSquare,
    title: "Quick Communication",
    description: "Get updates via WhatsApp and email",
  },
  {
    icon: Award,
    title: "Showcase Skills",
    description: "Display projects, certifications, and achievements",
  },
  {
    icon: Zap,
    title: "Fast-track Career",
    description: "Accelerate your career growth",
  },
]

export function StudentBenefits() {
  return (
    <section className="relative overflow-hidden bg-black py-32 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="select-none text-[14vw] font-black uppercase tracking-tight text-[#CD7F32]/5">
          STUDENTS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="block text-xs uppercase tracking-[0.35em] text-[#CD7F32] mb-4">
              FOR STUDENTS
            </span>

            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#CD7F32] mb-6">
              Launch Your
              <br />
              Career
            </h2>

            <div className="w-20 h-px bg-[#CD7F32]/50 mb-6" />

            <p className="text-white/70 text-lg leading-8 max-w-xl mb-10">
              Discover opportunities, showcase your skills, build your
              professional profile, and connect directly with companies
              looking for talented candidates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  className="rounded-xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-5 transition-all duration-300 hover:border-[#CD7F32]/40 hover:shadow-[0_0_20px_rgba(205,127,50,0.12)]"
                >
                  <benefit.icon
                    size={20}
                    className="text-[#CD7F32] mb-3"
                  />

                  <h3 className="font-serif text-sm font-bold text-[#CD7F32]">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/60">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl border border-[#CD7F32]/20 bg-[#0A0A0A] p-8 shadow-[0_0_35px_rgba(205,127,50,0.08)]">
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#CD7F32]/20 bg-[#111111]">
                    <span className="font-serif text-xl font-bold text-[#CD7F32]">
                      PS
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#CD7F32]">
                      Priya Sharma
                    </h3>

                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                      Computer Science • 3rd Year
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Applications", value: "12" },
                    { label: "Shortlisted", value: "5" },
                    { label: "Interviews", value: "3" },
                    { label: "Offers", value: "2" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-[#CD7F32]/15 bg-[#111111] p-4 text-center"
                    >
                      <div className="font-serif text-3xl font-bold text-[#CD7F32]">
                        {stat.value}
                      </div>

                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-5">
                  {[
                    { skill: "React", level: 85 },
                    { skill: "Node.js", level: 75 },
                    { skill: "Python", level: 90 },
                    { skill: "Next.js", level: 80 },
                  ].map((skill) => (
                    <div key={skill.skill}>
                      <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.15em]">
                        <span className="text-[#CD7F32]">
                          {skill.skill}
                        </span>

                        <span className="text-white/50">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-[#CD7F32]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#CD7F32] transition-all duration-700"
                          style={{
                            width: `${skill.level}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className="rounded-full border border-[#CD7F32]/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#CD7F32]">
                    Top Candidate
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}