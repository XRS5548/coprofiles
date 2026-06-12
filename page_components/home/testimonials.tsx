const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full Stack Intern → Developer",
    text: "The mentorship and real projects at SQROCK transformed my career. I got a full-time offer right after my internship.",
  },
  {
    name: "Priya Patel",
    role: "UI/UX Intern",
    text: "Working on real client projects gave me portfolio pieces that helped me land multiple job offers.",
  },
  {
    name: "Amit Kumar",
    role: "AI Developer Intern",
    text: "The certificate from SQROCK opened doors I never thought possible. Highly recommended for serious developers.",
  },
  {
    name: "Neha Singh",
    role: "Frontend Intern",
    text: "Best decision I made in college. The skills I learned here are exactly what the industry demands.",
  },
]

export function Testimonials() {
  return (
    <section className="py-32 px-6 bg-background">
      {/* Thick rule */}
      <div className="h-1 bg-foreground mb-32" />

      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter text-foreground text-center">
          Student<br />Success
        </h2>
        <div className="w-16 h-px bg-foreground mx-auto mt-6" />
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-[380px] md:w-[420px] mx-6 p-8 border border-foreground bg-background inline-block whitespace-normal flex-shrink-0"
            >
              <div className="font-serif text-7xl leading-none text-foreground/20 mb-4 tracking-tighter">
                &rdquo;
              </div>
              <p className="text-foreground/80 text-base leading-relaxed mb-6 font-serif italic">
                {t.text}
              </p>
              <div className="border-t border-foreground/20 pt-4">
                <p className="font-mono font-bold uppercase text-sm tracking-widest text-foreground">
                  {t.name}
                </p>
                <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
