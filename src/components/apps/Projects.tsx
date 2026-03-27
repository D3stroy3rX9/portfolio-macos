import { useState } from 'react';
import { projects, type Project } from '../../data/projects';
import './Apps.css';

type FilterType = 'all' | 'live' | 'in-progress' | 'archived' | string;

const TAGS = ['Java', 'SAP Commerce', 'Python', 'React', 'Next.js', 'FastAPI'];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView]     = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<FilterType>('all');

  const statusColors: Record<string, string> = {
    'live':        '#28c840',
    'in-progress': '#febc2e',
    'archived':    '#8e8e93',
  };

  const filtered = projects.filter(p => {
    if (filter === 'all')         return true;
    if (filter === 'live')        return p.status === 'live';
    if (filter === 'in-progress') return p.status === 'in-progress';
    if (filter === 'archived')    return p.status === 'archived';
    // tag filter
    return p.tech.some(t => t.toLowerCase().includes(filter.toLowerCase()));
  });

  const handleFilter = (f: FilterType) => {
    setFilter(f);
    setSelectedProject(null);
  };

  const isActive = (f: FilterType) => filter === f;

  return (
    <div className="app-projects">
      {/* Finder-style toolbar */}
      <div className="projects-toolbar">
        <div className="toolbar-nav">
          <button className="toolbar-btn" disabled>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 1L1.5 6L6.5 11"/></svg>
          </button>
          <button className="toolbar-btn" disabled>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.5 1L6.5 6L1.5 11"/></svg>
          </button>
          <span className="toolbar-path">~/projects / {filter === 'all' ? 'all' : filter}</span>
        </div>
        <div className="toolbar-actions">
          <button className={`toolbar-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="8" y="0" width="6" height="6" rx="1"/><rect x="0" y="8" width="6" height="6" rx="1"/><rect x="8" y="8" width="6" height="6" rx="1"/></svg>
          </button>
          <button className={`toolbar-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2.5" rx="1"/><rect x="0" y="5.5" width="14" height="2.5" rx="1"/><rect x="0" y="10" width="14" height="2.5" rx="1"/></svg>
          </button>
        </div>
      </div>

      <div className="projects-layout">
        {/* Sidebar */}
        <div className="projects-sidebar">
          <div className="sidebar-section">
            <span className="sidebar-label">Favorites</span>
            <div className={`sidebar-item ${isActive('all') ? 'active' : ''}`} onClick={() => handleFilter('all')}>📁 All Projects</div>
            <div className={`sidebar-item ${isActive('live') ? 'active' : ''}`} onClick={() => handleFilter('live')}>🟢 Live</div>
            <div className={`sidebar-item ${isActive('in-progress') ? 'active' : ''}`} onClick={() => handleFilter('in-progress')}>🟡 In Progress</div>
            <div className={`sidebar-item ${isActive('archived') ? 'active' : ''}`} onClick={() => handleFilter('archived')}>⚫ Archived</div>
          </div>
          <div className="sidebar-section">
            <span className="sidebar-label">Tags</span>
            {TAGS.map(tag => (
              <div
                key={tag}
                className={`sidebar-item ${isActive(tag) ? 'active' : ''}`}
                onClick={() => handleFilter(tag)}
              >
                🏷️ {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="projects-main">
          {filtered.length === 0 ? (
            <div className="projects-empty">No projects match this filter.</div>
          ) : view === 'grid' ? (
            <div className="projects-grid">
              {filtered.map(p => (
                <div
                  key={p.id}
                  className={`project-card ${selectedProject?.id === p.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="project-icon-large">
                    {p.status === 'live' ? '📦' : p.status === 'in-progress' ? '🔨' : '🗄️'}
                  </div>
                  <span className="project-card-name">{p.name}</span>
                  <span className="project-card-status" style={{ color: statusColors[p.status] }}>
                    ● {p.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="projects-list">
              <div className="list-header">
                <span className="list-col name">Name</span>
                <span className="list-col status">Status</span>
                <span className="list-col tech">Stack</span>
              </div>
              {filtered.map(p => (
                <div
                  key={p.id}
                  className={`list-row ${selectedProject?.id === p.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProject(p)}
                >
                  <span className="list-col name">📄 {p.name}</span>
                  <span className="list-col status" style={{ color: statusColors[p.status] }}>● {p.status}</span>
                  <span className="list-col tech">{p.tech.slice(0, 3).join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Detail panel */}
          {selectedProject && (
            <div className="project-detail">
              <h3>{selectedProject.name}</h3>
              <p>{selectedProject.description}</p>
              <div className="detail-tech">
                {selectedProject.tech.map(t => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
              <div className="detail-links">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="detail-link">
                    GitHub →
                  </a>
                )}
                {selectedProject.link && (
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="detail-link">
                    Live Site →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
