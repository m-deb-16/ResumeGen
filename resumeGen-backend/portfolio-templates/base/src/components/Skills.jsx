import { useReveal } from '../hooks/useReveal'

function Skills({ data, theme, sectionNum }) {
  const reveal = useReveal()
  if (!data.skills?.length) return null
  const isMinimal = theme === 'minimal'

  if (isMinimal) {
    // Minimal: horizontal flowing tags grouped, no cards
    return (
      <section className="skills" id="skills" ref={reveal.ref}>
        <div className={reveal.className}>
          <div className="skills-editorial">
            <div className="skills-label">Skills & Tools</div>
            <div className="skills-flow">
              {data.skills.map((skill, index) => (
                <div className="skill-group" key={index}>
                  {skill.category && (
                    <span className="skill-group-name">{skill.category}:</span>
                  )}
                  {skill.items && skill.items.split(',').map((item, i) => (
                    <span className="skill-pill" key={i}>{item.trim()}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="skills" id="skills" ref={reveal.ref}>
      <div className={reveal.className}>
        <h2 className="section-title">
          <span className="section-number">{sectionNum}.</span> Skills
        </h2>
        <div className="skills-grid">
          {data.skills.map((skill, index) => (
            <div className="skill-category" key={index}>
              {skill.category && (
                <h3 className="skill-category-title">{skill.category}</h3>
              )}
              {skill.items && (
                <div className="skill-items">
                  {skill.items.split(',').map((item, i) => (
                    <span className="skill-tag" key={i}>{item.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
