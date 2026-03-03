import { useReveal } from '../hooks/useReveal'

function Experience({ data, theme, sectionNum }) {
  const reveal = useReveal()
  if (!data.experiences?.length) return null
  const isMinimal = theme === 'minimal'

  if (isMinimal) {
    // Minimal: numbered rows like projects
    return (
      <section className="experience" id="experience" ref={reveal.ref}>
        <div className={reveal.className}>
          <div className="experience-label">Experience</div>
          <div className="experience-editorial">
            {data.experiences.map((exp, index) => (
              <div className="experience-row" key={index}>
                <div className="experience-index">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="experience-info">
                  <div className="experience-title-row">
                    <h3 className="experience-role">{exp.role}</h3>
                    {(exp.start_date || exp.end_date) && (
                      <span className="experience-dates">
                        {exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}
                      </span>
                    )}
                  </div>
                  <div className="experience-company-line">
                    {exp.company}
                    {exp.location && <span> · {exp.location}</span>}
                  </div>
                  {exp.points?.length > 0 && (
                    <ul className="experience-bullets">
                      {exp.points.map((point, i) => (
                        <li key={i}>{typeof point === 'string' ? point : point.point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Dark Glass: glass cards
  return (
    <section className="experience" id="experience" ref={reveal.ref}>
      <div className={reveal.className}>
        <h2 className="section-title">
          <span className="section-number">{sectionNum}.</span> Experience
        </h2>
        <div className="experience-grid">
          {data.experiences.map((exp, index) => (
            <div className="experience-card" key={index}>
              <div className="experience-card-accent" />
              <div className="experience-header">
                <div>
                  <h3 className="experience-role">{exp.role}</h3>
                  <div className="experience-company">
                    {exp.company}
                    {exp.location && <span className="experience-location"> · {exp.location}</span>}
                  </div>
                </div>
                {(exp.start_date || exp.end_date) && (
                  <span className="experience-dates">
                    {exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}
                  </span>
                )}
              </div>
              {exp.points?.length > 0 && (
                <ul className="experience-points">
                  {exp.points.map((point, i) => (
                    <li key={i}>{typeof point === 'string' ? point : point.point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
