// app/contact/page.tsx
"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Briefcase, FileText, Award, ExternalLink, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
            <MessageSquare size={40} className="text-[#DFE104]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-4">
            Contact Us
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Get in touch with SQROCK IT Solutions for inquiries, support, or partnerships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* General Contact */}
            <div className="border border-[#3F3F46] p-6 bg-[#09090B]">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={20} className="text-[#DFE104]" />
                <h2 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA]">
                  General Inquiries
                </h2>
              </div>
              <a href="mailto:info@sqrock.cloud" className="text-[#DFE104] hover:underline text-sm block mb-2">
                info@sqrock.cloud
              </a>
              <a href="tel:+918619819400" className="text-[#DFE104] hover:underline text-sm">
                +91 86198 19400
              </a>
            </div>

            {/* HR & Internships */}
            <div className="border border-[#3F3F46] p-6 bg-[#09090B]">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={20} className="text-[#DFE104]" />
                <h2 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA]">
                  HR & Internships
                </h2>
              </div>
              <a href="mailto:hr@sqrock.cloud" className="text-[#DFE104] hover:underline text-sm block mb-2">
                hr@sqrock.cloud
              </a>
              <p className="text-[#A1A1AA] text-xs mt-2">
                For internship applications, certificate requests, and hiring inquiries
              </p>
            </div>

            {/* Legal & Privacy */}
            <div className="border border-[#3F3F46] p-6 bg-[#09090B]">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-[#DFE104]" />
                <h2 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA]">
                  Legal & Privacy
                </h2>
              </div>
              <a href="mailto:legal@sqrock.cloud" className="text-[#DFE104] hover:underline text-sm block mb-2">
                legal@sqrock.cloud
              </a>
              <p className="text-[#A1A1AA] text-xs mt-2">
                For privacy concerns, data requests, and legal matters
              </p>
            </div>

            {/* Office Location */}
            <div className="border border-[#3F3F46] p-6 bg-[#09090B]">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-[#DFE104]" />
                <h2 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA]">
                  Office Location
                </h2>
              </div>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                SQROCK IT Solutions<br />
                Tech Hub, Sector 62<br />
                Noida, Uttar Pradesh - 201301<br />
                India
              </p>
            </div>

            {/* Business Hours */}
            <div className="border border-[#3F3F46] p-6 bg-[#09090B]">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-[#DFE104]" />
                <h2 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA]">
                  Business Hours
                </h2>
              </div>
              <p className="text-[#A1A1AA] text-sm">
                Monday - Friday: 10:00 AM - 6:00 PM IST<br />
                Saturday: 10:00 AM - 2:00 PM IST<br />
                Sunday: Closed
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="border border-[#3F3F46] p-8 bg-[#09090B]">
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-6">
                Send us a Message
              </h2>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 border border-[#DFE104] bg-[#DFE104]/5"
                >
                  <p className="text-[#DFE104] text-sm uppercase tracking-wide">
                    ✓ Message sent successfully! We'll get back to you within 24-48 hours.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[#FAFAFA] text-sm uppercase tracking-wide mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#09090B] border border-[#3F3F46] text-[#FAFAFA] focus:border-[#DFE104] outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[#FAFAFA] text-sm uppercase tracking-wide mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#09090B] border border-[#3F3F46] text-[#FAFAFA] focus:border-[#DFE104] outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[#FAFAFA] text-sm uppercase tracking-wide mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#09090B] border border-[#3F3F46] text-[#FAFAFA] focus:border-[#DFE104] outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="internship">Internship Application Inquiry</option>
                    <option value="certificate">Certificate Request</option>
                    <option value="exam">Exam Related Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FAFAFA] text-sm uppercase tracking-wide mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full p-3 bg-[#09090B] border border-[#3F3F46] text-[#FAFAFA] focus:border-[#DFE104] outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#DFE104] text-black font-bold uppercase tracking-wide hover:bg-[#DFE104]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-[#A1A1AA] text-xs text-center mt-4">
                By submitting this form, you agree to our <Link href="/privacy-policy" className="text-[#DFE104] hover:underline">Privacy Policy</Link> and <Link href="/terms-and-conditions" className="text-[#DFE104] hover:underline">Terms & Conditions</Link>.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-[#A1A1AA]">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#3F3F46] p-5">
              <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-2">
                How long until I get a response?
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                We typically respond within 24-48 business hours.
              </p>
            </div>
            <div className="border border-[#3F3F46] p-5">
              <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-2">
                Can I apply for internships via email?
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                No, all applications must be submitted through the platform after passing the compulsory exam.
              </p>
            </div>
            <div className="border border-[#3F3F46] p-5">
              <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-2">
                How do I request a custom certificate?
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Email your request to <span className="text-[#DFE104]">hr@sqrock.cloud</span> with your details and certificate requirements.
              </p>
            </div>
            <div className="border border-[#3F3F46] p-5">
              <h3 className="font-bold text-[#FAFAFA] uppercase text-sm mb-2">
                Technical issues with the platform?
              </h3>
              <p className="text-[#A1A1AA] text-sm">
                Please use the contact form with subject "Technical Support" and describe the issue in detail.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          {/* <div className="border border-[#3F3F46] overflow-hidden">
            <div className="bg-[#09090B] p-4 border-b border-[#3F3F46]">
              <h3 className="text-lg font-bold uppercase tracking-tighter text-[#FAFAFA]">
                Find Us Here
              </h3>
            </div>
            <div className="aspect-video bg-[#18181B] flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin size={48} className="text-[#DFE104] mx-auto mb-3" />
                <p className="text-[#A1A1AA] text-sm">
                  SQROCK IT Solutions, Tech Hub, Sector 62, Noida, UP - 201301
                </p>
                <a 
                  href="https://maps.google.com/?q=28.5355,77.3910" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[#DFE104] hover:underline text-sm uppercase tracking-wide"
                >
                  Open in Google Maps
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div> */}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/" className="inline-flex items-center gap-1 text-[#A1A1AA] hover:text-[#DFE104] transition-colors text-sm uppercase tracking-wide">
            <ChevronRight size={16} className="rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}