import { useState } from 'react';
import './Apps.css';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="app-contact">
      <div className="contact-header">
        <div className="contact-compose-bar">
          <span className="compose-label">New Message</span>
        </div>
      </div>

      <div className="contact-form-area">
        <div className="mail-field">
          <label>To:</label>
          <span className="mail-recipient">
            <span className="recipient-chip">Amrit Sinha &lt;amrit.01sinha@gmail.com&gt;</span>
          </span>
        </div>
        <div className="mail-field">
          <label>Subject:</label>
          <input type="text" placeholder="Let's work together!" className="mail-input" />
        </div>

        <form onSubmit={handleSubmit} className="mail-body">
          <textarea
            className="mail-textarea"
            placeholder="Hi Amrit,&#10;&#10;I came across your portfolio and would love to connect about..."
            rows={10}
          />

          <div className="mail-footer">
            <button type="submit" className="send-btn" disabled={sent}>
              {sent ? '✓ Sent!' : '⌘ Send'}
            </button>
          </div>
        </form>
      </div>

      <div className="contact-links">
        <a href="mailto:amrit.01sinha@gmail.com" className="contact-link-card">
          <span className="contact-link-icon">📧</span>
          <div>
            <strong>Email</strong>
            <span>amrit.01sinha@gmail.com</span>
          </div>
        </a>
        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="contact-link-card">
          <span className="contact-link-icon">💼</span>
          <div>
            <strong>LinkedIn</strong>
            <span>linkedin.com/in/yourprofile</span>
          </div>
        </a>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link-card">
          <span className="contact-link-icon">🐙</span>
          <div>
            <strong>GitHub</strong>
            <span>github.com/yourusername</span>
          </div>
        </a>
      </div>
    </div>
  );
}
