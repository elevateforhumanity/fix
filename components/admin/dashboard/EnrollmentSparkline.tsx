"use client";

import React from "react";
import type { EnrollmentTrendPoint } from "./types";

interface Props {
  data: EnrollmentTrendPoint[];
}

export function EnrollmentSparkline({ data }: Props) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.enrollments), 1);
  const W = 320;
  const H = 80;
  const PAD = { top: 8, right: 8, bottom: 24, left: 28 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + innerH - (d.enrollments / max) * innerH,
    ...d,
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)}` +
    ` L ${pts[0].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

  const total = data.reduce((s, d) => s + d.enrollments, 0);
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const trend = prev && prev.enrollments > 0
    ? Math.round(((last.enrollments - prev.enrollments) / prev.enrollments) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
            Enrollment Trend
          </p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{total.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">enrollments · last 12 months</p>
        </div>
        {trend !== 0 && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              trend > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}% MoM
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines */}
        {[0, 0.5, 1].map((frac) => {
          const y = PAD.top + innerH - frac * innerH;
          return (
            <g key={frac}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + innerW}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 4}
                y={y + 4}
                textAnchor="end"
                fontSize="9"
                fill="#94a3b8"
              >
                {Math.round(frac * max)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#sparkGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots + month labels */}
        {pts.map((p, i) => {
          const showLabel = i === 0 || i === pts.length - 1 || i % 3 === 0;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="#3b82f6" />
              {showLabel && (
                <text
                  x={p.x}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  {p.month}
                </text>
              )}
            </g>
          );
        })}

        {/* Highlight last point */}
        <circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r="4.5"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
