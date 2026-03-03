import { useReveal } from '../hooks/useReveal'

function Projects({ data, theme, sectionNum }) {
  const reveal = useReveal()
  if (!data.projects?.length) return null
  const isMinimal = theme === 'minimal'

  if (isMinimal) {
    // Minimal: numbered list with large index, side-by-side layout
    return (
      <section className="projects" id="projects" ref={reveal.ref}>
        <div className={reveal.className}>
          <div className="projects-label">Projects</div>
          <div className="projects-editorial">
            {data.projects.map((project, index) => (
              <div className="project-row" key={index}>
                <div className="project-index">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="project-info">
                  <div className="project-title-row">
                    <h3 className="project-title">{project.title}</h3>
                    {project.duration && (
                      <span className="project-duration">{project.duration}</span>
                    )}
                  </div>
                  {project.tech_stack && (
                    <div className="project-tech-line">
                      {project.tech_stack}
                    </div>
                  )}
                  {project.description && (
                    <p className="project-desc">{project.description}</p>
                  )}
                  {project.points?.length > 0 && (
                    <ul className="project-bullets">
                      {project.points.map((point, i) => (
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

  // Dark Glass: glass cards with accent bar
  return (
    <section className="projects" id="projects" ref={reveal.ref}>
      <div className={reveal.className}>
        <h2 className="section-title">
          <span className="section-number">{sectionNum}.</span> Projects
        </h2>
        <div className="projects-grid">
          {data.projects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-card-accent" />
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                {project.duration && (
                  <span className="project-duration">{project.duration}</span>
                )}
              </div>
              {project.tech_stack && (
                <div className="project-tech">
                  {project.tech_stack.split(',').map((tech, i) => (
                    <span className="tech-tag" key={i}>{tech.trim()}</span>
                  ))}
                </div>
              )}
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              {project.points?.length > 0 && (
                <ul className="project-points">
                  {project.points.map((point, i) => (
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

export default Projects
