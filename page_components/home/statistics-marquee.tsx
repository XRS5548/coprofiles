// components/statistics-marquee.tsx
"use client"

const stats = [
  "5000+ STUDENTS",
  "1000+ INTERNSHIPS",
  "300+ PROJECTS",
  "100+ HIRING PARTNERS",
]

export function StatisticsMarquee() {
  return (
    <div className="overflow-hidden border-y border-[#3F3F46] py-6">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...stats, ...stats].map((stat, index) => (
          <span
            key={index}
            className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#A1A1AA] mx-8"
          >
            {stat}
          </span>
        ))}
      </div>
    </div>
  )
}