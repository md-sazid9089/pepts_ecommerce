'use client';

import styles from '../Dashboard.module.css';

export default function SalesChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.revenue));
  const width = 100;
  const height = 250;
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  const barWidth = chartWidth / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart}>
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary-light)" />
        </linearGradient>
        <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--primary-dark)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>

      {/* Grid and Axes */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        className={styles.chartAxis}
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        className={styles.chartAxis}
      />

      {/* Bars */}
      {data.map((item, idx) => {
        const barHeight = (item.revenue / maxValue) * chartHeight;
        const x = padding + (idx * barWidth) + (barWidth * 0.1);
        const y = height - padding - barHeight;
        const w = barWidth * 0.8;

        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={w}
              height={barHeight}
              className={styles.chartBar}
              rx="2"
            />
            {idx % 2 === 0 && (
              <text
                x={x + w / 2}
                y={height - padding + 15}
                className={styles.chartLabel}
              >
                {item.date.split(' ')[1]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
