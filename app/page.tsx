"use client"

import { Hero } from "@/page_components/home/hero"
import { StatisticsMarquee } from "@/page_components/home/statistics-marquee"
import { InternshipsSection } from "@/page_components/home/internships-section"
import { WhyJoinSection } from "@/page_components/home/why-join-section"
import { HiringProcess } from "@/page_components/home/hiring-process"
import { Testimonials } from "@/page_components/home/testimonials"
import { CTASection } from "@/page_components/home/cta"
import { Navbar } from "@/page_components/home/navbar"
import { Footer } from "@/page_components/home/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatisticsMarquee />
      <InternshipsSection />
      <WhyJoinSection />
      <HiringProcess />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  )
}
