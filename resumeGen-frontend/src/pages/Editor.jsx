import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import "./Editor.css";

const emptyResume = {
  full_name: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  summary: "",
  education: [],
  projects: [],
  skills: [],
  experiences: [],
};

const emptyEducation = {
  institution: "",
  location: "",
  degree: "",
  start_date: "",
  end_date: "",
};

const emptyProject = {
  title: "",
  tech_stack: "",
  duration: "",
  description: "",
  points: [],
};

const emptySkill = {
  category: "",
  items: "",
};

const emptyExperience = {
  role: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  points: [],
};

/* ── Sparkle button for inline AI enhance ─────────────────── */
function EnhanceBtn({ text, fieldType, context, onEnhanced }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!text || !text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/enhance-field", {
        text,
        fieldType,
        context,
      });
      if (data.enhanced) onEnhanced(data.enhanced);
    } catch (err) {
      console.error("Enhance failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`enhance-btn ${loading ? "enhancing" : ""}`}
      onClick={handleClick}
      disabled={!text?.trim() || loading}
      title={text?.trim() ? "Enhance with AI" : "Type something first"}
    >
      {loading ? (
        <span className="enhance-spinner" />
      ) : (
        "✨"
      )}
    </button>
  );
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [resume, setResume] = useState(emptyResume);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/${id}`)
        .then(({ data }) => {
          setResume({
            ...data,
            skills: data.skills.map((s) => ({
              ...s,
              items:
                typeof s.items === "string"
                  ? s.items
                  : Array.isArray(s.items)
                  ? s.items.join(", ")
                  : "",
            })),
          });
        })
        .catch((err) => {
          console.error("Failed to fetch resume:", err);
          navigate("/dashboard");
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const updateField = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  // Education
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { ...emptyEducation }],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Projects
  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...emptyProject, points: [] }],
    }));
  };

  const updateProject = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Project Points
  const addPoint = (projectIndex) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projectIndex
          ? { ...proj, points: [...proj.points, { point: "" }] }
          : proj
      ),
    }));
  };

  const updatePoint = (projectIndex, pointIndex, value) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projectIndex
          ? {
              ...proj,
              points: proj.points.map((p, j) =>
                j === pointIndex ? { ...p, point: value } : p
              ),
            }
          : proj
      ),
    }));
  };

  const removePoint = (projectIndex, pointIndex) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projectIndex
          ? { ...proj, points: proj.points.filter((_, j) => j !== pointIndex) }
          : proj
      ),
    }));
  };

  // Skills
  const addSkill = () => {
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...emptySkill }],
    }));
  };

  const updateSkill = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const removeSkill = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Experience
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { ...emptyExperience, points: [] }],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e, i) =>
        i === index ? { ...e, [field]: value } : e
      ),
    }));
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Experience Points
  const addExpPoint = (expIndex) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? { ...exp, points: [...exp.points, { point: "" }] }
          : exp
      ),
    }));
  };

  const updateExpPoint = (expIndex, pointIndex, value) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              points: exp.points.map((p, j) =>
                j === pointIndex ? { ...p, point: value } : p
              ),
            }
          : exp
      ),
    }));
  };

  const removeExpPoint = (expIndex, pointIndex) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? { ...exp, points: exp.points.filter((_, j) => j !== pointIndex) }
          : exp
      ),
    }));
  };

  // Trim all string values in an object/array recursively
  const trimStrings = (obj) => {
    if (typeof obj === "string") return obj.trim();
    if (Array.isArray(obj)) return obj.map(trimStrings);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, trimStrings(v)])
      );
    }
    return obj;
  };

  // Show toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = trimStrings({
        ...resume,
        skills: resume.skills.map((s) => ({
          ...s,
          items: s.items,
        })),
      });

      if (isEditing) {
        await api.put(`/${id}`, payload);
        showToast("success", "Resume saved successfully!");
      } else {
        const { data } = await api.post("/", payload);
        showToast("success", "Resume created successfully!");
        navigate(`/editor/${data.id}`);
      }
    } catch (err) {
      console.error("Failed to save:", err);
      showToast("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="section text-center">
        <p>Loading resume...</p>
      </div>
    );
  }

  const sections = [
    { key: "personal", label: "Personal" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
  ];

  return (
    <div className="editor section">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
      <div className="editor-header">
        <h1 className="section-title">
          {isEditing ? "Edit" : "Create"} <span className="highlight">Resume</span>
        </h1>
        <div className="editor-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Resume"}
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="editor-tabs">
        {sections.map((s) => (
          <button
            key={s.key}
            className={`editor-tab ${activeSection === s.key ? "active" : ""}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeSection === "personal" && (
        <div className="editor-section card">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                value={resume.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={resume.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                value={resume.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                value={resume.linkedin || ""}
                onChange={(e) => updateField("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub</label>
              <input
                value={resume.github || ""}
                onChange={(e) => updateField("github", e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
            <div className="form-group" />
          </div>
          <div className="form-group">
            <label>Summary</label>
            <div className="input-with-enhance">
              <textarea
                value={resume.summary || ""}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder="A brief professional summary..."
                rows={4}
              />
              <EnhanceBtn
                text={resume.summary}
                fieldType="summary"
                context={resume.projects.map((p) => p.title).join(", ")}
                onEnhanced={(val) => updateField("summary", val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {activeSection === "education" && (
        <div className="editor-section">
          {resume.education.map((edu, i) => (
            <div className="card editor-item" key={i}>
              <div className="editor-item-header">
                <h3>Education {i + 1}</h3>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeEducation(i)}
                >
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(i, "institution", e.target.value)
                    }
                    placeholder="University of Example"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    value={edu.location || ""}
                    onChange={(e) =>
                      updateEducation(i, "location", e.target.value)
                    }
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Degree</label>
                <input
                  value={edu.degree}
                  onChange={(e) => updateEducation(i, "degree", e.target.value)}
                  placeholder="B.S. in Computer Science"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    value={edu.start_date || ""}
                    onChange={(e) =>
                      updateEducation(i, "start_date", e.target.value)
                    }
                    placeholder="Aug 2020"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    value={edu.end_date || ""}
                    onChange={(e) =>
                      updateEducation(i, "end_date", e.target.value)
                    }
                    placeholder="May 2024"
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" onClick={addEducation}>
            + Add Education
          </button>
        </div>
      )}

      {/* Projects */}
      {activeSection === "projects" && (
        <div className="editor-section">
          {resume.projects.map((proj, i) => (
            <div className="card editor-item" key={i}>
              <div className="editor-item-header">
                <h3>Project {i + 1}</h3>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeProject(i)}
                >
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <div className="input-with-enhance">
                    <input
                      value={proj.title}
                      onChange={(e) => updateProject(i, "title", e.target.value)}
                      placeholder="Project Name"
                    />
                    <EnhanceBtn
                      text={proj.title}
                      fieldType="title"
                      onEnhanced={(val) => updateProject(i, "title", val)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tech Stack</label>
                  <input
                    value={proj.tech_stack || ""}
                    onChange={(e) =>
                      updateProject(i, "tech_stack", e.target.value)
                    }
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  value={proj.duration || ""}
                  onChange={(e) =>
                    updateProject(i, "duration", e.target.value)
                  }
                  placeholder="Jun 2024 – Aug 2024"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <div className="input-with-enhance">
                  <textarea
                    value={proj.description || ""}
                    onChange={(e) =>
                      updateProject(i, "description", e.target.value)
                    }
                    placeholder="Brief description of the project..."
                    rows={2}
                  />
                  <EnhanceBtn
                    text={proj.description}
                    fieldType="description"
                    context={proj.title}
                    onEnhanced={(val) => updateProject(i, "description", val)}
                  />
                </div>
              </div>

              {/* Points */}
              <div className="points-section">
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--text-secondary)",
                  }}
                >
                  Bullet Points
                </label>
                {proj.points.map((pt, j) => (
                  <div className="point-row" key={j}>
                    <input
                      value={pt.point}
                      onChange={(e) => updatePoint(i, j, e.target.value)}
                      placeholder="Describe an achievement or responsibility..."
                    />
                    <EnhanceBtn
                      text={pt.point}
                      fieldType="bullet_point"
                      context={`${proj.title} — ${proj.tech_stack || ""}`}
                      onEnhanced={(val) => updatePoint(i, j, val)}
                    />
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removePoint(i, j)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-sm mt-1"
                  onClick={() => addPoint(i)}
                >
                  + Add Point
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" onClick={addProject}>
            + Add Project
          </button>
        </div>
      )}

      {/* Experience */}
      {activeSection === "experience" && (
        <div className="editor-section">
          {resume.experiences.map((exp, i) => (
            <div className="card editor-item" key={i}>
              <div className="editor-item-header">
                <h3>Experience {i + 1}</h3>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeExperience(i)}
                >
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role / Title</label>
                  <input
                    value={exp.role}
                    onChange={(e) => updateExperience(i, "role", e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                    placeholder="Google"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    value={exp.location || ""}
                    onChange={(e) =>
                      updateExperience(i, "location", e.target.value)
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    value={exp.start_date || ""}
                    onChange={(e) =>
                      updateExperience(i, "start_date", e.target.value)
                    }
                    placeholder="Jun 2023"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    value={exp.end_date || ""}
                    onChange={(e) =>
                      updateExperience(i, "end_date", e.target.value)
                    }
                    placeholder="Present"
                  />
                </div>
              </div>

              {/* Experience Bullet Points */}
              <div className="points-section">
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--text-secondary)",
                  }}
                >
                  Bullet Points
                </label>
                {exp.points.map((pt, j) => (
                  <div className="point-row" key={j}>
                    <input
                      value={pt.point}
                      onChange={(e) => updateExpPoint(i, j, e.target.value)}
                      placeholder="Describe an achievement or responsibility..."
                    />
                    <EnhanceBtn
                      text={pt.point}
                      fieldType="bullet_point"
                      context={`${exp.role} at ${exp.company}`}
                      onEnhanced={(val) => updateExpPoint(i, j, val)}
                    />
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeExpPoint(i, j)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-sm mt-1"
                  onClick={() => addExpPoint(i)}
                >
                  + Add Point
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" onClick={addExperience}>
            + Add Experience
          </button>
        </div>
      )}

      {/* Skills */}
      {activeSection === "skills" && (
        <div className="editor-section">
          {resume.skills.map((skill, i) => (
            <div className="card editor-item" key={i}>
              <div className="editor-item-header">
                <h3>Skill Group {i + 1}</h3>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSkill(i)}
                >
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    value={skill.category}
                    onChange={(e) => updateSkill(i, "category", e.target.value)}
                    placeholder="Languages, Frameworks, Tools..."
                  />
                </div>
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input
                    value={skill.items}
                    onChange={(e) => updateSkill(i, "items", e.target.value)}
                    placeholder="JavaScript, Python, Go..."
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" onClick={addSkill}>
            + Add Skill Group
          </button>
        </div>
      )}
    </div>
  );
}
