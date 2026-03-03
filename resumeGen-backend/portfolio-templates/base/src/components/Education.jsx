import { useReveal } from '../hooks/useReveal'

function Education({ data, theme, sectionNum }) {
  const reveal = useReveal()
  if (!data.education?.length) return null
  const isMinimal = theme === 'minimal'

  if (isMinimal) {
    // Minimal: simple stacked blocks, no timeline
    return (
      <section className="education" id="education" ref={reveal.ref}>
        <div className={reveal.className}>
          <div className="education-editorial">
            <div className="education-label">Education</div>
            {data.education.map((edu, index) => (
              <div className="edu-block" key={index}>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-meta">
                  {edu.location && <span>{edu.location}</span>}
                  {(edu.start_date || edu.end_date) && (
                    <span className="edu-dates">
                      {edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Dark Glass: timeline with glowing dots
  return (
    <section className="education" id="education" ref={reveal.ref}>
      <div className={reveal.className}>
        <h2 className="section-title">
          <span className="section-number">{sectionNum}.</span> Education
        </h2>
        <div className="education-timeline">
          {data.education.map((edu, index) => (
            <div className="education-item" key={index}>
              <div className="timeline-dot" />
              <div className="education-content">
                <div className="education-header">
                  <h3 className="education-institution">{edu.institution}</h3>
                  {edu.location && (
                    <span className="education-location">📍 {edu.location}</span>
                  )}
                </div>
                <div className="education-details">
                  {edu.degree && (
                    <span className="education-degree">{edu.degree}</span>
                  )}
                  {(edu.start_date || edu.end_date) && (
                    <span className="education-dates">
                      {edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
