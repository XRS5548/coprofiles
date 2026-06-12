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
      className="group p-8 border border-foreground bg-background transition-colors duration-100 hover:bg-foreground hover:text-background cursor-pointer"
    >
      <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60 transition-colors duration-100 tracking-widest">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:text-background transition-colors duration-100 mt-2 mb-6">
        {title}
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest">
            Duration
          </span>
          <span className="font-mono text-xs text-foreground group-hover:text-background transition-colors duration-100">
            {duration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest">
            Location
          </span>
          <span className="font-mono text-xs text-foreground group-hover:text-background transition-colors duration-100">
            {location}
          </span>
        </div>
        {certificate && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest">
              Certificate
            </span>
            <span className="font-mono text-xs text-foreground group-hover:text-background transition-colors duration-100">
              Available
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 font-mono text-xs uppercase tracking-widest border border-foreground text-foreground group-hover:border-background group-hover:text-background transition-colors duration-100"
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={handleApplyClick}
        className="w-full py-3 font-mono text-sm uppercase tracking-widest border-2 border-foreground text-foreground bg-transparent group-hover:border-background group-hover:text-background transition-colors duration-100"
      >
        {isLoggedIn ? "Apply Now" : "Login to Apply"}
      </button>

      {!isLoggedIn && (
        <p className="font-mono text-xs text-center mt-3 text-muted-foreground group-hover:text-background/60 transition-colors duration-100 uppercase tracking-widest">
          Login required to apply
        </p>
      )}
    </div>
  )
}
