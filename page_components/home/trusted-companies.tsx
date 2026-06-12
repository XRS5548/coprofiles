const companies = [
  "TechCorp", "InnovateLabs", "FutureScale", "DataFlow",
  "CloudNine", "StartupHub", "DevStudio", "AIVentures",
]

export function TrustedCompanies() {
  return (
    <div className="mt-16">
      <p className="font-mono text-xs text-muted-foreground text-center mb-6 uppercase tracking-[0.2em]">
        Trusted by 5,000+ innovative companies worldwide
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {companies.map((company) => (
          <div
            key={company}
            className="text-muted-foreground/40 hover:text-foreground transition-colors duration-100 font-serif text-lg font-bold tracking-tight"
          >
            {company}
          </div>
        ))}
      </div>
    </div>
  )
}
