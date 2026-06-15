"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Internships", href: "/#internships" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/#hiring-process" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-luxury-bg/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-white"
          >
            CO-PROFILES
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-300 uppercase tracking-[0.15em] font-sans"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2 text-sm text-white/80 border border-white/20 font-sans uppercase tracking-[0.15em] hover:bg-white hover:text-luxury-bg transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm bg-white text-luxury-bg font-sans uppercase tracking-[0.15em] font-medium hover:bg-gold transition-colors duration-300"
            >
              Apply Now
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 pb-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-3 text-white/60 hover:text-white text-sm uppercase tracking-[0.15em] font-sans transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/login"
                className="w-full px-5 py-2 text-sm text-center text-white/80 border border-white/20 font-sans uppercase tracking-[0.15em] hover:bg-white hover:text-luxury-bg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full px-5 py-2 text-sm text-center bg-white text-luxury-bg font-sans uppercase tracking-[0.15em] font-medium hover:bg-gold transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
