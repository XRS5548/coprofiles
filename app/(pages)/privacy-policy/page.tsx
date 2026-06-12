"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, Mail, Phone, FileText, Building } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex p-3 border-2 border-foreground mb-6">
            <Shield size={40} className="text-foreground" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="font-mono text-muted-foreground text-lg">
            Last Updated: December 2024
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-10 border-2 border-foreground p-6 bg-muted"
        >
          <p className="font-serif text-muted-foreground leading-relaxed">
            At <span className="text-foreground font-bold">CO-PROFILES by SQROCK IT Solutions</span>, we take your privacy seriously.
            This policy explains how we collect, use, and share your information when you use our internship and hiring platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              What Data We Collect
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6 space-y-4">
            <div>
              <h3 className="font-mono text-lg font-bold text-foreground mb-2">Student Profile Data</h3>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
                <li>Full Name & Contact Information (Email, Phone Number)</li>
                <li>Resume/CV & Professional Portfolio Links</li>
                <li>Educational Background & Skills</li>
                <li>Exam Scores & Assessment Results</li>
                <li>Project Work & Internship History</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Eye size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              How We Use Your Data
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6 space-y-4">
            <p className="font-serif text-muted-foreground">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
              <li>Process your internship applications</li>
              <li>Conduct compulsory examinations and assessments</li>
              <li>Generate internship certificates upon completion</li>
              <li>Match you with relevant job opportunities</li>
              <li>Share your profile with hiring partners (limited data)</li>
              <li>Communicate important updates about your application</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mb-10 border-2 border-foreground p-6 bg-foreground text-background"
        >
          <div className="flex items-center gap-3 mb-4">
            <Building size={24} className="text-background" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-background">
              Data Shared With Hiring Partners
            </h2>
          </div>

          <div className="space-y-4">
            <p className="font-serif font-bold text-background">ONLY the following information is shared with other companies for hiring purposes:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border-2 border-background p-4 bg-background text-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-foreground" />
                  <span className="font-mono text-foreground font-bold text-sm">Shared ✓</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground font-serif">
                  <li>• Resume/CV</li>
                  <li>• Email Address</li>
                  <li>• Phone Number</li>
                  <li>• Skills & Technologies</li>
                  <li>• Internship Completion Status</li>
                  <li>• Project Portfolio</li>
                </ul>
              </div>

              <div className="border-2 border-background p-4 bg-background text-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-foreground" />
                  <span className="font-mono text-foreground font-bold text-sm">NOT Shared ✗</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground font-serif">
                  <li>• Government ID Numbers</li>
                  <li>• Bank Account Details</li>
                  <li>• Home Address</li>
                  <li>• Family Information</li>
                  <li>• Social Security Numbers</li>
                  <li>• Private Messages</li>
                </ul>
              </div>
            </div>

            <p className="font-mono text-xs text-background opacity-70 mt-4 italic">
              Note: Your data is ONLY shared with verified hiring partners when you apply for their positions or explicitly opt-in.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Your Rights & Choices
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6 space-y-3">
            <p className="font-serif text-muted-foreground">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground font-serif space-y-1">
              <li>Access all personal data we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and all associated data</li>
              <li>Opt-out of data sharing with hiring partners</li>
              <li>Download your complete profile data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
              Data Security
            </h2>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <p className="font-serif text-muted-foreground">
              We implement industry-standard security measures including encryption, secure servers,
              and regular security audits to protect your information from unauthorized access,
              alteration, or destruction.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="mb-10 border-2 border-foreground p-6 bg-muted"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} className="text-foreground" />
            <h2 className="font-serif text-2xl font-bold tracking-tighter text-foreground">
              Contact Us
            </h2>
          </div>
          <p className="font-serif text-muted-foreground mb-4">
            For privacy-related questions, data deletion requests, or concerns about your information:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-foreground" />
              <a href="mailto:privacy@sqrock.cloud" className="font-mono text-foreground hover:underline">
                privacy@sqrock.cloud
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-foreground" />
              <a href="tel:+918619819400" className="font-mono text-foreground hover:underline">
                +91 86198 19400
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="text-center pt-8 border-t-2 border-foreground"
        >
          <p className="font-mono text-xs text-muted-foreground">
            By using CO-PROFILES, you consent to this Privacy Policy. We may update this policy periodically.
          </p>
          <Link href="/" className="inline-block mt-4 text-foreground hover:underline text-sm font-mono tracking-wide">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}