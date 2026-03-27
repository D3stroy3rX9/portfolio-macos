import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Apps.css';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const formRef   = useRef<HTMLFormElement>(null);
  const [subject, setSubject] = useState('');
  const [status, setStatus]   = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus('sent');
      formRef.current.reset();
      setSubject('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const sendLabel = () => {
    if (status === 'sending') return '⏳ Sending…';
    if (status === 'sent')    return '✓ Sent!';
    if (status === 'error')   return '✗ Failed — try again';
    return '⌘ Send';
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

        <form ref={formRef} onSubmit={handleSubmit} className="mail-form">
          <div className="mail-field">
            <label>Name:</label>
            <input
              type="text"
              name="from_name"
              placeholder="Your name"
              className="mail-input"
              required
            />
          </div>

          <div className="mail-field">
            <label>From:</label>
            <input
              type="email"
              name="from_email"
              placeholder="your@email.com"
              className="mail-input"
              required
            />
          </div>

          <div className="mail-field">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Let's work together!"
              className="mail-input"
              required
            />
          </div>

          <div className="mail-body">
            <textarea
              name="message"
              className="mail-textarea"
              placeholder={"Hi Amrit,\n\nI came across your portfolio and would love to connect about..."}
              rows={8}
              required
            />
          </div>

          <div className="mail-footer">
            <button
              type="submit"
              className={`send-btn ${status}`}
              disabled={status === 'sending' || status === 'sent'}
            >
              {sendLabel()}
            </button>
            {status === 'error' && (
              <span className="send-error">Something went wrong. Check EmailJS config.</span>
            )}
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
        <a href="tel:+917999334291" className="contact-link-card">
          <span className="contact-link-icon">📱</span>
          <div>
            <strong>Phone</strong>
            <span>+91 7999 334 291</span>
          </div>
        </a>
        <a href="https://linkedin.com/in/amrit001" target="_blank" rel="noopener noreferrer" className="contact-link-card">
          <span className="contact-link-icon">💼</span>
          <div>
            <strong>LinkedIn</strong>
            <span>linkedin.com/in/amrit001</span>
          </div>
        </a>
        <a href="https://github.com/D3stroy3rX9" target="_blank" rel="noopener noreferrer" className="contact-link-card">
          <span className="contact-link-icon">🐙</span>
          <div>
            <strong>GitHub</strong>
            <span>github.com/D3stroy3rX9</span>
          </div>
        </a>
        <a href="https://medium.com/@amrit.01sinha" target="_blank" rel="noopener noreferrer" className="contact-link-card">
          <span className="contact-link-icon">✍️</span>
          <div>
            <strong>Medium</strong>
            <span>medium.com/@amrit.01sinha</span>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/amrit001/overlay/1767043411130/single-media-viewer/?profileId=ACoAAChvP5UBbRZnydgP0TCh-QNBxPlKdoRUvmU" target="_blank" rel="noopener noreferrer" className="contact-link-card">
          <span className="contact-link-icon">📄</span>
          <div>
            <strong>Resume</strong>
            <span>View on LinkedIn</span>
          </div>
        </a>
      </div>
    </div>
  );
}
