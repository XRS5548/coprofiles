"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Building2, Target, Rocket, Users, Award, Shield, Zap, Globe, Heart, CheckCircle, GraduationCap, Briefcase } from "lucide-react"
import Link from "next/link"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.1, delay },
})

export default function AboutPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp()} className="mb-16 text-center">
          <div className="inline-flex p-3 border-2 border-foreground mb-6">
            <Building2 size={40} className="text-foreground" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
            About SQROCK
          </h1>
          <p className="font-serif text-muted-foreground text-lg max-w-2xl mx-auto">
            Building the next generation of tech talent through real-world experience
          </p>
        </motion.div>

        {/* Hero Story */}
        <motion.div {...fadeUp(0.1)} className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
              Who We Are
            </h2>
            <p className="font-serif text-muted-foreground leading-relaxed mb-4">
              SQROCK IT Solutions is a premier technology company dedicated to bridging the gap between
              academic learning and industry requirements. We believe that true learning happens when
              students work on real-world projects under expert mentorship.
            </p>
            <p className="font-serif text-muted-foreground leading-relaxed">
              Our platform, <span className="text-foreground font-bold">CO-PROFILES</span>, is designed to help students build professional profiles,
              gain hands-on experience, and secure meaningful employment opportunities.
            </p>
          </div>
          <div className="border-2 border-foreground p-8 bg-background">
            <div className="font-serif text-6xl font-bold text-foreground mb-2">500+</div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">Students Trained</p>
            <div className="w-16 h-px bg-foreground my-4" />
            <div className="font-serif text-6xl font-bold text-foreground mb-2">1000+</div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">Internships Completed</p>
            <div className="w-16 h-px bg-foreground my-4" />
            <div className="font-serif text-6xl font-bold text-foreground mb-2">85%</div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">Hired Within 3 Months</p>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, delay: 0.2 }}
            className="group border-2 border-foreground p-8 hover:bg-foreground hover:text-background transition-colors duration-100"
          >
            <Target size={32} className="text-foreground mb-4 group-hover:text-background transition-colors duration-100" />
            <h2 className="font-serif text-2xl font-bold tracking-tighter text-foreground mb-3 group-hover:text-background transition-colors duration-100">
              Our Mission
            </h2>
            <p className="font-serif text-muted-foreground leading-relaxed group-hover:text-background transition-colors duration-100">
              To empower students with practical skills, real-world project experience, and industry connections
              that accelerate their career growth and make them job-ready from day one.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, delay: 0.3 }}
            className="group border-2 border-foreground p-8 hover:bg-foreground hover:text-background transition-colors duration-100"
          >
            <Rocket size={32} className="text-foreground mb-4 group-hover:text-background transition-colors duration-100" />
            <h2 className="font-serif text-2xl font-bold tracking-tighter text-foreground mb-3 group-hover:text-background transition-colors duration-100">
              Our Vision
            </h2>
            <p className="font-serif text-muted-foreground leading-relaxed group-hover:text-background transition-colors duration-100">
              To become India's most trusted platform for internship and hiring, creating a seamless bridge
              between talented students and innovative companies looking for skilled professionals.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.1 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-3">
              Our Core Values
            </h2>
            <p className="font-serif text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Student First", desc: "Every decision we make prioritizes student success and career growth." },
              { icon: Award, title: "Excellence", desc: "We maintain the highest standards in training, mentorship, and project delivery." },
              { icon: Shield, title: "Transparency", desc: "Clear communication, honest feedback, and transparent processes." },
              { icon: Zap, title: "Innovation", desc: "Constantly evolving our platform and programs to meet industry needs." },
              { icon: Globe, title: "Community", desc: "Building a supportive ecosystem of learners, mentors, and employers." },
              { icon: Heart, title: "Integrity", desc: "Ethical practices in every aspect of our operations." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.1, delay: i * 0.05 }}
                className="group border-2 border-foreground p-8 text-center hover:bg-foreground hover:text-background transition-colors duration-100"
              >
                <div className="inline-flex p-3 border-2 border-foreground mb-4 group-hover:border-background transition-colors duration-100">
                  <item.icon size={24} className="text-foreground group-hover:text-background transition-colors duration-100" />
                </div>
                <h3 className="font-serif text-lg font-bold tracking-tighter text-foreground mb-2 group-hover:text-background transition-colors duration-100">
                  {item.title}
                </h3>
                <p className="font-serif text-muted-foreground text-sm group-hover:text-background transition-colors duration-100">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What Makes Us Different */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.1, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-3">
              What Makes Us Different
            </h2>
            <p className="font-serif text-muted-foreground">
              Why thousands of students choose SQROCK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Compulsory Exam System", desc: "Ensures only serious, prepared candidates get internship opportunities." },
              { title: "Real Project Experience", desc: "Work on actual client projects, not just dummy tasks." },
              { title: "Industry Mentorship", desc: "Learn from experienced professionals working at top companies." },
              { title: "Placement Support", desc: "Top performers get direct job offers and interview opportunities." },
              { title: "Verified Certificates", desc: "Blockchain-verified certificates recognized by hiring partners." },
              { title: "Data Privacy First", desc: "Your personal data is never shared without your explicit consent." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.1, delay: i * 0.05 }}
                className="group flex gap-4 border-2 border-foreground p-8 hover:bg-foreground hover:text-background transition-colors duration-100"
              >
                <CheckCircle size={24} className="text-foreground flex-shrink-0 group-hover:text-background transition-colors duration-100" />
                <div>
                  <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-1 group-hover:text-background transition-colors duration-100">
                    {item.title}
                  </h3>
                  <p className="font-serif text-muted-foreground text-sm group-hover:text-background transition-colors duration-100">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leadership Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.1, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-3">
              Leadership Team
            </h2>
            <p className="font-serif text-muted-foreground">
              Driven by passion for education and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, name: "Rohit Sharma", role: "CEO & Founder", bio: "10+ years in EdTech & Software Development" },
              { icon: GraduationCap, name: "Priya Singh", role: "Head of Learning", bio: "Former Senior Engineer at Google" },
              { icon: Briefcase, name: "Amit Verma", role: "Head of Placements", bio: "Ex-Microsoft, 8+ years in Talent Acquisition" },
            ].map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.1, delay: i * 0.1 }}
                className="group border-2 border-foreground p-8 text-center hover:bg-foreground hover:text-background transition-colors duration-100"
              >
                <div className="w-24 h-24 mx-auto mb-4 border-2 border-foreground flex items-center justify-center group-hover:border-background transition-colors duration-100">
                  <person.icon size={40} className="text-foreground group-hover:text-background transition-colors duration-100" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-1 group-hover:text-background transition-colors duration-100">
                  {person.name}
                </h3>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-3 group-hover:text-background transition-colors duration-100">
                  {person.role}
                </p>
                <p className="font-serif text-muted-foreground text-xs group-hover:text-background transition-colors duration-100">
                  {person.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.1, delay: 0.4 }}
          className="border-2 border-foreground p-12 text-center bg-background"
        >
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="font-serif text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with SQROCK
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#internships"
              className="group px-8 py-3 border-2 border-foreground bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors duration-100"
            >
              Explore Internships
            </Link>
            <Link
              href="/contact"
              className="group px-8 py-3 border-2 border-foreground text-foreground font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-100"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-100 font-mono text-xs uppercase tracking-[0.2em]"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-100">&larr;</span> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
