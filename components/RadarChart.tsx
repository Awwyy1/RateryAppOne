
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
  ChartConfiguration
} from 'chart.js';
import { MetricData } from '../types';
import { useSubscription } from '../contexts/SubscriptionContext';
import { MARKERS_BY_PLAN } from '../constants';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  metrics: MetricData[];
}

const RadarChart: React.FC<Props> = ({ metrics }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const { currentPlan } = useSubscription();
  const { t } = useTranslation();

  // Determine how many markers to show based on plan
  const visibleMarkersCount = MARKERS_BY_PLAN[currentPlan] || 3;

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Always show 16 labels on the radar grid
    // Visible markers get their names, locked markers get "???"
    const labels = metrics.map((m, index) =>
      index < visibleMarkersCount ? t(`metrics.${m.label}`, m.label).toUpperCase() : '???'
    );

    // Data: visible markers get their values, locked markers get 0 (no polygon line to them)
    const visibleData = metrics.map((m, index) =>
      index < visibleMarkersCount ? m.value : 0
    );

    const benchmarkData = metrics.map((m, index) =>
      index < visibleMarkersCount ? m.benchmark : 0
    );

    // Point styling: visible = cyan dots, locked = invisible
    const pointRadius = metrics.map((_, index) =>
      index < visibleMarkersCount ? 4 : 0
    );

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'SUBJECT_DNA',
            data: visibleData,
            backgroundColor: 'rgba(0, 240, 255, 0.15)',
            borderColor: '#00f0ff',
            borderWidth: 2,
            pointBackgroundColor: '#00f0ff',
            pointBorderColor: '#050505',
            pointBorderWidth: 2,
            pointRadius: pointRadius,
            pointHoverRadius: pointRadius.map(r => r > 0 ? 6 : 0),
          },
          {
            label: 'BASELINE',
            data: benchmarkData,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.05)' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            pointLabels: {
              color: (context) => {
                return context.index < visibleMarkersCount
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(255,255,255,0.15)';
              },
              font: { size: 9, family: 'JetBrains Mono', weight: 'bold' },
              padding: 15
            },
            ticks: { display: false },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#050505',
            titleFont: { family: 'JetBrains Mono' },
            bodyFont: { family: 'JetBrains Mono' },
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            filter: (tooltipItem) => tooltipItem.dataIndex < visibleMarkersCount
          }
        }
      }
    };

    chartInstance.current = new ChartJS(ctx, config);

    return () => chartInstance.current?.destroy();
  }, [metrics, visibleMarkersCount, t]);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center relative p-2 md:p-4">
      <canvas ref={chartRef} />
    </div>
  );
};

export default RadarChart;
