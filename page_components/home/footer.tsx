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
    <footer className="bg-luxury-bg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
              CO-PROFILES
            </h3>
            <p className="text-white/30 text-sm uppercase tracking-[0.2em] font-sans mb-6">
              by SQROCK IT Solutions
            </p>
            <p className="text-white/40 text-sm leading-relaxed font-sans">
              Building future tech leaders through real-world experience and industry mentorship.
            </p>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.25em] font-sans mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white transition-colors duration-300 uppercase tracking-widest font-sans"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.25em] font-sans mb-6">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@sqrock.cloud" className="text-white/40 text-sm hover:text-white transition-colors duration-300 font-sans">
                  info@sqrock.cloud
                </a>
              </li>
              <li>
                <a href="mailto:hr@sqrock.cloud" className="text-white/40 text-sm hover:text-white transition-colors duration-300 font-sans">
                  hr@sqrock.cloud
                </a>
              </li>
              <li>
                <a href="tel:+918619819400" className="text-white/40 text-sm hover:text-white transition-colors duration-300 font-sans">
                  +91 86198 19400
                </a>
              </li>
              <li className="text-white/40 text-sm font-sans">
                Tech Hub, Sector 62<br />Noida, UP — 201301
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.25em] font-sans mb-6">
              Follow Us
            </h4>
            <ul className="space-y-3 mb-8">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 text-sm hover:text-white transition-colors duration-300 uppercase tracking-widest font-sans"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 pt-4">
              <p className="text-gold text-xs uppercase tracking-widest font-sans mb-1">
                Compulsory Exam Required
              </p>
              <p className="text-white/30 text-xs font-sans">
                Pass to qualify for internships
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs font-sans tracking-wider">
            &copy; 2024 CO-PROFILES by SQROCK IT Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-white/30 text-xs font-sans tracking-wider hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="text-white/30 text-xs font-sans tracking-wider hover:text-white transition-colors duration-300">
              Terms
            </Link>
            <Link href="/contact" className="text-white/30 text-xs font-sans tracking-wider hover:text-white transition-colors duration-300">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
