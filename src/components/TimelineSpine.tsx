"use client";

export interface TimelineSpineProps {
  years: string[];
  activeIndex: number;
}

export function TimelineSpine({ years, activeIndex }: TimelineSpineProps) {
  return (
    <aside className="timeline-spine" aria-hidden="true">
      <div className="timeline-spine-line">
        <div className="timeline-spine-fill" />
      </div>
      <ol className="timeline-spine-dots">
        {years.map((y, i) => (
          <li
            key={y}
            className={`timeline-dot${i <= activeIndex ? " is-active" : ""}`}
          >
            <span className="timeline-dot-mark" aria-hidden="true" />
            <span className="timeline-dot-label">{y}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
