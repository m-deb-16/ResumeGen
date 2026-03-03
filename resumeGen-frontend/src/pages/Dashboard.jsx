import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import "./Dashboard.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} at ${hours}:${minutes}`;
};

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioMenu, setPortfolioMenu] = useState(null); // resume id or null
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/");
      setResumes(data);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/${id}`);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  };

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async (id, name) => {
    try {
      const response = await api.get(`/${id}/pdf`, { responseType: "blob" });
      triggerDownload(response.data, `${name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleDownloadLatex = async (id, name) => {
    try {
      const response = await api.get(`/${id}/latex`, { responseType: "blob" });
      triggerDownload(response.data, `${name.replace(/\s+/g, "_")}.tex`);
    } catch (err) {
      console.error("Failed to download LaTeX:", err);
      alert("Failed to download LaTeX. Please try again.");
    }
  };

  const handleDownloadPortfolio = async (id, name, template) => {
    setPortfolioMenu(null);
    try {
      const response = await api.post(
        `/${id}/portfolio`,
        { template },
        { responseType: "blob" }
      );
      triggerDownload(
        response.data,
        `${name.replace(/\s+/g, "_")}_portfolio.zip`
      );
    } catch (err) {
      console.error("Failed to download portfolio:", err);
      alert("Failed to download portfolio. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="section text-center">
        <p>Loading your resumes...</p>
      </div>
    );
  }

  const templates = [
    { key: "minimal", label: "🌕 Minimal" },
    { key: "dark-glass", label: "🌑 Dark Glass" },
  ];

  return (
    <div className="dashboard section">
      <div className="dashboard-header">
        <h1 className="section-title">
          Your <span className="highlight">Resumes</span>
        </h1>
        <Link to="/editor" className="btn btn-primary">
          + New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="dashboard-empty card">
          <div className="empty-icon">📝</div>
          <h3>No resumes yet</h3>
          <p className="text-secondary">
            Create your first resume to get started
          </p>
          <Link to="/editor" className="btn btn-primary mt-2">
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="resume-grid">
          {resumes.map((resume) => (
            <div className="card resume-card" key={resume.id}>
              <div className="resume-card-header">
                <h3>{resume.full_name}</h3>
                <div className="resume-card-dates">
                  <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                    Created: {formatDate(resume.createdAt)}
                  </span>
                  {resume.updatedAt && resume.updatedAt !== resume.createdAt && (
                    <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                      Last edited: {formatDate(resume.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                {resume.email}
              </p>

              <div className="resume-card-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/editor/${resume.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    handleDownloadPdf(resume.id, resume.full_name)
                  }
                >
                  PDF
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() =>
                    handleDownloadLatex(resume.id, resume.full_name)
                  }
                >
                  LaTeX
                </button>

                {/* Portfolio with template selection */}
                <div className="portfolio-dropdown">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() =>
                      setPortfolioMenu(
                        portfolioMenu === resume.id ? null : resume.id
                      )
                    }
                  >
                    Portfolio ▾
                  </button>
                  {portfolioMenu === resume.id && (
                    <div className="portfolio-menu">
                      {templates.map((t) => (
                        <button
                          key={t.key}
                          className="portfolio-menu-item"
                          onClick={() =>
                            handleDownloadPortfolio(
                              resume.id,
                              resume.full_name,
                              t.key
                            )
                          }
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(resume.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
