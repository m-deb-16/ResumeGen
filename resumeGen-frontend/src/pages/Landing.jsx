import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="hero section">
        <div className="hero-content">
          <h1 className="hero-title">
            Build a <span className="highlight">stunning resume</span> in
            minutes
          </h1>
          <p className="hero-subtitle">
            AI-powered resume builder with LaTeX-quality PDFs, portfolio
            generation, and ATS optimization. Land your dream job faster.
          </p>
          <div className="hero-actions">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="btn btn-primary btn-lg"
            >
              Start Building →
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card card">
            <div className="hero-card-header">
              <div className="dot dot-red" />
              <div className="dot dot-yellow" />
              <div className="dot dot-green" />
            </div>
            <div className="hero-card-body">
              <div className="skeleton skeleton-lg" />
              <div className="skeleton skeleton-md" />
              <div className="skeleton skeleton-sm" />
              <div className="skeleton skeleton-md" />
              <div className="skeleton skeleton-xs" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section" id="features">
        <h2 className="section-title">
          <span className="highlight">Features</span>
        </h2>
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">📄</div>
            <h3>LaTeX-Quality PDFs</h3>
            <p className="text-secondary">
              Professional resumes compiled with real LaTeX. No templates, real
              typesetting.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Enhancement</h3>
            <p className="text-secondary">
              Powered by Gemini AI. Optimize bullet points, tailor to job
              descriptions, boost ATS scores.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Portfolio Generator</h3>
            <p className="text-secondary">
              Generate a React portfolio website from your resume data. Choose
              from multiple themes.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Simple </h3>
            <p className="text-secondary">
              Create, edit, and export resumes in minutes with a clean, distraction-free interface.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works section" id="how-it-works">
        <h2 className="section-title">
          <span className="highlight">How it Works</span>
        </h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Enter your details</h3>
              <p className="text-secondary">
                Fill in your education, projects, skills, and experience.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>AI enhances your content</h3>
              <p className="text-secondary">
                AI integration helps rewrite bullet points and optimizes for ATS.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Download & deploy</h3>
              <p className="text-secondary">
                Get your PDF, LaTeX source, or a full portfolio website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer section">
        <hr className="divider" />
        <div className="footer-content">
          <span className="navbar-logo">
            <span className="logo-dot" />
            ResumeGen
          </span>
          <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
            Built during late nights and poor sleep decisions.
          </p>
        </div>
      </footer>
    </>
  );
}
