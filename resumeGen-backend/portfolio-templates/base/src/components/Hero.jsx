import { useReveal } from '../hooks/useReveal'

function Hero({ data, theme }) {
  const isMinimal = theme === 'minimal'

  // Minimal: left-aligned, editorial, no nav — just a bold typographic header
  if (isMinimal) {
    return (
      <section className="hero" id="hero">
        <div className="hero-topbar">
          <span className="topbar-name">{data.full_name}</span>
          <div className="topbar-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            {data.experiences?.length > 0 && <a href="#experience">Experience</a>}
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-label">Portfolio '25</span>
            <h1 className="hero-name">
              {data.full_name?.split(' ').map((word, i) => (
                <span key={i} className="hero-name-word">{word}</span>
              ))}
            </h1>
          </div>
          <div className="hero-right">
            {data.summary && (
              <p className="hero-summary">{data.summary}</p>
            )}
            <div className="hero-cta-group">
              {data.linkedin && (
                <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hero-cta">
                  LinkedIn ↗
                </a>
              )}
              {data.github && (
                <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="hero-cta">
                  GitHub ↗
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="hero-cta">
                  {data.email}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="hero-marquee">
          <div className="marquee-track">
            {Array(6).fill(null).map((_, i) => (
              <span key={i} className="marquee-text">
                {data.skills?.map(s => s.items).join(' • ') || 'Developer • Designer • Creator'}
                &nbsp;&nbsp;★&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Dark Glass: centered, gradient name, floating nav, orb background
  return (
    <section className="hero" id="hero">
      <nav className="portfolio-nav">
        <span className="nav-brand">{data.full_name?.split(' ')[0]}</span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          {data.experiences?.length > 0 && <a href="#experience">Experience</a>}
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      <div className="hero-content">
        <div className="hero-badge">Portfolio</div>
        <h1 className="hero-name">
          <span className="hero-greeting">Hi, I'm</span>
          <span className="hero-name-text">{data.full_name}</span>
        </h1>
        {data.summary && (
          <p className="hero-tagline">{data.summary}</p>
        )}
        <div className="hero-links">
          {data.email && (
            <a href={`mailto:${data.email}`} className="hero-link">
              <span className="link-icon">✉</span> {data.email}
            </a>
          )}
          {data.phone && (
            <a href={`tel:${data.phone}`} className="hero-link">
              <span className="link-icon">☎</span> {data.phone}
            </a>
          )}
          {data.linkedin && (
            <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hero-link hero-link-primary">
              LinkedIn ↗
            </a>
          )}
          {data.github && (
            <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="hero-link hero-link-primary">
              GitHub ↗
            </a>
          )}
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>↓</span>
      </div>
    </section>
  )
}

export default Hero
