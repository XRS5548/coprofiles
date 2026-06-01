// components/footer.tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const links = [
  { title: "Internships", href: "/#internships" },
  { title: "About", href: "/about" },
  { title: "Hiring Process", href: "/#hiring-process" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms & Conditions", href: "/terms-and-conditions" },
]

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com/company/sqrock-it-solutions/" },
  { name: "X", href: "https://x.com/sqrockofficial" },
  { name: "Instagram", href: "https://www.instagram.com/sqrock.tech/" },
]

export function Footer() {
  return (
    <footer className="border-t border-[#3F3F46] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter mb-2 text-[#FAFAFA]"
            >
              CO-PROFILES
            </motion.div>
            <p className="text-[#A1A1AA] text-sm uppercase tracking-wide mb-4">
              by SQROCK IT Solutions
            </p>
            <p className="text-[#A1A1AA] text-xs leading-relaxed">
              Building future tech leaders through real-world experience and industry mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAFAFA] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] text-sm hover:text-[#DFE104] transition-colors duration-200 uppercase tracking-wide"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAFAFA] mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@sqrock.cloud" className="text-[#A1A1AA] text-sm hover:text-[#DFE104] transition-colors">
                  info@sqrock.cloud
                </a>
              </li>
              <li>
                <a href="mailto:hr@sqrock.cloud" className="text-[#A1A1AA] text-sm hover:text-[#DFE104] transition-colors">
                  hr@sqrock.cloud
                </a>
              </li>
              <li>
                <a href="tel:+918619819400" className="text-[#A1A1AA] text-sm hover:text-[#DFE104] transition-colors">
                  +91 86198 19400
                </a>
              </li>
              <li className="text-[#A1A1AA] text-sm">
                Tech Hub, Sector 62<br />
                Noida, UP - 201301
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAFAFA] mb-4">
              Follow Us
            </h3>
            <ul className="space-y-2 mb-6">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] text-sm hover:text-[#DFE104] transition-colors uppercase tracking-wide"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Exam & Certificate Info */}
            <div className="border-t border-[#3F3F46] pt-4">
              <p className="text-[#DFE104] text-xs uppercase tracking-wide mb-1">
                Compulsory Exam Required
              </p>
              <p className="text-[#A1A1AA] text-xs">
                Pass to qualify for internships
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3F3F46] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left text-[#A1A1AA] text-xs uppercase tracking-wide">
            © 2024 CO-PROFILES by SQROCK IT Solutions. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-[#A1A1AA] text-xs uppercase tracking-wide hover:text-[#DFE104] transition-colors">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="text-[#A1A1AA] text-xs uppercase tracking-wide hover:text-[#DFE104] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-[#A1A1AA] text-xs uppercase tracking-wide hover:text-[#DFE104] transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}