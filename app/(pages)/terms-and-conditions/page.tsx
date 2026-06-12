"use client"

import { motion } from "framer-motion"
import { FileText, CheckCircle, Clock, AlertCircle, Award, GraduationCap, Briefcase, Scale, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex p-3 border-2 border-foreground mb-6">
            <FileText size={40} className="text-foreground" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="font-mono text-muted-foreground text-lg">
            Last Updated: December 2024
          </p>
        </motion.div>

        {/* Acceptance of Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-10 p-6 border-2 border-foreground bg-foreground"
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-background mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-background mb-2">
                Acceptance of Terms
              </h2>
              <p className="font-serif text-background leading-relaxed">
                By accessing or using CO-PROFILES (the &quot;Platform&quot;), you agree to be bound by these Terms & Conditions.
                If you disagree with any part of these terms, you may not access the Platform.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Eligibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Eligibility
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
              <li>Must be a student currently enrolled in a recognized educational institution</li>
              <li>Minimum 18 years of age or have parental/guardian consent</li>
              <li>Valid email address and phone number for communication</li>
              <li>Must provide accurate and truthful information in your profile</li>
              <li>Not be barred from internships under any applicable law</li>
            </ul>
          </div>
        </motion.div>

        {/* Compulsory Examination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Compulsory Examination
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6 space-y-4">
            <p className="text-muted-foreground font-serif">All applicants must complete and pass the compulsory examination to qualify for any internship position.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="border-2 border-foreground p-4">
                <p className="font-mono text-foreground font-bold text-sm mb-2">Exam Rules:</p>
                <ul className="list-disc list-inside text-muted-foreground font-serif text-sm space-y-1">
                  <li>Exam must be taken individually</li>
                  <li>No external help or cheating allowed</li>
                  <li>Minimum passing score: 60%</li>
                  <li>Maximum 3 attempts allowed</li>
                  <li>Results valid for 6 months</li>
                </ul>
              </div>
              <div className="border-2 border-foreground p-4">
                <p className="font-mono text-foreground font-bold text-sm mb-2">Consequences of Failure:</p>
                <ul className="list-disc list-inside text-muted-foreground font-serif text-sm space-y-1">
                  <li>Cannot apply for internships</li>
                  <li>Must wait 30 days for retake</li>
                  <li>No certificate will be issued</li>
                  <li>Profile remains inactive</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Internship Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Internship Terms
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6 space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Duration & Commitment</h3>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
                <li>Minimum 2 months, maximum 6 months per internship</li>
                <li>Minimum 20 hours per week commitment required</li>
                <li>Flexible timings but must meet weekly deadlines</li>
                <li>Regular check-ins with mentors required</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Performance Expectations</h3>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
                <li>Complete assigned projects on time</li>
                <li>Maintain professional communication</li>
                <li>Attend all mandatory meetings and reviews</li>
                <li>Submit weekly progress reports</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Termination</h3>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
                <li>SQROCK reserves right to terminate internship for poor performance</li>
                <li>Student may terminate with 2 weeks notice</li>
                <li>No certificate issued if terminated before completion</li>
                <li>Violation of terms leads to immediate termination</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Certificate Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Certificate Terms
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6 space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Basic Certificate (Auto-Generated)</h3>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
                <li>Issued automatically upon internship completion</li>
                <li>Includes: Student name, internship role, duration, completion date</li>
                <li>Downloadable from your dashboard</li>
                <li>Verifiable via unique certificate ID</li>
                <li>No fee for basic certificate</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Custom Certificate</h3>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
                <li>Available upon request via email: <Link href="mailto:hr@sqrock.cloud" className="text-foreground underline">hr@sqrock.cloud</Link></li>
                <li>Processing time: 5-7 business days</li>
                <li>Custom fields available upon request</li>
                <li>Nominal processing fee may apply for physical copies</li>
              </ul>
            </div>

            <div className="border-2 border-foreground p-4 mt-3">
              <p className="text-muted-foreground font-serif text-sm">
                <span className="font-mono font-bold text-foreground">Important:</span> Certificates are only issued to students who successfully complete the internship
                and pass the compulsory examination. SQROCK reserves the right to revoke certificates if fraud is discovered.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Student Code of Conduct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Scale size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Code of Conduct
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
              <li>Be respectful to mentors, coordinators, and fellow interns</li>
              <li>No plagiarism or copying others&apos; work</li>
              <li>Do not share exam questions or answers with others</li>
              <li>Keep confidential information private</li>
              <li>Do not harass, bully, or discriminate against anyone</li>
              <li>Report any misconduct to <Link href="mailto:conduct@sqrock.com" className="text-foreground underline">conduct@sqrock.com</Link></li>
              <li>Follow all instructions from your assigned mentor</li>
            </ul>
          </div>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Data & Privacy
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <p className="text-muted-foreground font-serif mb-3">
              Your use of the Platform is also governed by our <Link href="/privacy-policy" className="text-foreground underline">Privacy Policy</Link>.
            </p>
            <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
              <li>Your resume, email, and phone number may be shared with hiring partners</li>
              <li>You can opt-out of data sharing at any time</li>
              <li>You have the right to delete your account and all associated data</li>
              <li>SQROCK is not responsible for how hiring partners use your data</li>
            </ul>
          </div>
        </motion.div>

        {/* Intellectual Property */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Intellectual Property
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
              <li>All platform content, logos, and designs are property of SQROCK IT Solutions</li>
              <li>Projects completed during internship are property of SQROCK unless specified otherwise</li>
              <li>You retain rights to your personal portfolio and resume</li>
              <li>Do not copy or distribute platform content without permission</li>
            </ul>
          </div>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="mb-10 p-6 border-2 border-foreground"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground mb-3">
            Limitation of Liability
          </h2>
          <p className="text-muted-foreground font-serif text-sm leading-relaxed">
            SQROCK IT Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
            use of the platform or internship participation. We do not guarantee job placement after internship completion.
          </p>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          className="mb-10 p-6 border-2 border-foreground bg-foreground"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} className="text-background" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-background">
              Contact Us
            </h2>
          </div>
          <p className="text-background font-serif mb-4">
            For questions about these Terms & Conditions:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-background" />
              <a href="mailto:legal@sqrock.cloud" className="text-background underline font-mono">
                legal@sqrock.cloud
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-background" />
              <a href="tel:+918619819400" className="text-background underline font-mono">
                +91 86198 19400
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-background" />
              <span className="text-background font-mono text-sm">Monday-Friday, 10 AM - 6 PM IST</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          className="text-center pt-8 border-t-2 border-foreground space-y-4"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy-policy" className="font-mono text-muted-foreground text-sm uppercase tracking-wide transition-all duration-100 hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="font-mono text-foreground text-sm uppercase tracking-wide">
              Terms & Conditions
            </Link>
            <Link href="/#contact" className="font-mono text-muted-foreground text-sm uppercase tracking-wide transition-all duration-100 hover:text-foreground">
              Contact
            </Link>
          </div>
          <Link href="/" className="font-mono inline-block text-foreground underline text-sm uppercase tracking-wide transition-all duration-100">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
