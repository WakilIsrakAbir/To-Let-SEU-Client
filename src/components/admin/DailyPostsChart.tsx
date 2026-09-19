'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { TrendingUp, BarChart3, LineChart, Calendar, Award } from 'lucide-react';

export interface IDailyPostStat {
  date: string;
  count: number;
  label: string;
  weekday: string;
}

interface DailyPostsChartProps {
  data?: IDailyPostStat[];
}

export default function DailyPostsChart({ data = [] }: DailyPostsChartProps) {
  const { currentTheme, isDark } = useTheme();
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = data && data.length > 0 ? data : [];

  const totalCount = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const highestCount = chartData.reduce((max, curr) => Math.max(max, curr.count), 0);
  const maxScale = Math.max(highestCount, 5);
  const dailyAverage = chartData.length > 0 ? (totalCount / chartData.length).toFixed(1) : '0';
  const peakItem = chartData.reduce(
    (peak, curr) => (curr.count > peak.count ? curr : peak),
    chartData[0] || { date: '', count: 0, label: 'N/A', weekday: '' }
  );

  const svgWidth = 640;
  const svgHeight = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;
  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;

  const points = chartData.map((d, index) => {
    const x = padLeft + (index / Math.max(chartData.length - 1, 1)) * usableWidth;
    const y = padTop + usableHeight - (d.count / maxScale) * usableHeight;
    return { x, y, ...d };
  });

  const generateAreaPath = () => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${padTop + usableHeight} Z`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const baseline = padTop + usableHeight;
    path += ` L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
    return path;
  };

  const generateLinePath = () => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const themeHex = currentTheme?.hex || '#10b981';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs transition-colors duration-300 space-y-6">
      {/* Header section with summary pills */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Activity Analytics (Past 14 Days)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily Posts Creation Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daily frequency and volume of bachelor room listings published by Southeast University students
          </p>
        </div>

        {/* View mode toggle & quick metrics */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">14-Day Total:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{totalCount}</span>
            </div>
            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-500 dark:text-slate-400">Peak:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{highestCount}</span>
            </div>
            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Avg/Day:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{dailyAverage}</span>
            </div>
          </div>

          {/* Chart Type Toggle Button */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bar Chart View"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bars</span>
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Area Trend View"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Trend</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-800/80">
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400 font-medium">
            No activity data recorded in this period
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[560px]">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-52 sm:h-56 select-none overflow-visible">
                <defs>
                  <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={themeHex} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={themeHex} stopOpacity="0.0" />
                  </linearGradient>

                  <linearGradient id="chartBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={themeHex} stopOpacity="1" />
                    <stop offset="100%" stopColor={themeHex} stopOpacity="0.75" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines and Y-Axis labels */}
                {[0, 0.5, 1].map((ratio) => {
                  const yVal = padTop + usableHeight - ratio * usableHeight;
                  const labelVal = Math.round(ratio * maxScale);
                  return (
                    <g key={ratio}>
                      <line
                        x1={padLeft}
                        y1={yVal}
                        x2={svgWidth - padRight}
                        y2={yVal}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeDasharray={ratio === 0 ? '0' : '4 4'}
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 8}
                        y={yVal + 3.5}
                        textAnchor="end"
                        className="text-[10px] fill-slate-400 font-mono font-medium"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Area Chart Mode */}
                {chartType === 'area' && (
                  <>
                    <path d={generateAreaPath()} fill="url(#chartAreaGradient)" />
                    <path
                      d={generateLinePath()}
                      fill="none"
                      stroke={themeHex}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, idx) => {
                      const isHovered = hoveredIdx === idx;
                      return (
                        <g key={p.date}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? 6 : 4}
                            fill={isHovered ? '#ffffff' : themeHex}
                            stroke={themeHex}
                            strokeWidth={isHovered ? 3 : 2}
                            className="transition-all duration-150 cursor-pointer"
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                          />
                        </g>
                      );
                    })}
                  </>
                )}

                {/* Bar Chart Mode */}
                {chartType === 'bar' &&
                  chartData.map((d, idx) => {
                    const barCount = chartData.length;
                    const slotWidth = usableWidth / barCount;
                    const barWidth = Math.min(slotWidth * 0.65, 24);
                    const x = padLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
                    const barHeight = Math.max((d.count / maxScale) * usableHeight, d.count > 0 ? 4 : 2);
                    const y = padTop + usableHeight - barHeight;
                    const isHovered = hoveredIdx === idx;
                    const isPeak = d.count > 0 && d.count === highestCount;

                    return (
                      <g
                        key={d.date}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        {/* Invisible full-height hover target */}
                        <rect
                          x={padLeft + idx * slotWidth}
                          y={padTop}
                          width={slotWidth}
                          height={usableHeight}
                          fill="transparent"
                        />

                        {/* Background track bar */}
                        <rect
                          x={x}
                          y={padTop}
                          width={barWidth}
                          height={usableHeight}
                          rx={barWidth / 2}
                          fill={isDark ? '#1e293b' : '#f1f5f9'}
                          opacity={0.4}
                        />

                        {/* Active Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx={Math.min(barWidth / 2, 6)}
                          fill={isPeak ? themeHex : 'url(#chartBarGradient)'}
                          opacity={isHovered ? 1 : 0.85}
                          className="transition-all duration-200"
                          filter={isHovered ? 'url(#glow)' : undefined}
                        />

                        {/* Count label directly on top of bar if count > 0 */}
                        {d.count > 0 && (
                          <text
                            x={x + barWidth / 2}
                            y={y - 5}
                            textAnchor="middle"
                            className="text-[10px] font-black fill-slate-700 dark:fill-slate-200"
                          >
                            {d.count}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {/* X-Axis Dates & Day Labels */}
                {chartData.map((d, idx) => {
                  const slotWidth = usableWidth / chartData.length;
                  const xCenter = padLeft + idx * slotWidth + slotWidth / 2;
                  const isHovered = hoveredIdx === idx;

                  const shouldShow =
                    idx === 0 ||
                    idx === chartData.length - 1 ||
                    idx % 2 === 0 ||
                    isHovered;

                  if (!shouldShow) return null;

                  return (
                    <g key={d.date}>
                      <text
                        x={xCenter}
                        y={svgHeight - 14}
                        textAnchor="middle"
                        className={`text-[9.5px] font-bold transition-colors ${
                          isHovered
                            ? 'fill-emerald-600 dark:fill-emerald-400 font-extrabold'
                            : 'fill-slate-500 dark:fill-slate-400'
                        }`}
                      >
                        {d.label}
                      </text>
                      <text
                        x={xCenter}
                        y={svgHeight - 4}
                        textAnchor="middle"
                        className="text-[8px] fill-slate-400 font-medium"
                      >
                        {d.weekday}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Dynamic Tooltip Float on Hover */}
        {hoveredIdx !== null && chartData[hoveredIdx] && (
          <div className="mt-3 flex items-center justify-between px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg text-xs border border-slate-700 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeHex }} />
              <span className="font-semibold text-slate-300">
                {chartData[hoveredIdx].label} ({chartData[hoveredIdx].weekday})
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-slate-400">New Posts:</span>
              <span className="text-white font-black text-sm">{chartData[hoveredIdx].count}</span>
            </div>
          </div>
        )}
      </div>

      {/* Insight Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            Peak Activity:{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {peakItem.count > 0 ? `${peakItem.label} (${peakItem.count} listings created)` : 'No listings recorded in this window'}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          * Real-time metrics updated live
        </span>
      </div>
    </div>
  );
}
