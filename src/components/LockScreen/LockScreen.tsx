import { useState, useEffect } from 'react';
import './LockScreen.css';

const PASSWORD_DOTS = 8;
const DOT_INTERVAL  = 120;  // ms between each dot appearing
const HOLD_AFTER    = 400;  // ms to hold on full password before unlock
const SLIDE_DELAY   = 200;  // ms after unlock before slide starts

export default function LockScreen({ onUnlocked }: { onUnlocked: () => void }) {
  const [dots,      setDots]      = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [sliding,   setSliding]   = useState(false);
  const [gone,      setGone]      = useState(false);

  // Live clock
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-type dots → unlock → slide up
  useEffect(() => {
    let dotCount = 0;

    // Small initial pause before typing starts
    const startDelay = setTimeout(() => {
      const fillInterval = setInterval(() => {
        dotCount++;
        setDots(dotCount);

        if (dotCount >= PASSWORD_DOTS) {
          clearInterval(fillInterval);

          // Hold briefly, then show "Unlocking"
          setTimeout(() => {
            setUnlocking(true);

            // Then slide up
            setTimeout(() => {
              setSliding(true);

              // Remove from DOM after animation
              setTimeout(() => {
                setGone(true);
                onUnlocked();
              }, 700);
            }, SLIDE_DELAY);
          }, HOLD_AFTER);
        }
      }, DOT_INTERVAL);
    }, 800);

    return () => clearTimeout(startDelay);
  }, [onUnlocked]);

  if (gone) return null;

  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const [hourMin, ampm] = timeStr.split(' ');

  return (
    <div className={`lockscreen ${sliding ? 'slide-up' : ''}`}>
      {/* Background blur overlay */}
      <div className="lockscreen-bg" />

      {/* Content */}
      <div className="lockscreen-content">

        {/* Clock */}
        <div className="lock-time">
          <span className="lock-time-hm">{hourMin}</span>
          <span className="lock-time-ampm">{ampm}</span>
        </div>
        <div className="lock-date">{dateStr}</div>

        {/* Avatar + name */}
        <div className="lock-avatar">A</div>
        <div className="lock-name">Amrit</div>

        {/* Password field */}
        <div className={`lock-password-wrap ${unlocking ? 'unlocking' : ''}`}>
          <div className="lock-password-field">
            {Array.from({ length: PASSWORD_DOTS }).map((_, i) => (
              <span
                key={i}
                className={`lock-dot ${i < dots ? 'filled' : ''}`}
              />
            ))}
          </div>
          {unlocking && <div className="lock-unlocking-text">Unlocking…</div>}
        </div>

        {/* Hint */}
        {!unlocking && <div className="lock-hint">Enter Password</div>}
      </div>
    </div>
  );
}
