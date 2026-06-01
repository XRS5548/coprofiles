// app/privacy-policy/page.tsx
"use client"

import { Footer } from "@/page_components/home/footer"
import { Navbar } from "@/page_components/home/navbar"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, Mail, Phone, FileText, Users, Building, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex p-3 border border-[#DFE104] mb-6">
            <Shield size={40} className="text-[#DFE104]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#A1A1AA] text-lg">
            Last Updated: December 2024
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 p-6 border border-[#3F3F46] bg-[#09090B]"
        >
          <p className="text-[#A1A1AA] leading-relaxed">
            At <span className="text-[#DFE104] font-bold">CO-PROFILES by SQROCK IT Solutions</span>, we take your privacy seriously. 
            This policy explains how we collect, use, and share your information when you use our internship and hiring platform.
          </p>
        </motion.div>

        {/* What Data We Collect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-[#DFE104]" />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
              What Data We Collect
            </h2>
          </div>
          <div className="border-l-2 border-[#DFE104] pl-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold uppercase text-[#FAFAFA] mb-2">Student Profile Data</h3>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-1">
                <li>Full Name & Contact Information (Email, Phone Number)</li>
                <li>Resume/CV & Professional Portfolio Links</li>
                <li>Educational Background & Skills</li>
                <li>Exam Scores & Assessment Results</li>
                <li>Project Work & Internship History</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* How We Use Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Eye size={24} className="text-[#DFE104]" />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
              How We Use Your Data
            </h2>
          </div>
          <div className="border-l-2 border-[#DFE104] pl-6 space-y-4">
            <p className="text-[#A1A1AA]">We use your information to:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] space-y-1">
              <li>Process your internship applications</li>
              <li>Conduct compulsory examinations and assessments</li>
              <li>Generate internship certificates upon completion</li>
              <li>Match you with relevant job opportunities</li>
              <li>Share your profile with hiring partners (limited data)</li>
              <li>Communicate important updates about your application</li>
            </ul>
          </div>
        </motion.div>

        {/* Data Sharing - Important Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10 p-6 border-2 border-[#DFE104] bg-[#DFE104]/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Building size={24} className="text-[#DFE104]" />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
              Data Shared With Hiring Partners
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-[#FAFAFA] font-bold">ONLY the following information is shared with other companies for hiring purposes:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-[#3F3F46] p-4 bg-[#09090B]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#DFE104]" />
                  <span className="text-[#DFE104] font-bold uppercase text-sm">Shared ✓</span>
                </div>
                <ul className="space-y-2 text-sm text-[#A1A1AA]">
                  <li>• Resume/CV</li>
                  <li>• Email Address</li>
                  <li>• Phone Number</li>
                  <li>• Skills & Technologies</li>
                  <li>• Internship Completion Status</li>
                  <li>• Project Portfolio</li>
                </ul>
              </div>
              
              <div className="border border-[#3F3F46] p-4 bg-[#09090B]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500" />
                  <span className="text-red-500 font-bold uppercase text-sm">NOT Shared ✗</span>
                </div>
                <ul className="space-y-2 text-sm text-[#A1A1AA]">
                  <li>• Government ID Numbers</li>
                  <li>• Bank Account Details</li>
                  <li>• Home Address</li>
                  <li>• Family Information</li>
                  <li>• Social Security Numbers</li>
                  <li>• Private Messages</li>
                </ul>
              </div>
            </div>
            
            <p className="text-xs text-[#A1A1AA] mt-4 italic">
              Note: Your data is ONLY shared with verified hiring partners when you apply for their positions or explicitly opt-in.
            </p>
          </div>
        </motion.div>

        {/* Your Rights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock size={24} className="text-[#DFE104]" />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
              Your Rights & Choices
            </h2>
          </div>
          <div className="border-l-2 border-[#DFE104] pl-6 space-y-3">
            <p className="text-[#A1A1AA]">You have the right to:</p>
            <ul className="list-disc list-inside text-[#A1A1AA] space-y-1">
              <li>Access all personal data we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and all associated data</li>
              <li>Opt-out of data sharing with hiring partners</li>
              <li>Download your complete profile data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </div>
        </motion.div>

        {/* Data Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-[#DFE104]" />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
              Data Security
            </h2>
          </div>
          <div className="border-l-2 border-[#DFE104] pl-6">
            <p className="text-[#A1A1AA]">
              We implement industry-standard security measures including encryption, secure servers, 
              and regular security audits to protect your information from unauthorized access, 
              alteration, or destruction.
            </p>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-10 p-6 border border-[#3F3F46] bg-[#09090B]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} className="text-[#DFE104]" />
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
              Contact Us
            </h2>
          </div>
          <p className="text-[#A1A1AA] mb-4">
            For privacy-related questions, data deletion requests, or concerns about your information:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#DFE104]" />
              <a href="mailto:privacy@sqrock.cloud" className="text-[#DFE104] hover:underline">
                privacy@sqrock.cloud
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#DFE104]" />
              <a href="tel:+918619819400" className="text-[#DFE104] hover:underline">
                +91 86198 19400
              </a>
            </div>
          </div>
        </motion.div>

        {/* Consent Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center pt-8 border-t border-[#3F3F46]"
        >
          <p className="text-xs text-[#A1A1AA]">
            By using CO-PROFILES, you consent to this Privacy Policy. We may update this policy periodically.
          </p>
          <Link href="/" className="inline-block mt-4 text-[#DFE104] hover:underline text-sm uppercase tracking-wide">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}