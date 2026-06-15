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

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-[#CD7F32]/20 shadow-[0_0_30px_rgba(205,127,50,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-3xl font-bold tracking-wide text-[#CD7F32]"
          >
            CO-PROFILES
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm uppercase tracking-[0.18em] text-white/70 transition-all duration-300 hover:text-[#CD7F32]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg border border-[#CD7F32]/20 px-5 py-2 text-sm font-medium uppercase tracking-[0.15em] text-[#CD7F32] transition-all duration-300 hover:border-[#CD7F32] hover:bg-[#CD7F32] hover:text-black"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#CD7F32] px-5 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-all duration-300 hover:bg-[#D89247] hover:shadow-[0_0_20px_rgba(205,127,50,0.35)]"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#CD7F32]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#CD7F32]/10 bg-black/95 backdrop-blur-xl pb-6 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-sm uppercase tracking-[0.15em] text-white/70 transition-all duration-300 hover:text-[#CD7F32]"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 pt-5">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg border border-[#CD7F32]/20 px-5 py-3 text-center text-sm uppercase tracking-[0.15em] text-[#CD7F32] transition-all duration-300 hover:border-[#CD7F32] hover:bg-[#CD7F32] hover:text-black"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg bg-[#CD7F32] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-black transition-all duration-300 hover:bg-[#D89247]"
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