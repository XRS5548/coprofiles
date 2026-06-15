const stats = [
  "5000+ Students",
  "1000+ Internships",
  "300+ Projects",
  "100+ Hiring Partners",
]

export function StatisticsMarquee() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-luxury-bg py-6">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...stats, ...stats, ...stats].map((stat, index) => (
          <span
            key={index}
            className="text-xl md:text-2xl font-sans uppercase tracking-[0.15em] text-white/30 mx-10 flex items-center gap-4"
          >
            <span className="w-1.5 h-1.5 bg-gold/50 rounded-full inline-block" />
            {stat}
          </span>
        ))}
      </div>
    </div>
  )
}
