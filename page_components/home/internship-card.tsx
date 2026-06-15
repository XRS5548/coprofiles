 "use client"

interface InternshipCardProps {
  id: number
  title: string
  duration: string
  location: string
  certificate: boolean
  skills: string[]
  index: number
  isLoggedIn: boolean
}

export function InternshipCard({
  id,
  title,
  duration,
  location,
  certificate,
  skills,
  index,
  isLoggedIn,
}: InternshipCardProps) {
  const handleApplyClick = () => {
    if (isLoggedIn) {
      window.location.href = `/apply/${id}`
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <div
      onClick={handleApplyClick}
      className="group relative overflow-hidden rounded-2xl border border-[#CD7F32]/15 bg-[#0A0A0A] p-8 cursor-pointer transition-all duration-500 hover:border-[#CD7F32]/40 hover:shadow-[0_0_35px_rgba(205,127,50,0.15)]"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#CD7F32]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Number */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[#CD7F32]/60">
          {String(index + 1).padStart(2, "0")}
        </span>

        {certificate && (
          <span className="rounded-full border border-[#CD7F32]/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#CD7F32]">
            Certified
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="relative z-10 font-serif text-3xl font-bold tracking-tight text-[#CD7F32] mb-6">
        {title}
      </h3>

      {/* Details */}
      <div className="relative z-10 space-y-4 mb-8">
        <div className="flex justify-between border-b border-[#CD7F32]/10 pb-2">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
            Duration
          </span>

          <span className="text-sm text-white/75">
            {duration}
          </span>
        </div>

        <div className="flex justify-between border-b border-[#CD7F32]/10 pb-2">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
            Location
          </span>

          <span className="text-sm text-white/75">
            {location}
          </span>
        </div>

        {certificate && (
          <div className="flex justify-between border-b border-[#CD7F32]/10 pb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Certificate
            </span>

            <span className="text-sm text-[#CD7F32]">
              Available
            </span>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-8">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[#CD7F32]/20 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-all duration-300 group-hover:border-[#CD7F32]/40 group-hover:text-[#CD7F32]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className="relative z-10 w-full rounded-xl bg-[#CD7F32] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-all duration-300 hover:bg-[#D89247] hover:shadow-[0_0_20px_rgba(205,127,50,0.35)]"
      >
        {isLoggedIn ? "Apply Now" : "Login To Apply"}
      </button>

      {/* Footer */}
      {!isLoggedIn && (
        <p className="relative z-10 mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/35">
          Authentication Required
        </p>
      )}

      {/* Bottom Accent Line */}
      <div className="relative z-10 mt-6 h-px w-12 bg-[#CD7F32]/30 transition-all duration-500 group-hover:w-24 group-hover:bg-[#CD7F32]" />
    </div>
  )
}