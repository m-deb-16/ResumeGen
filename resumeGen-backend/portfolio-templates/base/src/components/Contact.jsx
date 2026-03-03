import { useReveal } from '../hooks/useReveal'

function Contact({ data, theme, sectionNum }) {
  const reveal = useReveal()
  const isMinimal = theme === 'minimal'

  if (isMinimal) {
    // Minimal: simple footer strip
    return (
      <footer className="contact" id="contact" ref={reveal.ref}>
        <div className={reveal.className}>
          <div className="contact-strip">
            <div className="contact-strip-left">
              <span className="contact-heading">Let's work together.</span>
              <span className="contact-subtext">Available for freelance & full-time roles.</span>
            </div>
            <div className="contact-strip-right">
              {data.email && (
                <a href={`mailto:${data.email}`} className="contact-cta">{data.email}</a>
              )}
              {data.phone && (
                <a href={`tel:${data.phone}`} className="contact-cta">{data.phone}</a>
              )}
              {data.linkedin && (
                <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-cta">LinkedIn ↗</a>
              )}
              {data.github && (
                <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="contact-cta">GitHub ↗</a>
              )}
            </div>
          </div>
          <div className="contact-bottom">
            <span>Built with ResumeGen</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    )
  }

  // Dark Glass: card grid layout
  return (
    <footer className="contact" id="contact" ref={reveal.ref}>
      <div className={reveal.className}>
        <h2 className="section-title">
          <span className="section-number">{sectionNum}.</span> Get in Touch
        </h2>
        <p className="contact-intro">
          Interested in working together? Feel free to reach out.
        </p>
        <div className="contact-links">
          {data.email && (
            <a href={`mailto:${data.email}`} className="contact-link">
              <span className="contact-icon">✉</span>
              <span className="contact-label">Email</span>
              <span className="contact-value">{data.email}</span>
            </a>
          )}
          {data.phone && (
            <a href={`tel:${data.phone}`} className="contact-link">
              <span className="contact-icon">☎</span>
              <span className="contact-label">Phone</span>
              <span className="contact-value">{data.phone}</span>
            </a>
          )}
          {data.linkedin && (
            <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-link">
              <span className="contact-icon">🔗</span>
              <span className="contact-label">LinkedIn</span>
              <span className="contact-value">View Profile ↗</span>
            </a>
          )}
          {data.github && (
            <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="contact-link">
              <span className="contact-icon">💻</span>
              <span className="contact-label">GitHub</span>
              <span className="contact-value">View Profile ↗</span>
            </a>
          )}
        </div>
        <p className="contact-footer">
          Built with <span className="footer-heart">♥</span> using ResumeGen
        </p>
      </div>
    </footer>
  )
}

export default Contact
