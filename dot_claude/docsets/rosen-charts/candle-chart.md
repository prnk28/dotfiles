---
tags:
  - "#frontend-development"
  - "#programming"
  - "#data-visualization"
  - "#react-components"
  - "#financial-charts"
  - "#d3-visualization"
---

## Example

```typescript
import React, { CSSProperties, useState } from "react";
import { scaleBand, scaleLinear } from "d3";

export function CandleChart() {
  // Scales
  const xScale = scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, 100])
    .padding(0.3);

  const yScale = scaleLinear()
    .domain([Math.min(...data.map((d) => d.low)), Math.max(...data.map((d) => d.high))])
    .range([100, 0]);

  return (
    <div className="@container relative">
      <div
        className="relative h-72 w-full"
        style={
          {
            "--marginTop": "10px",
            "--marginRight": "60px",
            "--marginBottom": "56px",
            "--marginLeft": "30px",
          } as CSSProperties
        }
      >
        {/* Right Y-axis */}
        <div
          className="absolute 
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          right-[calc(var(--marginRight)-1rem)]
          overflow-visible
        "
        >
          {yScale
            .ticks(6)
            .map(yScale.tickFormat(8, "d"))
            .map((value, i) => (
              <div
                key={i}
                style={{
                  right: "0%",
                  top: `${yScale(+value)}%`,
                }}
                className="absolute -translate-y-1/2 text-xs tabular-nums text-gray-400 w-full text-right"
              >
                {value}
              </div>
            ))}
        </div>

        {/* Chart Area */}
        <div
          className="absolute inset-0
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            w-[calc(100%-var(--marginLeft)-var(--marginRight))]
            translate-x-[var(--marginLeft)]
            translate-y-[var(--marginTop)]
            overflow-visible
          "
        >
          <svg
            viewBox="0 0 100 100"
            className="overflow-visible w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {yScale
              .ticks(8)
              .map(yScale.tickFormat(8, "d"))
              .map((active, i) => (
                <g
                  transform={`translate(0,${yScale(+active)})`}
                  className="text-gray-300/80 dark:text-gray-800/80"
                  key={i}
                >
                  <line
                    x1={0}
                    x2={100}
                    stroke="currentColor"
                    strokeDasharray="6,5"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            {/* Min to Max Lines (converted to SVG) */}
            {data.map((d, index) => {
              const barAreaWidth = xScale.bandwidth();
              const barX = xScale(d.date)! + barAreaWidth / 2;

              return (
                <line
                  key={`line-${index}`}
                  x1={barX}
                  y1={yScale(d.high)}
                  x2={barX}
                  y2={yScale(d.low)}
                  stroke="currentColor"
                  className="text-zinc-300 dark:text-zinc-700"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* X Axis (Labels) */}
          {data.map((entry, i) => {
            if (i % 10 !== 0) return null;
            const xPosition = xScale(entry.date)! + xScale.bandwidth() / 2;
            // Parse the date string
            const date = new Date(entry.date);
            // Format the date and time
            const timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

            return (
              <div
                key={i}
                className="absolute overflow-visible text-gray-400 pointer-events-none"
                style={{
                  left: `${xPosition}%`,
                  top: "100%",
                  transform: "rotate(45deg) translateX(4px) translateY(8px)",
                }}
              >
                <div className={`absolute text-xs -translate-y-1/2 whitespace-nowrap`}>
                  {dateLabel}
                  <span className="font-semibold"> - {timeLabel}</span>
                </div>
              </div>
            );
          })}

          {/* Open to Close Bars */}
          {data.map((d, index) => {
            const barWidth = xScale.bandwidth();
            const barHeight = Math.abs(yScale(d.open) - yScale(d.close));
            const barX = xScale(d.date)!;
            const barY = yScale(Math.max(d.open, d.close));

            return (
              <div
                key={index}
                style={{
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                  left: `${barX}%`,
                  top: `${barY}%`,
                }}
                className={`absolute bg-gradient-to-b ${d.open < d.close ? "from-emerald-400 to-emerald-500" : "from-red-400 to-red-500"} rounded-xs`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const data = [
  { open: 128.9962, close: 129.745, high: 130.1345, low: 128.6167, date: "2025-02-07T14:30:00" },
  { open: 129.7051, close: 129.8249, high: 130.0047, low: 129.3357, date: "2025-02-07T14:40:00" },
  { open: 129.8349, close: 129.4954, high: 130.1644, low: 129.3257, date: "2025-02-07T14:50:00" },
  { open: 129.1459, close: 128.9862, high: 129.6152, low: 128.7266, date: "2025-02-07T15:00:00" },
  { open: 129.0161, close: 128.5668, high: 129.1559, low: 127.6382, date: "2025-02-07T15:10:00" },
  { open: 128.467, close: 128.9263, high: 129.2258, low: 128.2273, date: "2025-02-07T15:20:00" },
  { open: 128.8863, close: 129.3257, high: 129.5953, low: 128.7366, date: "2025-02-07T15:30:00" },
  { open: 129.3357, close: 129.4155, high: 129.5354, low: 128.9462, date: "2025-02-07T15:40:00" },
  { open: 129.3856, close: 129.1759, high: 129.6851, low: 128.0676, date: "2025-02-07T15:50:00" },
  { open: 129.1859, close: 128.9662, high: 129.1859, low: 128.0376, date: "2025-02-07T16:00:00" },
  { open: 128.9363, close: 129.0261, high: 129.2558, low: 128.3372, date: "2025-02-07T16:10:00" },
  { open: 129.0062, close: 128.4969, high: 129.2757, low: 128.4769, date: "2025-02-07T16:20:00" },
  { open: 128.4969, close: 128.3272, high: 128.8364, low: 128.2273, date: "2025-02-07T16:30:00" },
  { open: 128.3272, close: 127.8878, high: 128.7166, low: 127.808, date: "2025-02-07T16:40:00" },
  { open: 127.8679, close: 128.0276, high: 128.3871, low: 127.4086, date: "2025-02-07T16:50:00" },
  { open: 127.9278, close: 128.2872, high: 128.417, low: 127.4385, date: "2025-02-07T17:00:00" },
  { open: 128.2972, close: 127.8379, high: 128.6267, low: 127.5284, date: "2025-02-07T17:10:00" },
  { open: 127.8379, close: 128.0376, high: 128.1474, low: 127.6382, date: "2025-02-07T17:20:00" },
  { open: 127.9977, close: 128.417, high: 128.417, low: 127.8379, date: "2025-02-07T17:30:00" },
  { open: 128.4071, close: 128.6567, high: 128.7465, low: 128.2173, date: "2025-02-07T17:40:00" },
  { open: 128.6567, close: 128.7166, high: 128.7865, low: 128.3072, date: "2025-02-07T17:50:00" },
  { open: 128.7066, close: 129.3357, high: 129.4455, low: 128.5269, date: "2025-02-07T18:00:00" },
  { open: 129.3057, close: 129.2158, high: 129.3556, low: 128.9662, date: "2025-02-07T18:10:00" },
  { open: 129.2059, close: 129.0561, high: 129.2358, low: 128.9662, date: "2025-02-07T18:20:00" },
  { open: 129.0561, close: 129.0062, high: 129.2258, low: 128.8763, date: "2025-02-07T18:30:00" },
  { open: 129.0062, close: 128.1574, high: 129.0261, low: 128.0975, date: "2025-02-07T18:40:00" },
  { open: 128.1574, close: 128.1974, high: 128.3771, low: 128.1175, date: "2025-02-07T18:50:00" },
  { open: 128.1874, close: 128.1275, high: 128.3471, low: 128.0476, date: "2025-02-07T19:00:00" },
  { open: 128.1375, close: 127.9777, high: 128.1974, low: 127.7081, date: "2025-02-07T19:10:00" },
  { open: 127.9877, close: 127.9677, high: 128.2772, low: 127.8679, date: "2025-02-07T19:20:00" },
  { open: 127.9378, close: 128.3072, high: 128.3372, low: 127.778, date: "2025-02-07T19:30:00" },
  { open: 128.3072, close: 128.4071, high: 128.437, low: 128.1075, date: "2025-02-07T19:40:00" },
  { open: 128.4071, close: 128.447, high: 128.5369, low: 128.3372, date: "2025-02-07T19:50:00" },
  { open: 128.3971, close: 128.2373, high: 128.457, low: 127.9977, date: "2025-02-07T20:00:00" },
  { open: 128.2473, close: 128.5169, high: 128.5568, low: 128.0975, date: "2025-02-07T20:10:00" },
  { open: 128.5169, close: 128.7565, high: 128.8863, low: 128.4769, date: "2025-02-07T20:20:00" },
  { open: 128.7266, close: 128.8863, high: 128.9962, low: 128.6367, date: "2025-02-07T20:30:00" },
  { open: 128.8763, close: 129.1859, high: 129.2957, low: 128.8464, date: "2025-02-07T20:40:00" },
  { open: 129.1859, close: 129.755, high: 129.795, low: 129.1859, date: "2025-02-07T20:50:00" },
  { open: 130.0446, close: 133.6192, high: 133.759, low: 130.0446, date: "2025-02-10T14:30:00" },
  { open: 133.5393, close: 133.799, high: 134.2682, low: 132.5009, date: "2025-02-10T14:40:00" },
  { open: 133.8289, close: 133.6991, high: 134.1584, low: 133.3496, date: "2025-02-10T14:50:00" },
  { open: 133.6092, close: 133.9587, high: 134.0785, low: 133.3097, date: "2025-02-10T15:00:00" },
  { open: 133.9587, close: 134.3381, high: 134.3681, low: 133.7291, date: "2025-02-10T15:10:00" },
  { open: 134.3381, close: 134.1784, high: 134.5678, low: 134.0586, date: "2025-02-10T15:20:00" },
  { open: 134.1984, close: 134.4779, high: 134.5678, low: 134.0486, date: "2025-02-10T15:30:00" },
  { open: 134.438, close: 134.3282, high: 134.6277, low: 133.9387, date: "2025-02-10T15:40:00" },
  { open: 134.3282, close: 133.769, high: 134.3381, low: 133.6292, date: "2025-02-10T15:50:00" },
  { open: 133.759, close: 133.789, high: 133.9887, low: 133.6292, date: "2025-02-10T16:00:00" },
  { open: 133.799, close: 133.6292, high: 134.0186, low: 133.5893, date: "2025-02-10T16:10:00" },
  { open: 133.6492, close: 133.2797, high: 133.7291, low: 133.2498, date: "2025-02-10T16:20:00" },
  { open: 133.2997, close: 133.4794, high: 133.7091, low: 133.2997, date: "2025-02-10T16:30:00" },
  { open: 133.4794, close: 132.9902, high: 133.4894, low: 132.8104, date: "2025-02-10T16:40:00" },
  { open: 132.9802, close: 133.2997, high: 133.3496, low: 132.8005, date: "2025-02-10T16:50:00" },
  { open: 133.2897, close: 133.2997, high: 133.5094, low: 133.1399, date: "2025-02-10T17:00:00" },
  { open: 133.3197, close: 133.3396, high: 133.3996, low: 133.07, date: "2025-02-10T17:10:00" },
  { open: 133.3396, close: 133.8189, high: 133.9887, low: 133.3097, date: "2025-02-10T17:20:00" },
  { open: 133.8289, close: 133.9387, high: 134.0785, low: 133.789, date: "2025-02-10T17:30:00" },
  { open: 133.9387, close: 134.1285, high: 134.1285, low: 133.8988, date: "2025-02-10T17:40:00" },
  { open: 134.1384, close: 134.1085, high: 134.2782, low: 134.0985, date: "2025-02-10T17:50:00" },
  { open: 134.1085, close: 134.0586, high: 134.1784, low: 133.9288, date: "2025-02-10T18:00:00" },
  { open: 134.0486, close: 134.1085, high: 134.2483, low: 133.9387, date: "2025-02-10T18:10:00" },
  { open: 134.0885, close: 134.1285, high: 134.2383, low: 134.0286, date: "2025-02-10T18:20:00" },
  { open: 134.1285, close: 134.1784, high: 134.4779, low: 134.1085, date: "2025-02-10T18:30:00" },
  { open: 134.1784, close: 134.0286, high: 134.2283, low: 133.9787, date: "2025-02-10T18:40:00" },
  { open: 134.0286, close: 134.1484, high: 134.2083, low: 133.9088, date: "2025-02-10T18:50:00" },
  { open: 134.1384, close: 134.0384, high: 134.3082, low: 133.9387, date: "2025-02-10T19:00:00" },
];

```
