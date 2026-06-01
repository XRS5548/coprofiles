import { Footer } from '@/page_components/home/footer'
import { Navbar } from '@/page_components/home/navbar'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Navbar />
        {children}
        <Footer />
        </div>
  )
}
