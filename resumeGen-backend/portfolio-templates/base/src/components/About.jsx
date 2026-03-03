import { useReveal } from '../hooks/useReveal'

function About({ data, theme, sectionNum }) {
  const reveal = useReveal()
  if (!data.summary) return null
  const isMinimal = theme === 'minimal'

  if (isMinimal) {
    return (
      <section className="about" id="about" ref={reveal.ref}>
        <div className={reveal.className}>
          <div className="about-editorial">
            <div className="about-label">About</div>
            <blockquote className="about-quote">
              "{data.summary}"
            </blockquote>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="about" id="about" ref={reveal.ref}>
      <div className={reveal.className}>
        <h2 className="section-title">
          <span className="section-number">{sectionNum}.</span> About Me
        </h2>
        <div className="about-card">
          <p className="about-text">{data.summary}</p>
        </div>
      </div>
    </section>
  )
}

export default About
