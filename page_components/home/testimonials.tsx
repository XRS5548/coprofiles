// components/testimonials.tsx
"use client"

const testimonials = [
  { name: "Rahul Sharma", role: "Full Stack Intern → Developer", text: "The mentorship and real projects at SQROCK transformed my career. I got a full-time offer right after my internship!" },
  { name: "Priya Patel", role: "UI/UX Intern", text: "Working on real client projects gave me portfolio pieces that helped me land multiple job offers." },
  { name: "Amit Kumar", role: "AI Developer Intern", text: "The certificate from SQROCK opened doors I never thought possible. Highly recommended for serious developers." },
  { name: "Neha Singh", role: "Frontend Intern", text: "Best decision I made in college. The skills I learned here are exactly what the industry demands." },
]

export function Testimonials() {
  return (
    <section className="py-24 px-6 border-t border-[#3F3F46] overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-center text-[#FAFAFA]">
          Student Success
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="w-[350px] md:w-[400px] mx-4 p-6 border border-[#3F3F46] bg-[#09090B] inline-block whitespace-normal"
            >
              <div className="text-[#DFE104] text-4xl mb-3">"</div>
              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">
                {testimonial.text}
              </p>
              <div>
                <p className="font-bold uppercase text-sm text-[#FAFAFA]">{testimonial.name}</p>
                <p className="text-[#DFE104] text-xs uppercase tracking-wide">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}