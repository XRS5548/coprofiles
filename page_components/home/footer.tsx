 import Link from "next/link"

const links = [
  { title: "Internships", href: "/#internships" },
  { title: "About", href: "/about" },
  { title: "Process", href: "/#hiring-process" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms & Conditions", href: "/terms-and-conditions" },
]

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com/company/sqrock-it-solutions/" },
  { name: "X / Twitter", href: "https://x.com/sqrockofficial" },
  { name: "Instagram", href: "https://www.instagram.com/sqrock.tech/" },
]

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#CD7F32]/10 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl font-bold text-white">
              CO-PROFILES
            </h3>

            <p className="text-[#CD7F32] text-xs uppercase tracking-[0.25em] mt-2">
              by SQROCK IT Solutions
            </p>

            <p className="text-white/60 text-sm mt-6 leading-relaxed">
              Building future tech leaders through real-world experience and mentorship.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[#CD7F32] text-xs uppercase tracking-[0.35em] mb-6">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm uppercase tracking-widest hover:text-[#CD7F32] transition"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#CD7F32] text-xs uppercase tracking-[0.35em] mb-6">
              Contact
            </h4>

            <ul className="space-y-3 text-sm">

              <li>
                <a
                  href="mailto:info@sqrock.cloud"
                  className="text-white/50 hover:text-[#CD7F32] transition"
                >
                  info@sqrock.cloud
                </a>
              </li>

              <li>
                <a
                  href="mailto:hr@sqrock.cloud"
                  className="text-white/50 hover:text-[#CD7F32] transition"
                >
                  hr@sqrock.cloud
                </a>
              </li>

              <li>
                <a
                  href="tel:+918619819400"
                  className="text-white/50 hover:text-[#CD7F32] transition"
                >
                  +91 86198 19400
                </a>
              </li>

              <li className="text-white/50">
                Tech Hub, Sector 62<br />Noida, UP — 201301
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[#CD7F32] text-xs uppercase tracking-[0.35em] mb-6">
              Follow Us
            </h4>

            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 text-sm uppercase tracking-widest hover:text-[#CD7F32] transition"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-[#CD7F32]/10 pt-4">
              <p className="text-[#CD7F32] text-xs uppercase tracking-widest mb-1">
                Compulsory Exam Required
              </p>
              <p className="text-white/40 text-xs">
                Pass to qualify for internships
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#CD7F32]/10 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-white/30 text-xs tracking-wider">
            © 2024 CO-PROFILES by SQROCK IT Solutions. All rights reserved.
          </p>

          <div className="flex gap-6">

            <Link
              href="/privacy-policy"
              className="text-white/40 text-xs hover:text-[#CD7F32] transition"
            >
              Privacy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-white/40 text-xs hover:text-[#CD7F32] transition"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="text-white/40 text-xs hover:text-[#CD7F32] transition"
            >
              Support
            </Link>

          </div>

        </div>
      </div>
    </footer>
  )
}