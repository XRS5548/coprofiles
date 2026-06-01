// components/navbar.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const navItems = ["Home", "Internships", "About", "Hiring Process", "Contact"]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[#3F3F46] transition-all duration-300 ${
        isScrolled ? "bg-[#09090B]/95 backdrop-blur-sm" : "bg-[#09090B]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="/"
            className="text-2xl font-bold tracking-tighter text-[#FAFAFA]"
            whileHover={{ scale: 1.02 }}
          >
            CO-PROFILES
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-[#A1A1AA] hover:text-[#DFE104] transition-colors duration-200 uppercase tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="px-5 py-2 text-sm font-medium text-[#FAFAFA] border border-[#3F3F46] hover:border-[#DFE104] hover:text-[#DFE104] transition-all duration-200 uppercase tracking-wide">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium bg-[#DFE104] text-black hover:bg-[#DFE104]/90 transition-all duration-200 uppercase tracking-wide">
              Apply Now
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#FAFAFA]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-[#3F3F46]"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="block py-3 text-base text-[#A1A1AA] hover:text-[#DFE104] transition-colors duration-200 uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/login" className="w-full px-5 py-2 text-sm font-medium text-center text-[#FAFAFA] border border-[#3F3F46] hover:border-[#DFE104] hover:text-[#DFE104] transition-all duration-200 uppercase" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="w-full px-5 py-2 text-sm font-medium text-center bg-[#DFE104] text-black hover:bg-[#DFE104]/90 transition-all duration-200 uppercase" onClick={() => setIsMobileMenuOpen(false)}>
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
