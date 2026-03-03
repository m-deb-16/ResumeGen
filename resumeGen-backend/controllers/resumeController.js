import prisma from "../lib/prisma.js";
import { generateLatex } from "../utils/latexGenerator.js";
import { enhanceResume, enhanceField } from "../utils/aiEnhancer.js";
import { generatePortfolioZip } from "../utils/portfolioGenerator.js";

export const createResume = async (req, res) => {
  try {
    const data = req.body;
    const result = await prisma.resume.create({
      data: {
        userId: req.user.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin,
        github: data.github,
        summary: data.summary,

        education: data.education?.length
          ? {
              create: data.education.map((edu) => ({
                institution: edu.institution,
                location: edu.location,
                degree: edu.degree,
                start_date: edu.start_date,
                end_date: edu.end_date,
              })),
            }
          : undefined,

        projects: data.projects?.length
          ? {
              create: data.projects.map((project) => ({
                title: project.title,
                tech_stack: project.tech_stack,
                duration: project.duration,
                description: project.description,
                points: project.points?.length
                  ? {
                      create: project.points.map((p) => ({
                        point: typeof p === "string" ? p : p.point,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,

        skills: data.skills?.length
          ? {
              create: data.skills.map((skill) => ({
                category: skill.category,
                items: skill.items,
              })),
            }
          : undefined,

        experiences: data.experiences?.length
          ? {
              create: data.experiences.map((exp) => ({
                role: exp.role,
                company: exp.company,
                location: exp.location,
                start_date: exp.start_date,
                end_date: exp.end_date,
                points: exp.points?.length
                  ? {
                      create: exp.points.map((p) => ({
                        point: typeof p === "string" ? p : p.point,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create resume" });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        education: true,
        projects: {
          include: { points: true },
        },
        skills: true,
        experiences: {
          include: { points: true },
        },
      },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

export const getAllresumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    await prisma.resume.delete({
      where: { id },
    });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete resume" });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingResume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existingResume || existingResume.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const result = await prisma.$transaction(
      async (tx) => {
        await tx.resume.update({
          where: { id },
          data: {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            linkedin: data.linkedin,
            github: data.github,
            summary: data.summary,
          },
        });

        // Education — batch delete removed entries
        const existingEducation = await tx.education.findMany({
          where: { resumeId: id },
        });

        const incomingEducationIds =
          data.education?.filter((e) => e.id).map((e) => e.id) || [];

        const eduToDelete = existingEducation
          .filter((edu) => !incomingEducationIds.includes(edu.id))
          .map((edu) => edu.id);

        if (eduToDelete.length) {
          await tx.education.deleteMany({ where: { id: { in: eduToDelete } } });
        }

        if (data.education?.length) {
          for (const edu of data.education) {
            if (edu.id) {
              await tx.education.update({
                where: { id: edu.id },
                data: {
                  institution: edu.institution,
                  location: edu.location,
                  degree: edu.degree,
                  start_date: edu.start_date,
                  end_date: edu.end_date,
                },
              });
            } else {
              await tx.education.create({
                data: {
                  institution: edu.institution,
                  location: edu.location,
                  degree: edu.degree,
                  start_date: edu.start_date,
                  end_date: edu.end_date,
                  resumeId: id,
                },
              });
            }
          }
        }

        // Projects — batch delete removed projects (cascade deletes their points)
        const existingProjects = await tx.project.findMany({
          where: { resumeId: id },
          include: { points: true },
        });

        const incomingProjectIds =
          data.projects?.filter((p) => p.id).map((p) => p.id) || [];

        const projToDelete = existingProjects
          .filter((p) => !incomingProjectIds.includes(p.id))
          .map((p) => p.id);

        if (projToDelete.length) {
          await tx.projectPoint.deleteMany({
            where: { projectId: { in: projToDelete } },
          });
          await tx.project.deleteMany({ where: { id: { in: projToDelete } } });
        }

        if (data.projects?.length) {
          for (const project of data.projects) {
            let projectId;

            if (project.id) {
              await tx.project.update({
                where: { id: project.id },
                data: {
                  title: project.title,
                  tech_stack: project.tech_stack,
                  duration: project.duration,
                  description: project.description,
                },
              });
              projectId = project.id;
            } else {
              const createdProject = await tx.project.create({
                data: {
                  title: project.title,
                  tech_stack: project.tech_stack,
                  duration: project.duration,
                  description: project.description,
                  resumeId: id,
                },
              });
              projectId = createdProject.id;
            }

            // Batch delete removed points for this project
            const existingPoints = await tx.projectPoint.findMany({
              where: { projectId },
            });

            const incomingPointIds =
              project.points?.filter((p) => p.id).map((p) => p.id) || [];

            const pointsToDelete = existingPoints
              .filter((p) => !incomingPointIds.includes(p.id))
              .map((p) => p.id);

            if (pointsToDelete.length) {
              await tx.projectPoint.deleteMany({
                where: { id: { in: pointsToDelete } },
              });
            }

            if (project.points?.length) {
              for (const point of project.points) {
                if (point.id) {
                  await tx.projectPoint.update({
                    where: { id: point.id },
                    data: { point: point.point },
                  });
                } else {
                  await tx.projectPoint.create({
                    data: {
                      point: point.point,
                      projectId,
                    },
                  });
                }
              }
            }
          }
        }

        // Skills — batch delete removed skills
        const existingSkills = await tx.skill.findMany({
          where: { resumeId: id },
        });

        const incomingSkillIds =
          data.skills?.filter((s) => s.id).map((s) => s.id) || [];

        const skillsToDelete = existingSkills
          .filter((s) => !incomingSkillIds.includes(s.id))
          .map((s) => s.id);

        if (skillsToDelete.length) {
          await tx.skill.deleteMany({ where: { id: { in: skillsToDelete } } });
        }

        if (data.skills?.length) {
          for (const skill of data.skills) {
            if (skill.id) {
              await tx.skill.update({
                where: { id: skill.id },
                data: {
                  category: skill.category,
                  items: skill.items,
                },
              });
            } else {
              await tx.skill.create({
                data: {
                  category: skill.category,
                  items: skill.items,
                  resumeId: id,
                },
              });
            }
          }
        }

        // Experiences — batch delete removed experiences (cascade deletes their points)
        const existingExperiences = await tx.experience.findMany({
          where: { resumeId: id },
          include: { points: true },
        });

        const incomingExperienceIds =
          data.experiences?.filter((e) => e.id).map((e) => e.id) || [];

        const expToDelete = existingExperiences
          .filter((e) => !incomingExperienceIds.includes(e.id))
          .map((e) => e.id);

        if (expToDelete.length) {
          await tx.experiencePoint.deleteMany({
            where: { experienceId: { in: expToDelete } },
          });
          await tx.experience.deleteMany({
            where: { id: { in: expToDelete } },
          });
        }

        if (data.experiences?.length) {
          for (const exp of data.experiences) {
            let experienceId;

            if (exp.id) {
              await tx.experience.update({
                where: { id: exp.id },
                data: {
                  role: exp.role,
                  company: exp.company,
                  location: exp.location,
                  start_date: exp.start_date,
                  end_date: exp.end_date,
                },
              });
              experienceId = exp.id;
            } else {
              const created = await tx.experience.create({
                data: {
                  role: exp.role,
                  company: exp.company,
                  location: exp.location,
                  start_date: exp.start_date,
                  end_date: exp.end_date,
                  resumeId: id,
                },
              });
              experienceId = created.id;
            }

            // Batch delete removed points for this experience
            const existingExpPoints = await tx.experiencePoint.findMany({
              where: { experienceId },
            });

            const incomingExpPointIds =
              exp.points?.filter((p) => p.id).map((p) => p.id) || [];

            const expPointsToDelete = existingExpPoints
              .filter((p) => !incomingExpPointIds.includes(p.id))
              .map((p) => p.id);

            if (expPointsToDelete.length) {
              await tx.experiencePoint.deleteMany({
                where: { id: { in: expPointsToDelete } },
              });
            }

            if (exp.points?.length) {
              for (const point of exp.points) {
                if (point.id) {
                  await tx.experiencePoint.update({
                    where: { id: point.id },
                    data: { point: point.point },
                  });
                } else {
                  await tx.experiencePoint.create({
                    data: {
                      point: point.point,
                      experienceId,
                    },
                  });
                }
              }
            }
          }
        }

        return { message: "Resume updated successfully" };
      },
      { timeout: 15000 },
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update resume" });
  }
};

export const downloadLatex = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        education: true,
        projects: {
          include: { points: true },
        },
        skills: true,
        experiences: {
          include: { points: true },
        },
      },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const latexContent = generateLatex(resume);

    res.setHeader("Content-Type", "application/x-tex");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.full_name.replace(/\s+/g, "_")}.tex"`,
    );

    res.send(latexContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate LaTeX" });
  }
};

export const downloadPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        education: true,
        projects: {
          include: { points: true },
        },
        skills: true,
        experiences: {
          include: { points: true },
        },
      },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const latexContent = generateLatex(resume);

    const formData = new FormData();
    formData.append("filecontents[]", latexContent);
    formData.append("filename[]", "document.tex");
    formData.append("engine", "pdflatex");
    formData.append("return", "pdf");

    const response = await fetch("https://texlive.net/cgi-bin/latexcgi", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("LaTeX compilation API returned status:", response.status);
      return res.status(502).json({ error: "Failed to compile LaTeX to PDF" });
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.full_name.replace(/\s+/g, "_")}.pdf"`,
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

export const enhanceWithAI = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobDescription } = req.body || {};

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        education: true,
        projects: {
          include: { points: true },
        },
        skills: true,
      },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const enhanced = await enhanceResume(resume, jobDescription);

    res.json({ enhanced });
  } catch (error) {
    console.error("AI Enhancement error:", error);
    res.status(500).json({ error: "Failed to enhance resume with AI" });
  }
};

export const generatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { template = "minimal" } = req.body || {};

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        education: true,
        projects: {
          include: { points: true },
        },
        skills: true,
        experiences: {
          include: { points: true },
        },
      },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const safeName = resume.full_name.replace(/\s+/g, "_");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${safeName}_portfolio.zip`,
    );

    generatePortfolioZip(resume, template, res);
  } catch (error) {
    console.error("Portfolio generation error:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: error.message || "Failed to generate portfolio" });
    }
  }
};

export const enhanceFieldText = async (req, res) => {
  try {
    const { text, fieldType, context } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const enhanced = await enhanceField(text, fieldType, context);
    res.json({ enhanced });
  } catch (error) {
    console.error("Field enhancement error:", error);
    res.status(500).json({ error: "Failed to enhance text" });
  }
};
