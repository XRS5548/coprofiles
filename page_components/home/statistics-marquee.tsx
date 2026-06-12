const stats = [
  "5000+ Students",
  "1000+ Internships",
  "300+ Projects",
  "100+ Hiring Partners",
]

export function StatisticsMarquee() {
  return (
    <div className="overflow-hidden border-y border-foreground/20 bg-muted">
      <div className="flex animate-marquee whitespace-nowrap py-5">
        {[...stats, ...stats].map((stat, index) => (
          <span
            key={index}
            className="text-xl md:text-2xl font-mono uppercase tracking-[0.15em] text-muted-foreground mx-10"
          >
            {stat}
          </span>
        ))}
      </div>
    </div>
  )
}
