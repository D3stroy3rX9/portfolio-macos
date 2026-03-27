import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Widgets.css';

// ── Shared escape hook ─────────────────────────────────────
function useEscapeKey(cb: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') cb(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [cb]);
}

// ── Calendar ──────────────────────────────────────────────
function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function CalendarApp({ onClose }: { onClose: () => void }) {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const days = buildCalendar(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isToday = (d: number | null) =>
    d === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  useEscapeKey(onClose);

  return createPortal(
    <div className="ios-app-overlay" onClick={onClose}>
      <div className="ios-calendar-app" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ios-app-header">
          <button className="ios-app-close" onClick={onClose}>✕</button>
          <span className="ios-app-title">Calendar</span>
          <div style={{ width: 32 }} />
        </div>

        {/* Month nav */}
        <div className="ios-cal-nav">
          <button className="ios-cal-arrow" onClick={prev}>‹</button>
          <span className="ios-cal-month-label">{monthLabel}</span>
          <button className="ios-cal-arrow" onClick={next}>›</button>
        </div>

        {/* Day headers */}
        <div className="ios-cal-grid">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <span key={d} className="ios-cal-day-hdr">{d}</span>
          ))}
          {days.map((day, i) => (
            <span key={i} className={`ios-cal-day ${isToday(day) ? 'ios-today' : ''} ${!day ? 'ios-empty' : ''}`}>
              {day || ''}
            </span>
          ))}
        </div>

        {/* Today callout */}
        <div className="ios-cal-today-row">
          <span className="ios-cal-today-dot" />
          <span className="ios-cal-today-text">
            Today — {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

function CalendarWidget() {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year  = now.getFullYear();
  const today = now.getDate();
  const days  = buildCalendar(year, now.getMonth());

  return (
    <>
      <div className="widget widget-calendar" onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="cal-header">
          <span className="cal-month">{month}</span>
        </div>
        <div className="cal-grid">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <span key={`h-${i}`} className="cal-day-header">{d}</span>
          ))}
          {days.map((day, i) => (
            <span key={`d-${i}`} className={`cal-day ${day === today ? 'today' : ''} ${day === null ? 'empty' : ''}`}>
              {day || ''}
            </span>
          ))}
        </div>
      </div>
      {open && <CalendarApp onClose={() => setOpen(false)} />}
    </>
  );
}

// ── Notes ─────────────────────────────────────────────────
interface Note { id: string; text: string; updatedAt: number; }

const NOTES_KEY = 'portfolio_notes';

const DEFAULT_NOTES: Note[] = [
  { id: '1', text: 'Ship the portfolio 🚀', updatedAt: Date.now() },
  { id: '2', text: 'Review PRs',            updatedAt: Date.now() },
  { id: '3', text: 'Coffee ☕',              updatedAt: Date.now() },
  { id: '4', text: 'DSA practice',          updatedAt: Date.now() },
  { id: '5', text: 'Read: Clean Code',      updatedAt: Date.now() },
];

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) return JSON.parse(raw) as Note[];
  } catch {}
  return DEFAULT_NOTES;
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  const update = (next: Note[]) => { setNotes(next); saveNotes(next); };

  const addNote = () => {
    const n: Note = { id: Date.now().toString(), text: '', updatedAt: Date.now() };
    update([n, ...notes]);
    return n.id;
  };

  const editNote = (id: string, text: string) =>
    update(notes.map(n => n.id === id ? { ...n, text, updatedAt: Date.now() } : n));

  const deleteNote = (id: string) => update(notes.filter(n => n.id !== id));

  return { notes, addNote, editNote, deleteNote };
}

function fmtDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function NotesApp({ onClose, notes, addNote, editNote, deleteNote }: {
  onClose: () => void;
  notes: Note[];
  addNote: () => string;
  editNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  useEscapeKey(() => { if (activeId) setActiveId(null); else onClose(); });

  const handleNew = () => {
    const id = addNote();
    setActiveId(id);
    setTimeout(() => textRef.current?.focus(), 50);
  };

  const activeNote = notes.find(n => n.id === activeId);

  return createPortal(
    <div className="ios-app-overlay" onClick={() => activeId ? setActiveId(null) : onClose()}>
      <div className="ios-notes-app" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ios-notes-header">
          {activeId ? (
            <>
              <button className="ios-notes-back" onClick={() => setActiveId(null)}>‹ Notes</button>
              <button className="ios-app-close" onClick={() => { deleteNote(activeId); setActiveId(null); }}>🗑️</button>
            </>
          ) : (
            <>
              <button className="ios-app-close" onClick={onClose}>✕</button>
              <span className="ios-app-title">Notes</span>
              <button className="ios-notes-add" onClick={handleNew}>✏️</button>
            </>
          )}
        </div>

        {activeNote ? (
          /* Editor */
          <div className="ios-notes-editor">
            <div className="ios-notes-editor-date">{fmtDate(activeNote.updatedAt)}</div>
            <textarea
              ref={textRef}
              className="ios-notes-textarea"
              value={activeNote.text}
              onChange={e => editNote(activeNote.id, e.target.value)}
              placeholder="Start typing…"
              autoFocus
            />
          </div>
        ) : (
          /* List */
          <div className="ios-notes-list">
            {notes.length === 0 && (
              <div className="ios-notes-empty">No notes yet. Tap ✏️ to add one.</div>
            )}
            {notes.map(n => (
              <div key={n.id} className="ios-notes-row" onClick={() => setActiveId(n.id)}>
                <div className="ios-notes-row-main">
                  <span className="ios-notes-row-title">{n.text.split('\n')[0] || 'New Note'}</span>
                  <span className="ios-notes-row-date">{fmtDate(n.updatedAt)}</span>
                </div>
                <span className="ios-notes-row-preview">
                  {n.text.split('\n').slice(1).join(' ').slice(0, 40) || 'No additional text'}
                </span>
                <button className="ios-notes-delete" onClick={e => { e.stopPropagation(); deleteNote(n.id); }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Footer count */}
        {!activeId && (
          <div className="ios-notes-footer">{notes.length} note{notes.length !== 1 ? 's' : ''}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

function NotesWidget() {
  const { notes, addNote, editNote, deleteNote } = useNotes();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="widget widget-notes" onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="notes-header">Notes</div>
        <ul className="notes-list">
          {notes.map(n => (
            <li key={n.id} className="notes-item">{n.text.split('\n')[0] || 'New Note'}</li>
          ))}
        </ul>
      </div>
      {open && (
        <NotesApp
          onClose={() => setOpen(false)}
          notes={notes}
          addNote={addNote}
          editNote={editNote}
          deleteNote={deleteNote}
        />
      )}
    </>
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
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function wmoInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡️' };
}

const WEATHER_CONFIG = { city: 'Bengaluru', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' };

interface WeatherData {
  temp: number; code: number; max: number; min: number;
  feelsLike: number; wind: number; humidity: number;
  hourly: { time: string; temp: number; code: number }[];
  daily: { day: string; code: number; max: number; min: number; rain: number }[];
}

function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError]     = useState(false);

  useEffect(() => {
    const { lat, lon, timezone } = WEATHER_CONFIG;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature` +
      `&hourly=temperature_2m,weathercode` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max` +
      `&timezone=${encodeURIComponent(timezone)}&forecast_days=7`
    )
      .then(r => r.json())
      .then(d => {
        const nowStr = d.current.time as string;
        const nowIdx = (d.hourly.time as string[]).findIndex(t => t >= nowStr);
        const start  = nowIdx >= 0 ? nowIdx : 0;
        const hourly = (d.hourly.time as string[]).slice(start, start + 24).map((t, i) => {
          const hour = new Date(t).getHours();
          const label = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
          return { time: i === 0 ? 'Now' : label, temp: Math.round(d.hourly.temperature_2m[start + i]), code: d.hourly.weathercode[start + i] };
        });
        const daily = (d.daily.time as string[]).map((t, i) => ({
          day:  i === 0 ? 'Today' : DAY_NAMES[new Date(t).getDay()],
          code: d.daily.weathercode[i],
          max:  Math.round(d.daily.temperature_2m_max[i]),
          min:  Math.round(d.daily.temperature_2m_min[i]),
          rain: d.daily.precipitation_probability_max[i] ?? 0,
        }));
        setWeather({
          temp:      Math.round(d.current.temperature_2m),
          code:      d.current.weathercode,
          max:       Math.round(d.daily.temperature_2m_max[0]),
          min:       Math.round(d.daily.temperature_2m_min[0]),
          feelsLike: Math.round(d.current.apparent_temperature),
          wind:      Math.round(d.current.windspeed_10m),
          humidity:  d.current.relativehumidity_2m,
          hourly,
          daily,
        });
      })
      .catch(() => setError(true));
  }, []);

  return { weather, error };
}

function WeatherApp({ weather, onClose }: { weather: WeatherData; onClose: () => void }) {
  const info = wmoInfo(weather.code);
  useEscapeKey(onClose);

  return createPortal(
    <div className="ios-app-overlay" onClick={onClose}>
      <div className="ios-weather-app" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="ios-app-close ios-weather-close" onClick={onClose}>✕</button>

        {/* Hero */}
        <div className="ios-weather-hero">
          <div className="ios-weather-city">{WEATHER_CONFIG.city}</div>
          <div className="ios-weather-temp-big">{weather.temp}°</div>
          <div className="ios-weather-desc">{info.label}</div>
          <div className="ios-weather-hl">H:{weather.max}°  L:{weather.min}°</div>
        </div>

        {/* Hourly strip */}
        <div className="ios-weather-card">
          <div className="ios-section-label">HOURLY FORECAST</div>
          <div className="ios-hourly-scroll">
            {weather.hourly.map((h, i) => (
              <div key={i} className="ios-hour-col">
                <div className="ios-hour-time">{h.time}</div>
                <div className="ios-hour-emoji">{wmoInfo(h.code).emoji}</div>
                <div className="ios-hour-temp">{h.temp}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day */}
        <div className="ios-weather-card">
          <div className="ios-section-label">7-DAY FORECAST</div>
          {weather.daily.map((d, i) => (
            <div key={i} className="ios-daily-row">
              <span className="ios-daily-day">{d.day}</span>
              <span className="ios-daily-emoji">{wmoInfo(d.code).emoji}</span>
              {d.rain > 0 && <span className="ios-daily-rain">💧{d.rain}%</span>}
              <div className="ios-daily-bar-wrap">
                <span className="ios-daily-min">{d.min}°</span>
                <div className="ios-daily-bar">
                  <div className="ios-daily-bar-fill" style={{ left: `${((d.min - weather.min) / (weather.max - weather.min)) * 100}%`, right: `${100 - ((d.max - weather.min) / (weather.max - weather.min)) * 100}%` }} />
                </div>
                <span className="ios-daily-max">{d.max}°</span>
              </div>
            </div>
          ))}
        </div>

        {/* Details grid */}
        <div className="ios-weather-details">
          <div className="ios-detail-card">
            <div className="ios-detail-label">💨 WIND</div>
            <div className="ios-detail-value">{weather.wind}</div>
            <div className="ios-detail-unit">km/h</div>
          </div>
          <div className="ios-detail-card">
            <div className="ios-detail-label">💧 HUMIDITY</div>
            <div className="ios-detail-value">{weather.humidity}</div>
            <div className="ios-detail-unit">%</div>
          </div>
          <div className="ios-detail-card">
            <div className="ios-detail-label">🌡️ FEELS LIKE</div>
            <div className="ios-detail-value">{weather.feelsLike}°</div>
            <div className="ios-detail-unit">celsius</div>
          </div>
          <div className="ios-detail-card">
            <div className="ios-detail-label">📅 TODAY</div>
            <div className="ios-detail-value">H:{weather.max}°</div>
            <div className="ios-detail-unit">L:{weather.min}°</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function WeatherWidget() {
  const { weather, error } = useWeather();
  const [open, setOpen]    = useState(false);
  const info = weather ? wmoInfo(weather.code) : null;

  return (
    <>
      <div className="widget widget-weather" onClick={() => weather && setOpen(true)} style={{ cursor: weather ? 'pointer' : 'default' }}>
        {error   && <div className="weather-loading">Unable to load weather</div>}
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
              {weather.hourly.slice(0, 6).map((h, i) => (
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
      {open && weather && <WeatherApp weather={weather} onClose={() => setOpen(false)} />}
    </>
  );
}

// ── Photo Carousel ────────────────────────────────────────
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
      <img key={idx} src={PHOTOS[idx]} className="lightbox-img" alt="photo" onClick={e => e.stopPropagation()} />
      {PHOTOS.length > 1 && <div className="lightbox-counter">{idx + 1} / {PHOTOS.length}</div>}
    </div>,
    document.body
  );
}

function PhotoCarousel() {
  const [idx, setIdx]   = useState(0);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (PHOTOS.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % PHOTOS.length), 4000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => { startTimer(); return stopTimer; }, [startTimer, stopTimer]);
  useEffect(() => { if (open) stopTimer(); else startTimer(); }, [open, startTimer, stopTimer]);

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
        <img key={idx} src={PHOTOS[idx]} className="photos-img" alt="photo" onClick={() => setOpen(true)} />
        {PHOTOS.length > 1 && (
          <div className="photos-dots">
            {PHOTOS.map((_, i) => (
              <button key={i} className={`photos-dot ${i === idx ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setIdx(i); }} />
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
      <div className="widgets-row">
        <CalendarWidget />
        <NotesWidget />
      </div>
      <WeatherWidget />
      <PhotoCarousel />
    </div>
  );
}
