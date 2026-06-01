// app/about/page.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Building2, Target, Users, Award, Rocket, Shield, GraduationCap, Briefcase, CheckCircle, Zap, Globe, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex p-3 border border-[#DFE104] mb-6">
            <Building2 size={40} className="text-[#DFE104]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-4">
            About SQROCK
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Building the next generation of tech talent through real-world experience
          </p>
        </motion.div>

        {/* Hero Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-4">
              Who We Are
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-4">
              SQROCK IT Solutions is a premier technology company dedicated to bridging the gap between 
              academic learning and industry requirements. We believe that true learning happens when 
              students work on real-world projects under expert mentorship.
            </p>
            <p className="text-[#A1A1AA] leading-relaxed">
              Our platform, <span className="text-[#DFE104] font-bold">CO-PROFILES</span>, is designed to help students build professional profiles, 
              gain hands-on experience, and secure meaningful employment opportunities.
            </p>
          </div>
          <div className="border border-[#3F3F46] p-8 bg-[#09090B]">
            <div className="text-6xl font-bold text-[#DFE104] mb-2">500+</div>
            <p className="text-[#FAFAFA] uppercase tracking-wide text-sm">Students Trained</p>
            <div className="w-12 h-px bg-[#3F3F46] my-4" />
            <div className="text-6xl font-bold text-[#DFE104] mb-2">1000+</div>
            <p className="text-[#FAFAFA] uppercase tracking-wide text-sm">Internships Completed</p>
            <div className="w-12 h-px bg-[#3F3F46] my-4" />
            <div className="text-6xl font-bold text-[#DFE104] mb-2">85%</div>
            <p className="text-[#FAFAFA] uppercase tracking-wide text-sm">Hired Within 3 Months</p>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-[#3F3F46] p-8"
          >
            <Target size={32} className="text-[#DFE104] mb-4" />
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-3">
              Our Mission
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              To empower students with practical skills, real-world project experience, and industry connections 
              that accelerate their career growth and make them job-ready from day one.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-[#3F3F46] p-8"
          >
            <Rocket size={32} className="text-[#DFE104] mb-4" />
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-3">
              Our Vision
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
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
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-3">
              Our Core Values
            </h2>
            <p className="text-[#A1A1AA]">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="inline-flex p-3 border border-[#DFE104] mb-4">
                <Users size={24} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
                Student First
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Every decision we make prioritizes student success and career growth.
              </p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="inline-flex p-3 border border-[#DFE104] mb-4">
                <Award size={24} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
                Excellence
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                We maintain the highest standards in training, mentorship, and project delivery.
              </p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="inline-flex p-3 border border-[#DFE104] mb-4">
                <Shield size={24} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
                Transparency
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Clear communication, honest feedback, and transparent processes.
              </p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="inline-flex p-3 border border-[#DFE104] mb-4">
                <Zap size={24} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
                Innovation
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Constantly evolving our platform and programs to meet industry needs.
              </p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="inline-flex p-3 border border-[#DFE104] mb-4">
                <Globe size={24} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
                Community
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Building a supportive ecosystem of learners, mentors, and employers.
              </p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="inline-flex p-3 border border-[#DFE104] mb-4">
                <Heart size={24} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
                Integrity
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Ethical practices in every aspect of our operations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What Makes Us Different */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-3">
              What Makes Us Different
            </h2>
            <p className="text-[#A1A1AA]">
              Why thousands of students choose SQROCK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 border border-[#3F3F46] p-6">
              <CheckCircle size={24} className="text-[#DFE104] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-1">Compulsory Exam System</h3>
                <p className="text-[#A1A1AA] text-sm">Ensures only serious, prepared candidates get internship opportunities.</p>
              </div>
            </div>
            <div className="flex gap-4 border border-[#3F3F46] p-6">
              <CheckCircle size={24} className="text-[#DFE104] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-1">Real Project Experience</h3>
                <p className="text-[#A1A1AA] text-sm">Work on actual client projects, not just dummy tasks.</p>
              </div>
            </div>
            <div className="flex gap-4 border border-[#3F3F46] p-6">
              <CheckCircle size={24} className="text-[#DFE104] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-1">Industry Mentorship</h3>
                <p className="text-[#A1A1AA] text-sm">Learn from experienced professionals working at top companies.</p>
              </div>
            </div>
            <div className="flex gap-4 border border-[#3F3F46] p-6">
              <CheckCircle size={24} className="text-[#DFE104] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-1">Placement Support</h3>
                <p className="text-[#A1A1AA] text-sm">Top performers get direct job offers and interview opportunities.</p>
              </div>
            </div>
            <div className="flex gap-4 border border-[#3F3F46] p-6">
              <CheckCircle size={24} className="text-[#DFE104] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-1">Verified Certificates</h3>
                <p className="text-[#A1A1AA] text-sm">Blockchain-verified certificates recognized by hiring partners.</p>
              </div>
            </div>
            <div className="flex gap-4 border border-[#3F3F46] p-6">
              <CheckCircle size={24} className="text-[#DFE104] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-1">Data Privacy First</h3>
                <p className="text-[#A1A1AA] text-sm">Your personal data is never shared without your explicit consent.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leadership Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-3">
              Leadership Team
            </h2>
            <p className="text-[#A1A1AA]">
              Driven by passion for education and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 border border-[#DFE104] rounded-full flex items-center justify-center bg-[#DFE104]/5">
                <Users size={40} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase text-[#FAFAFA] mb-1">Rohit Sharma</h3>
              <p className="text-[#DFE104] text-sm uppercase tracking-wide mb-3">CEO & Founder</p>
              <p className="text-[#A1A1AA] text-xs">10+ years in EdTech & Software Development</p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 border border-[#DFE104] rounded-full flex items-center justify-center bg-[#DFE104]/5">
                <GraduationCap size={40} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase text-[#FAFAFA] mb-1">Priya Singh</h3>
              <p className="text-[#DFE104] text-sm uppercase tracking-wide mb-3">Head of Learning</p>
              <p className="text-[#A1A1AA] text-xs">Former Senior Engineer at Google</p>
            </div>

            <div className="border border-[#3F3F46] p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 border border-[#DFE104] rounded-full flex items-center justify-center bg-[#DFE104]/5">
                <Briefcase size={40} className="text-[#DFE104]" />
              </div>
              <h3 className="text-lg font-bold uppercase text-[#FAFAFA] mb-1">Amit Verma</h3>
              <p className="text-[#DFE104] text-sm uppercase tracking-wide mb-3">Head of Placements</p>
              <p className="text-[#A1A1AA] text-xs">Ex-Microsoft, 8+ years in Talent Acquisition</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border border-[#DFE104] p-12 text-center bg-[#DFE104]/5"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-[#A1A1AA] mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with SQROCK
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#internships"
              className="px-8 py-3 bg-[#DFE104] text-black font-bold uppercase tracking-wide hover:bg-[#DFE104]/90 transition-all duration-200"
            >
              Explore Internships
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-[#3F3F46] text-[#FAFAFA] font-bold uppercase tracking-wide hover:border-[#DFE104] hover:text-[#DFE104] transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/" className="inline-flex items-center gap-1 text-[#A1A1AA] hover:text-[#DFE104] transition-colors text-sm uppercase tracking-wide">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}