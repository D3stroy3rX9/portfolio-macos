import { experience } from '../../data/projects';
import './Apps.css';

export default function AboutMe() {
  return (
    <div className="app-about">
      <div className="about-hero">
        <div className="about-avatar">AS</div>
        <div className="about-intro">
          <h1>Amrit</h1>
          <p className="about-tagline">SAP Hybris Backend Developer &amp; AI Tools Enthusiast</p>
          <div className="about-badges">
            <span className="badge">Java</span>
            <span className="badge">Spring Boot</span>
            <span className="badge">SAP Commerce</span>
            <span className="badge">REST APIs</span>
            <span className="badge">gRPC</span>
            <span className="badge">FastAPI</span>
            <span className="badge">Microservices</span>
            <span className="badge">CCv2</span>
            <span className="badge">Docker</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>~/about</h2>
        <p>
          Backend Engineer with 4 years in SAP Commerce Cloud, delivering scalable B2B/B2C solutions.
          Expert in CCv2 migrations, Spartacus storefronts, and Java/Spring microservices — with proven
          success in feature development, technical design, and defect triage.
        </p>
        <p>
          Award-winning developer combining deep commerce platform expertise with AI-assisted development.
          Currently driving project-wide AI adoption at Deloitte — building guardrails and rulesets for
          LLM models to standardise code generation and issue resolution.
        </p>
      </div>

      <div className="about-section">
        <h2>~/experience</h2>
        {experience.map((exp, i) => (
          <div key={i} className="experience-card">
            <div className="exp-header">
              <span className="exp-role">{exp.role}</span>
              <span className="exp-period">{exp.period}</span>
            </div>
            <span className="exp-company">{exp.company}</span>
            <ul className="exp-highlights">
              {exp.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="about-section">
        <h2>~/certifications &amp; awards</h2>
        <div className="building-grid">
          <div className="building-card">
            <span className="building-icon">🏆</span>
            <div>
              <strong>SAP Certified Developer</strong>
              <p>SAP Commerce Cloud — C4H34-2411 &amp; Google AI Prompting Essentials</p>
            </div>
          </div>
          <div className="building-card">
            <span className="building-icon">⭐</span>
            <div>
              <strong>Deloitte Awards</strong>
              <p>Debutant Rockstar (2023) · 2× Applause · 3× Spot · Commerce Day Booth Winner (2024)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>~/education</h2>
        <div className="experience-card">
          <div className="exp-header">
            <span className="exp-role">B.E. Mechanical Engineering</span>
            <span className="exp-period">2017 — 2021</span>
          </div>
          <span className="exp-company">Birla Institute of Technology, Mesra — GPA: 8.91 / 10</span>
        </div>
      </div>
    </div>
  );
}
