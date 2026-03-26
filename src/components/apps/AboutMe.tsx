import { experience } from '../../data/projects';
import './Apps.css';

export default function AboutMe() {
  return (
    <div className="app-about">
      <div className="about-hero">
        <div className="about-avatar">AS</div>
        <div className="about-intro">
          <h1>Amrit Sinha</h1>
          <p className="about-tagline">SAP Hybris Backend Developer &amp; AI Tools Enthusiast</p>
          <div className="about-badges">
            <span className="badge">Java</span>
            <span className="badge">Spring Boot</span>
            <span className="badge">SAP Commerce</span>
            <span className="badge">Microservices</span>
            <span className="badge">MCP Protocol</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>~/about</h2>
        <p>
          Backend developer with deep expertise in SAP Hybris/Commerce Cloud and enterprise Java ecosystems.
          I build scalable microservices, design CI/CD pipelines, and lately — I've been exploring how the
          Model Context Protocol (MCP) can bridge AI tools with developer workflows.
        </p>
        <p>
          This portfolio itself is a testament to that: a macOS desktop simulator with a built-in terminal
          that connects to a real MCP CI/CD server. Feel free to explore, open windows, and try the terminal.
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
        <h2>~/what-im-building</h2>
        <div className="building-grid">
          <div className="building-card">
            <span className="building-icon">🔧</span>
            <div>
              <strong>MCP CI/CD Server</strong>
              <p>AI-callable tools for GitHub Actions &amp; Jenkins pipelines</p>
            </div>
          </div>
          <div className="building-card">
            <span className="building-icon">🖥️</span>
            <div>
              <strong>This Portfolio</strong>
              <p>macOS desktop simulator with live CI/CD integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
