import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeLatex = (text) => {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash ")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}");
};

export const generateLatex = (resume) => {
  const templatePath = path.join(__dirname, "../templates/main_template.tex");
  let template = fs.readFileSync(templatePath, "utf-8");

  // ===== EDUCATION SECTION =====
  let educationSection = "";

  if (resume.education && resume.education.length > 0) {
    educationSection = `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
`;

    resume.education.forEach((edu) => {
      const dateStr =
        edu.start_date && edu.end_date
          ? `${escapeLatex(edu.start_date)} -- ${escapeLatex(edu.end_date)}`
          : escapeLatex(edu.start_date || edu.end_date || "");
      educationSection += `    \\resumeSubheading
      {${escapeLatex(edu.institution || "")}}{${escapeLatex(edu.location || "")}}
      {${escapeLatex(edu.degree || "")}}{${dateStr}}
`;
    });

    educationSection += `  \\resumeSubHeadingListEnd
`;
  }

  // ===== EXPERIENCE SECTION =====
  let experienceSection = "";

  if (resume.experiences && resume.experiences.length > 0) {
    experienceSection = `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
`;

    resume.experiences.forEach((exp) => {
      const dateStr =
        exp.start_date && exp.end_date
          ? `${escapeLatex(exp.start_date)} -- ${escapeLatex(exp.end_date)}`
          : escapeLatex(exp.start_date || exp.end_date || "");
      experienceSection += `    \\resumeSubheading
      {${escapeLatex(exp.role || "")}}{${dateStr}}
      {${escapeLatex(exp.company || "")}}{${escapeLatex(exp.location || "")}}
      \\resumeItemListStart\n`;

      if (exp.points && exp.points.length > 0) {
        exp.points.forEach((point) => {
          experienceSection += `        \\resumeItem{${escapeLatex(point.point || "")}}\n`;
        });
      }

      experienceSection += `      \\resumeItemListEnd\n`;
    });

    experienceSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // ===== PROJECT SECTION =====
  let projectSection = "";

  if (resume.projects && resume.projects.length > 0) {
    projectSection = `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
`;

    resume.projects.forEach((project) => {
      projectSection += `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(project.title || "")}} $|$ \\emph{${escapeLatex(project.tech_stack || "")}}}{${escapeLatex(project.duration || "")}}\n`;

      if (project.description) {
        projectSection += `          \n          \\emph{${escapeLatex(project.description)}}\n`;
      }

      projectSection += `          \\resumeItemListStart\n`;

      if (project.points && project.points.length > 0) {
        project.points.forEach((point) => {
          projectSection += `            \\resumeItem{${escapeLatex(point.point || "")}}\n`;
        });
      }

      projectSection += `          \\resumeItemListEnd
`;
    });

    projectSection += `    \\resumeSubHeadingListEnd
`;
  }
  // ===== SKILLS SECTION =====
  let skillsSection = "";

  if (resume.skills && resume.skills.length > 0) {
    skillsSection = `
%
%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`;

    resume.skills.forEach((skill, index) => {
      const isLast = index === resume.skills.length - 1;
      if (isLast) {
        skillsSection += `     \\textbf{${escapeLatex(skill.category || "")}}{: ${escapeLatex(skill.items || "")}}\n`;
      } else {
        skillsSection += `     \\textbf{${escapeLatex(skill.category || "")}}{: ${escapeLatex(skill.items || "")}} \\\\\n`;
      }
    });

    skillsSection += `    }}
 \\end{itemize}
`;
  }

  // ===== REPLACE PLACEHOLDERS =====
  template = template.replace(/{{FULL_NAME}}/g, escapeLatex(resume.full_name));
  template = template.replace(/{{PHONE}}/g, escapeLatex(resume.phone));
  template = template.replace(/{{EMAIL}}/g, escapeLatex(resume.email));
  template = template.replace(/{{LINKEDIN}}/g, escapeLatex(resume.linkedin));
  template = template.replace(/{{GITHUB}}/g, escapeLatex(resume.github));
  template = template.replace(/{{EDUCATION_SECTION}}/g, educationSection);
  template = template.replace(/{{EXPERIENCE_SECTION}}/g, experienceSection);
  template = template.replace(/{{PROJECT_SECTION}}/g, projectSection);
  template = template.replace(/{{SKILLS_SECTION}}/g, skillsSection);

  return template;
};
