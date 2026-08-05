import { useState, useEffect } from 'react';

export default function AnimatedHeading({ text, className = '' }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');

  return (
    <h1
      className={className}
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIdx) => {
        const chars = [...line];
        return (
          <span key={lineIdx} style={{ display: 'block' }}>
            {chars.map((char, charIdx) => {
              const delay =
                lineIdx * chars.length * 30 + charIdx * 30;
              return (
                <span
                  key={charIdx}
                  style={{
                    display: 'inline-block',
                    opacity: started ? 1 : 0,
                    transform: started
                      ? 'translateX(0)'
                      : 'translateX(-18px)',
                    transition: `opacity 500ms ${delay}ms, transform 500ms ${delay}ms`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
