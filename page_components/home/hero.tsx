"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Decorative elements */}
      <div className="absolute top-24 left-12 w-px h-32 bg-foreground/20" />
      <div className="absolute bottom-24 right-12 w-px h-32 bg-foreground/20" />
      <div className="absolute top-1/3 right-16 w-16 h-16 border border-foreground/10" />

      {/* Subtle texture */}
      <div className="absolute inset-0 bg-texture-noise pointer-events-none" />
      <div className="absolute inset-0 bg-texture-lines pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-block mb-6">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            SQROCK IT Solutions
          </span>
        </div>

        <h1 className="font-serif text-[clamp(3.5rem,12vw,10rem)] font-bold leading-[0.88] tracking-tighter text-foreground mb-8">
          BUILD.
          <br />
          LEARN.
          <br />
          <span className="bg-foreground text-background px-4 inline-block">GET HIRED.</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-serif leading-relaxed">
          The Official Internship & Hiring Platform of SQROCK IT Solutions — bridging academic learning with industry excellence.
        </p>

        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-8 h-px bg-foreground" />
          <div className="w-2 h-2 border border-foreground rotate-45" />
          <div className="w-8 h-px bg-foreground" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="group px-10 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-foreground transition-none duration-0">
            Apply For Internship
            <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
          <Link href="/#internships" className="px-10 py-4 border-2 border-foreground text-foreground font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-none duration-0">
            Explore Opportunities
          </Link>
        </div>
      </div>
    </section>
  )
}
