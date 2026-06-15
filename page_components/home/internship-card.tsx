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
      className="group p-8 border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white hover:text-luxury-bg cursor-pointer"
    >
      <span className="text-xs text-white/30 group-hover:text-luxury-bg/60 transition-colors duration-300 tracking-widest font-sans">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-luxury-bg transition-colors duration-300 mt-2 mb-6">
        {title}
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 group-hover:text-luxury-bg/60 transition-colors duration-300 uppercase tracking-widest font-sans">
            Duration
          </span>
          <span className="text-xs text-white/70 group-hover:text-luxury-bg/80 transition-colors duration-300 font-sans">
            {duration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 group-hover:text-luxury-bg/60 transition-colors duration-300 uppercase tracking-widest font-sans">
            Location
          </span>
          <span className="text-xs text-white/70 group-hover:text-luxury-bg/80 transition-colors duration-300 font-sans">
            {location}
          </span>
        </div>
        {certificate && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 group-hover:text-luxury-bg/60 transition-colors duration-300 uppercase tracking-widest font-sans">
              Certificate
            </span>
            <span className="text-xs text-white/70 group-hover:text-luxury-bg/80 transition-colors duration-300 font-sans">
              Available
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 text-xs uppercase tracking-widest border border-white/20 text-white/60 group-hover:border-luxury-bg/30 group-hover:text-luxury-bg/70 transition-colors duration-300 font-sans"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="w-full py-3 text-sm uppercase tracking-[0.15em] border border-white/20 text-white/60 bg-transparent group-hover:border-luxury-bg group-hover:text-luxury-bg transition-colors duration-300 text-center font-sans font-medium">
        {isLoggedIn ? "Apply Now" : "Login to Apply"}
      </div>

      {!isLoggedIn && (
        <p className="text-xs text-center mt-3 text-white/20 group-hover:text-luxury-bg/40 transition-colors duration-300 uppercase tracking-widest font-sans">
          Login required to apply
        </p>
      )}
    </div>
  )
}
