import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Experience from './components/Experience'
import Contact from './components/Contact'
import resumeData from './data'
import './themes/{{THEME}}.css'

const THEME = '{{THEME}}'

function App() {
  // Build dynamic section numbering — only count sections that have data
  const sectionNum = {}
  let num = 1

  if (resumeData.summary) {
    sectionNum.about = String(num++).padStart(2, '0')
  }
  if (resumeData.skills?.length) {
    sectionNum.skills = String(num++).padStart(2, '0')
  }
  if (resumeData.experiences?.length) {
    sectionNum.experience = String(num++).padStart(2, '0')
  }
  if (resumeData.projects?.length) {
    sectionNum.projects = String(num++).padStart(2, '0')
  }
  if (resumeData.education?.length) {
    sectionNum.education = String(num++).padStart(2, '0')
  }
  // Contact always shows
  sectionNum.contact = String(num++).padStart(2, '0')

  return (
    <div className={`portfolio theme-${THEME}${resumeData.experiences?.length ? ' has-experience' : ''}`}>
      <Hero data={resumeData} theme={THEME} />
      <About data={resumeData} theme={THEME} sectionNum={sectionNum.about} />
      <Skills data={resumeData} theme={THEME} sectionNum={sectionNum.skills} />
      <Experience data={resumeData} theme={THEME} sectionNum={sectionNum.experience} />
      <Projects data={resumeData} theme={THEME} sectionNum={sectionNum.projects} />
      <Education data={resumeData} theme={THEME} sectionNum={sectionNum.education} />
      <Contact data={resumeData} theme={THEME} sectionNum={sectionNum.contact} />
    </div>
  )
}

export default App
