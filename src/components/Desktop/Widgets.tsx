import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Widgets.css';

// ── Calendar ──────────────────────────────────────────────
function CalendarWidget() {
  const [now] = useState(new Date());
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = now.getFullYear();
  const today = now.getDate();

  const firstDay = new Date(year, now.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="widget widget-calendar">
      <div className="cal-header">
        <span className="cal-month">{month}</span>
      </div>
      <div className="cal-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={`h-${i}`} className="cal-day-header">{d}</span>
        ))}
        {days.map((day, i) => (
          <span key={`d-${i}`} className={`cal-day ${day === today ? 'today' : ''} ${day === null ? 'empty' : ''}`}>
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Notes ─────────────────────────────────────────────────
const NOTES = [
  'Ship the portfolio 🚀',
  'Review PRs',
  'Coffee ☕',
  'DSA practice',
  'Read: Clean Code',
];

function NotesWidget() {
  return (
    <div className="widget widget-notes">
      <div className="notes-header">Notes</div>
      <ul className="notes-list">
        {NOTES.map((note, i) => (
          <li key={i} className="notes-item">{note}</li>
        ))}
      </ul>
    </div>
  );
}

// ── Weather ───────────────────────────────────────────────
const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0:  { label: 'Clear',          emoji: '☀️'  },
  1:  { label: 'Mainly Clear',   emoji: '🌤️' },
  2:  { label: 'Partly Cloudy',  emoji: '⛅'  },
  3:  { label: 'Overcast',       emoji: '☁️'  },
  45: { label: 'Foggy',          emoji: '🌫️' },
  48: { label: 'Icy Fog',        emoji: '🌫️' },
  51: { label: 'Light Drizzle',  emoji: '🌦️' },
  61: { label: 'Light Rain',     emoji: '🌧️' },
  63: { label: 'Moderate Rain',  emoji: '🌧️' },
  65: { label: 'Heavy Rain',     emoji: '🌧️' },
  80: { label: 'Rain Showers',   emoji: '🌦️' },
  95: { label: 'Thunderstorm',   emoji: '⛈️'  },
};

function wmoInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡️' };
}

const WEATHER_CONFIG = {
  city: 'Bengaluru',
  lat: 12.9716,
  lon: 77.5946,
  timezone: 'Asia/Kolkata',
};

interface WeatherData {
  temp: number; code: number; max: number; min: number;
  hourly: { time: string; temp: number; code: number }[];
}

function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const { lat, lon, timezone } = WEATHER_CONFIG;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weathercode` +
      `&hourly=temperature_2m,weathercode` +
      `&daily=temperature_2m_max,temperature_2m_min` +
      `&timezone=${encodeURIComponent(timezone)}&forecast_days=2`
    )
      .then(r => r.json())
      .then(d => {
        const nowStr = d.current.time as string; // "2025-03-26T06:00"
        const nowIdx = (d.hourly.time as string[]).findIndex(t => t >= nowStr);
        const start = nowIdx >= 0 ? nowIdx : 0;
        const hourly = (d.hourly.time as string[])
          .slice(start, start + 6)
          .map((t: string, i: number) => {
            const hour = new Date(t).getHours();
            const label = hour === 0 ? '12 AM'
              : hour < 12 ? `${hour} AM`
              : hour === 12 ? '12 PM'
              : `${hour - 12} PM`;
            return {
              time: i === 0 ? 'Now' : label,
              temp: Math.round(d.hourly.temperature_2m[start + i]),
              code: d.hourly.weathercode[start + i],
            };
          });
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          code: d.current.weathercode,
          max:  Math.round(d.daily.temperature_2m_max[0]),
          min:  Math.round(d.daily.temperature_2m_min[0]),
          hourly,
        });
      })
      .catch(() => setError(true));
  }, []);

  const info = weather ? wmoInfo(weather.code) : null;

  return (
    <div className="widget widget-weather">
      {error && <div className="weather-loading">Unable to load weather</div>}
      {!weather && !error && <div className="weather-loading">Loading…</div>}
      {weather && info && (
        <>
          <div className="weather-top">
            <div className="weather-left">
              <div className="weather-city">{WEATHER_CONFIG.city} ↑</div>
              <div className="weather-temp">{weather.temp}°</div>
            </div>
            <div className="weather-right">
              <div className="weather-emoji-large">{info.emoji}</div>
              <div className="weather-desc">{info.label}</div>
              <div className="weather-range">H:{weather.max}° L:{weather.min}°</div>
            </div>
          </div>
          <div className="weather-divider" />
          <div className="weather-hourly">
            {weather.hourly.map((h, i) => (
              <div key={i} className="weather-hour">
                <div className="weather-hour-time">{h.time}</div>
                <div className="weather-hour-emoji">{wmoInfo(h.code).emoji}</div>
                <div className="weather-hour-temp">{h.temp}°</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Photo Carousel ────────────────────────────────────────
// Drop images into src/assets/photos/ — they're picked up automatically
const photoModules = import.meta.glob(
  '../../assets/photos/*.{jpg,jpeg,png,gif,webp,svg,JPG,JPEG,PNG,WEBP}',
  { eager: true }
) as Record<string, { default: string }>;

const PHOTOS = Object.values(photoModules).map(m => m.default);

function Lightbox({ idx, onClose, onPrev, onNext }: { idx: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      {PHOTOS.length > 1 && (
        <>
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); onPrev(); }}>‹</button>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); onNext(); }}>›</button>
        </>
      )}
      <img
        key={idx}
        src={PHOTOS[idx]}
        className="lightbox-img"
        alt="photo"
        onClick={e => e.stopPropagation()}
      />
      {PHOTOS.length > 1 && (
        <div className="lightbox-counter">{idx + 1} / {PHOTOS.length}</div>
      )}
    </div>,
    document.body
  );
}

function PhotoCarousel() {
  const [idx, setIdx]       = useState(0);
  const [open, setOpen]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (PHOTOS.length <= 1) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % PHOTOS.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const prev = () => setIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setIdx(i => (i + 1) % PHOTOS.length);

  if (PHOTOS.length === 0) {
    return (
      <div className="widget widget-photos widget-photos-empty">
        <div className="photos-empty-icon">🖼️</div>
        <div className="photos-empty-text">Add photos to<br />src/assets/photos/</div>
      </div>
    );
  }

  return (
    <>
      <div className="widget widget-photos">
        <img
          key={idx}
          src={PHOTOS[idx]}
          className="photos-img"
          alt="photo"
          onClick={() => setOpen(true)}
        />
        {PHOTOS.length > 1 && (
          <div className="photos-dots">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                className={`photos-dot ${i === idx ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
              />
            ))}
          </div>
        )}
      </div>
      {open && <Lightbox idx={idx} onClose={() => setOpen(false)} onPrev={prev} onNext={next} />}
    </>
  );
}

// ── Root ──────────────────────────────────────────────────
export default function Widgets() {
  return (
    <div className="widgets-container">
      {/* Row 1: Calendar + Notes side by side */}
      <div className="widgets-row">
        <CalendarWidget />
        <NotesWidget />
      </div>
      {/* Row 2: Weather — full width */}
      <WeatherWidget />
      {/* Row 3: Photo carousel — full width */}
      <PhotoCarousel />
    </div>
  );
}
