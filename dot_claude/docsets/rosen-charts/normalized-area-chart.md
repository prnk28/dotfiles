---
tags:
  - "#frontend-development"
  - "#data-visualization"
  - "#react-components"
  - "#d3-visualization"
  - "#stacked-area-chart"
  - "#typescript-react"
---
## Example

```typescript
import React, { CSSProperties } from "react";
import * as d3 from "d3";

const dataSet = [
  { date: "2000-01-31", industry: "Wholesale and Retail Trade", unemployed: 0 },
  { date: "2000-01-31", industry: "Manufacturing", unemployed: 734 },
  { date: "2000-01-31", industry: "Leisure and hospitality", unemployed: 782 },
  { date: "2000-01-31", industry: "Business services", unemployed: 655 },
  { date: "2000-01-31", industry: "Construction", unemployed: 745 },
  { date: "2000-02-01", industry: "Wholesale and Retail Trade", unemployed: 0 },
  { date: "2000-02-01", industry: "Manufacturing", unemployed: 694 },
  { date: "2000-02-01", industry: "Leisure and hospitality", unemployed: 779 },
  { date: "2000-02-01", industry: "Business services", unemployed: 587 },
  { date: "2000-02-01", industry: "Construction", unemployed: 812 },
  { date: "2000-02-02", industry: "Wholesale and Retail Trade", unemployed: 723 },
  { date: "2000-02-02", industry: "Manufacturing", unemployed: 594 },
  { date: "2000-02-02", industry: "Leisure and hospitality", unemployed: 679 },
  { date: "2000-02-02", industry: "Business services", unemployed: 787 },
  { date: "2000-02-02", industry: "Construction", unemployed: 712 },
  { date: "2000-02-03", industry: "Wholesale and Retail Trade", unemployed: 923 },
  { date: "2000-02-03", industry: "Manufacturing", unemployed: 694 },
  { date: "2000-02-03", industry: "Leisure and hospitality", unemployed: 579 },
  { date: "2000-02-03", industry: "Business services", unemployed: 487 },
  { date: "2000-02-03", industry: "Construction", unemployed: 712 },
  { date: "2000-02-04", industry: "Wholesale and Retail Trade", unemployed: 923 },
  { date: "2000-02-04", industry: "Manufacturing", unemployed: 694 },
  { date: "2000-02-04", industry: "Leisure and hospitality", unemployed: 579 },
  { date: "2000-02-04", industry: "Business services", unemployed: 1087 },
  { date: "2000-02-04", industry: "Construction", unemployed: 312 },
  { date: "2000-02-05", industry: "Wholesale and Retail Trade", unemployed: 1223 },
  { date: "2000-02-05", industry: "Manufacturing", unemployed: 894 },
  { date: "2000-02-05", industry: "Leisure and hospitality", unemployed: 779 },
  { date: "2000-02-05", industry: "Business services", unemployed: 687 },
  { date: "2000-02-05", industry: "Construction", unemployed: 512 },
  { date: "2000-02-06", industry: "Wholesale and Retail Trade", unemployed: 1123 },
  { date: "2000-02-06", industry: "Manufacturing", unemployed: 994 },
  { date: "2000-02-06", industry: "Leisure and hospitality", unemployed: 979 },
  { date: "2000-02-06", industry: "Business services", unemployed: 387 },
  { date: "2000-02-06", industry: "Construction", unemployed: 202 },
  { date: "2000-02-07", industry: "Wholesale and Retail Trade", unemployed: 1223 },
  { date: "2000-02-07", industry: "Manufacturing", unemployed: 894 },
  { date: "2000-02-07", industry: "Leisure and hospitality", unemployed: 779 },
  { date: "2000-02-07", industry: "Business services", unemployed: 687 },
  { date: "2000-02-07", industry: "Construction", unemployed: 112 },
  { date: "2000-02-08", industry: "Wholesale and Retail Trade", unemployed: 1323 },
  { date: "2000-02-08", industry: "Manufacturing", unemployed: 994 },
  { date: "2000-02-08", industry: "Leisure and hospitality", unemployed: 979 },
  { date: "2000-02-08", industry: "Business services", unemployed: 387 },
  { date: "2000-02-08", industry: "Construction", unemployed: 202 },
];

const colors = [
  {
    colorFrom: "text-fuchsia-200 dark:text-fuchsia-300",
    colorTo: "text-fuchsia-400 dark:text-fuchsia-500",
    bgColor: "bg-fuchsia-400",
  },
  {
    colorFrom: "text-purple-200 dark:text-purple-300",
    colorTo: "text-purple-400 dark:text-purple-500",
    bgColor: "bg-purple-400",
  },
  {
    colorFrom: "text-blue-200 dark:text-blue-400",
    colorTo: "text-blue-500 dark:text-blue-600",
    bgColor: "bg-blue-400",
  },
  {
    colorFrom: "text-sky-100 dark:text-sky-300",
    colorTo: "text-sky-400 dark:text-sky-500",
    bgColor: "bg-sky-400",
  },
  {
    colorFrom: "text-orange-100 dark:text-orange-300",
    colorTo: "text-orange-300 dark:text-orange-500",
    bgColor: "bg-orange-400",
  },
];

interface GroupedDataPoint {
  date: Date;
  [industry: string]: Date | number;
}

export function AreaChartNormalizedStacked() {
  const parseDate = d3.utcParse("%Y-%m-%d");

  const industries = Array.from(new Set(dataSet.map((d) => d.industry)));

  const groupedData = Array.from(
    d3.group(dataSet, (d) => d.date),
    ([date, values]) => {
      const totalUnemployed = d3.sum(values, (d) => d.unemployed);
      const obj: { [key: string]: number } = {};
      values.forEach((val) => {
        obj[val.industry] = (val.unemployed / totalUnemployed) * 100; // Normalize to percentage
      });
      return {
        date: parseDate(date.split("T")[0]),
        ...obj,
      } as GroupedDataPoint;
    }
  );

  const series = d3.stack<GroupedDataPoint>().keys(industries)(groupedData);

  // Scales
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(groupedData, (d) => d.date) as [Date, Date])
    .range([0, 100]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1])) ?? 0])
    .rangeRound([100, 0]);

  // Area generator
  const area = d3
    .area<d3.SeriesPoint<any>>()
    .x((d) => xScale(d.data.date))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  return (
    <>
      <div className="flex text-center gap-4 text-2xs h-fit overflow-x-auto no-scrollbar px-10 mb-8">
        <div className="flex gap-1.5">
          <div className={`w-1 h-full rounded-full ${colors[4].bgColor}`}></div>Construction
        </div>
        <div className="flex gap-1.5">
          <div className={`w-1 h-full rounded-full ${colors[3].bgColor}`}></div>Business
        </div>
        <div className="flex gap-1.5">
          <div className={`w-1 h-full rounded-full ${colors[2].bgColor}`}></div>Leisure
        </div>
        <div className="flex gap-1.5">
          <div className={`w-1 h-full rounded-full ${colors[1].bgColor}`}></div>Manufacturing
        </div>
        <div className="flex gap-1.5">
          <div className={`w-1 h-full rounded-full ${colors[0].bgColor}`}></div>Wholesale
        </div>
      </div>
      <div
        className="relative h-64 w-full"
        style={
          {
            "--marginTop": "0px",
            "--marginRight": "0px",
            "--marginBottom": "0px",
            "--marginLeft": "0px",
          } as CSSProperties
        }
      >
        {/* Chart area */}
        <svg
          className="absolute inset-0
              z-10
              h-[calc(100%-var(--marginTop)-var(--marginBottom))]
              w-[calc(100%-var(--marginLeft)-var(--marginRight))]
              translate-x-[var(--marginLeft)]
              translate-y-[var(--marginTop)]
              overflow-visible
            "
        >
          <svg viewBox="0 0 100 100" className="overflow-visible" preserveAspectRatio="none">
            <defs>
              {series.map((_, i) => (
                <linearGradient
                  id={`full-stacked-area-gradient-${i}`}
                  key={i}
                  x1="0"
                  x2="0.3"
                  y1="0.15"
                  y2="1"
                >
                  <stop offset="0%" stopColor={"currentColor"} className={colors[i].colorFrom} />
                  <stop offset="80%" stopColor={"currentColor"} className={colors[i].colorTo} />
                </linearGradient>
              ))}
            </defs>

            {series.map((layer, i) => (
              <g key={i}>
                {/* Areas */}
                <path
                  fill={`url(#full-stacked-area-gradient-${i})`}
                  stroke={"#ccc"}
                  strokeWidth="0.05"
                  d={area(layer) || ""}
                />

              </g>
            ))}
          </svg>
        </svg>

        {/* X axis */}
        <svg
          className="absolute inset-0
          h-full
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          -translate-y-3
          overflow-visible z-0
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        "
        >
          {series[0].map((day, i) => {
            const date = day.data.date;
            if (i % 2 === 0) return null;
            return (
              <g key={i} className="overflow-visible text-zinc-500">
                <text
                  x={`${xScale(date)}%`}
                  y="100%"
                  textAnchor={i === 0 ? "start" : i === series[0].length - 1 ? "end" : "middle"}
                  fill="currentColor"
                  className="text-xs"
                >
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Y axis */}
        <svg
          className="absolute inset-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          translate-x-[90%] z-20
          overflow-visible
        "
        >
          <g className="">
            {yScale
              .ticks(8)
              .map(yScale.tickFormat(8, "d"))
              .map((value, i) => {
                if (i === 0) return null;
                return (
                  <text
                    key={i}
                    y={`${yScale(+value)}%`}
                    alignmentBaseline="middle"
                    textAnchor="start"
                    className="text-xs text-zinc-600"
                    fill="currentColor"
                  >
                    {value}%
                  </text>
                );
              })}
          </g>
        </svg>
      </div>
    </>
  );
}

```