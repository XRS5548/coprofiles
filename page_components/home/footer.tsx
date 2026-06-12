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
    <footer className="bg-background">
      {/* Thick horizontal rule */}
      <div className="h-2 bg-foreground" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground mb-2">
              CO-PROFILES
            </h3>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono mb-6">
              by SQROCK IT Solutions
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed font-serif">
              Building future tech leaders through real-world experience and industry mentorship.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-100 uppercase tracking-widest font-mono"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-foreground mb-6">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@sqrock.cloud" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-100 font-mono">
                  info@sqrock.cloud
                </a>
              </li>
              <li>
                <a href="mailto:hr@sqrock.cloud" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-100 font-mono">
                  hr@sqrock.cloud
                </a>
              </li>
              <li>
                <a href="tel:+918619819400" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-100 font-mono">
                  +91 86198 19400
                </a>
              </li>
              <li className="text-muted-foreground text-sm font-serif">
                Tech Hub, Sector 62<br />Noida, UP — 201301
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-foreground mb-6">
              Follow Us
            </h4>
            <ul className="space-y-3 mb-8">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-100 uppercase tracking-widest font-mono"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="border-t border-foreground/20 pt-4">
              <p className="text-xs font-mono uppercase tracking-widest text-foreground mb-1">
                Compulsory Exam Required
              </p>
              <p className="text-muted-foreground text-xs font-serif">
                Pass to qualify for internships
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
            &copy; 2024 CO-PROFILES by SQROCK IT Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-muted-foreground text-xs font-mono uppercase tracking-widest hover:text-foreground transition-colors duration-100">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="text-muted-foreground text-xs font-mono uppercase tracking-widest hover:text-foreground transition-colors duration-100">
              Terms
            </Link>
            <Link href="/contact" className="text-muted-foreground text-xs font-mono uppercase tracking-widest hover:text-foreground transition-colors duration-100">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
