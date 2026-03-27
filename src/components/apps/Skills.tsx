import { skills } from '../../data/projects';
import './Apps.css';

const categoryMeta: Record<string, { icon: string; label: string; color: string }> = {
  backend:      { icon: '⚡',  label: 'Backend',      color: '#ff6b6b' },
  ecommerce:    { icon: '🛒',  label: 'E-Commerce',   color: '#4ecdc4' },
  devops:       { icon: '🚀',  label: 'DevOps',       color: '#45b7d1' },
  data:         { icon: '🗄️', label: 'Data',          color: '#96ceb4' },
  tools:        { icon: '🔧',  label: 'Tools',        color: '#dda0dd' },
  architecture: { icon: '🏗️', label: 'Architecture', color: '#f7b731' },
};

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="skill-bar-row">
      <span className="skill-bar-name">{name}</span>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

// Generate a "proficiency" level based on skill name — deterministic pseudo-random
function getLevel(skill: string): number {
  const core = ['Java', 'Spring Boot', 'SAP Hybris/Commerce', 'REST APIs', 'Microservices', 'Docker', 'Git', 'PostgreSQL'];
  if (core.includes(skill)) return 85 + (skill.length % 15);
  return 60 + (skill.length * 7) % 30;
}

export default function Skills() {
  return (
    <div className="app-skills">
      <div className="skills-header">
        <h2>System Preferences: Skills</h2>
        <p>Technical proficiency overview — calibrated by years of real-world usage.</p>
      </div>

      <div className="skills-grid">
        {Object.entries(skills).map(([category, items]) => {
          const meta = categoryMeta[category];
          return (
            <div key={category} className="skills-category">
              <div className="category-header" style={{ borderLeftColor: meta.color }}>
                <span className="category-icon">{meta.icon}</span>
                <span className="category-label">{meta.label}</span>
                <span className="category-count">{items.length} skills</span>
              </div>
              <div className="category-skills">
                {items.map(skill => (
                  <SkillBar key={skill} name={skill} level={getLevel(skill)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
