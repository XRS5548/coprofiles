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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-100 ${
        isScrolled ? "bg-background border-b border-foreground" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-foreground"
          >
            CO-PROFILES
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-100 uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-foreground border border-foreground hover:bg-foreground hover:text-background transition-colors duration-100 uppercase tracking-widest"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium bg-foreground text-background hover:bg-background hover:text-foreground hover:border hover:border-foreground transition-colors duration-100 uppercase tracking-widest"
            >
              Apply Now
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-foreground">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-3 text-base text-muted-foreground hover:text-foreground transition-colors duration-100 uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/login"
                className="w-full px-5 py-2 text-sm font-medium text-center text-foreground border border-foreground hover:bg-foreground hover:text-background transition-colors duration-100 uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full px-5 py-2 text-sm font-medium text-center bg-foreground text-background hover:bg-background hover:text-foreground hover:border hover:border-foreground transition-colors duration-100 uppercase tracking-widest"
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
