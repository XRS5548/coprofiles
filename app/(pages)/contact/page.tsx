// app/contact/page.tsx
"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, Briefcase, FileText, ChevronRight } from "lucide-react"
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
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex p-3 border-2 border-foreground mb-6">
            <Mail size={40} className="text-foreground" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
            Contact Us
          </h1>
          <p className="font-serif text-muted-foreground text-lg max-w-2xl mx-auto">
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
            <div className="border-2 border-foreground p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={20} className="text-foreground" />
                <h2 className="font-serif text-lg font-bold tracking-tighter text-foreground">
                  General Inquiries
                </h2>
              </div>
              <a href="mailto:info@sqrock.cloud" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-all duration-100 block mb-2">
                info@sqrock.cloud
              </a>
              <a href="tel:+918619819400" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-all duration-100">
                +91 86198 19400
              </a>
            </div>

            {/* HR & Internships */}
            <div className="border-2 border-foreground p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={20} className="text-foreground" />
                <h2 className="font-serif text-lg font-bold tracking-tighter text-foreground">
                  HR & Internships
                </h2>
              </div>
              <a href="mailto:hr@sqrock.cloud" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-all duration-100 block mb-2">
                hr@sqrock.cloud
              </a>
              <p className="font-serif text-muted-foreground text-xs mt-2">
                For internship applications, certificate requests, and hiring inquiries
              </p>
            </div>

            {/* Legal & Privacy */}
            <div className="border-2 border-foreground p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-foreground" />
                <h2 className="font-serif text-lg font-bold tracking-tighter text-foreground">
                  Legal & Privacy
                </h2>
              </div>
              <a href="mailto:legal@sqrock.cloud" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-all duration-100 block mb-2">
                legal@sqrock.cloud
              </a>
              <p className="font-serif text-muted-foreground text-xs mt-2">
                For privacy concerns, data requests, and legal matters
              </p>
            </div>

            {/* Office Location */}
            <div className="border-2 border-foreground p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-foreground" />
                <h2 className="font-serif text-lg font-bold tracking-tighter text-foreground">
                  Office Location
                </h2>
              </div>
              <p className="font-serif text-muted-foreground text-sm leading-relaxed">
                SQROCK IT Solutions<br />
                Tech Hub, Sector 62<br />
                Noida, Uttar Pradesh - 201301<br />
                India
              </p>
            </div>

            {/* Business Hours */}
            <div className="border-2 border-foreground p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-foreground" />
                <h2 className="font-serif text-lg font-bold tracking-tighter text-foreground">
                  Business Hours
                </h2>
              </div>
              <p className="font-serif text-muted-foreground text-sm">
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
            <div className="border-2 border-foreground p-8">
              <h2 className="font-serif text-2xl font-bold tracking-tighter text-foreground mb-6">
                Send us a Message
              </h2>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 border-2 border-foreground"
                >
                  <p className="font-mono text-xs text-foreground uppercase tracking-[0.2em]">
                    Message sent successfully! We'll get back to you within 24-48 hours.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-foreground bg-background text-foreground font-serif p-4 outline-none transition-all duration-100"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-foreground bg-background text-foreground font-serif p-4 outline-none transition-all duration-100"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-foreground bg-background text-foreground font-serif p-4 outline-none transition-all duration-100"
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
                  <label className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border-2 border-foreground bg-background text-foreground font-serif p-4 outline-none transition-all duration-100 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest transition-all duration-100 hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              <p className="font-serif text-muted-foreground text-xs text-center mt-4">
                By submitting this form, you agree to our <Link href="/privacy-policy" className="text-foreground hover:underline underline-offset-2 transition-all duration-100">Privacy Policy</Link> and <Link href="/terms-and-conditions" className="text-foreground hover:underline underline-offset-2 transition-all duration-100">Terms & Conditions</Link>.
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
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="font-serif text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-foreground p-6">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
                How long until I get a response?
              </h3>
              <p className="font-serif text-muted-foreground text-sm">
                We typically respond within 24-48 business hours.
              </p>
            </div>
            <div className="border-2 border-foreground p-6">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
                Can I apply for internships via email?
              </h3>
              <p className="font-serif text-muted-foreground text-sm">
                No, all applications must be submitted through the platform after passing the compulsory exam.
              </p>
            </div>
            <div className="border-2 border-foreground p-6">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
                How do I request a custom certificate?
              </h3>
              <p className="font-serif text-muted-foreground text-sm">
                Email your request to <span className="text-foreground font-serif">hr@sqrock.cloud</span> with your details and certificate requirements.
              </p>
            </div>
            <div className="border-2 border-foreground p-6">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">
                Technical issues with the platform?
              </h3>
              <p className="font-serif text-muted-foreground text-sm">
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
          {/* <div className="border-2 border-foreground">
            <div className="bg-background p-4 border-b-2 border-foreground">
              <h3 className="font-serif text-lg font-bold tracking-tighter text-foreground">
                Find Us Here
              </h3>
            </div>
            <div className="aspect-video bg-background flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin size={48} className="text-foreground mx-auto mb-3" />
                <p className="font-serif text-muted-foreground text-sm">
                  SQROCK IT Solutions, Tech Hub, Sector 62, Noida, UP - 201301
                </p>
                <a 
                  href="https://maps.google.com/?q=28.5355,77.3910" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 font-mono text-xs text-muted-foreground hover:text-foreground transition-all duration-100 uppercase tracking-[0.2em]"
                >
                  Open in Google Maps
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
          <Link href="/" className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-100 uppercase tracking-[0.2em]">
            <ChevronRight size={16} className="rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
