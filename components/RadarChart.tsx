
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

  // Determine how many markers to show based on plan
  const visibleMarkersCount = MARKERS_BY_PLAN[currentPlan] || 3;

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create labels - show "???" for locked markers
    const labels = metrics.map((m, index) =>
      index < visibleMarkersCount ? m.label.toUpperCase() : '???'
    );

    // Create data - show 0 for locked markers (or a small value to show the outline)
    const visibleData = metrics.map((m, index) =>
      index < visibleMarkersCount ? m.value : 50
    );

    const benchmarkData = metrics.map((m, index) =>
      index < visibleMarkersCount ? m.benchmark : 50
    );

    // Point colors - cyan for visible, gray for locked
    const pointColors = metrics.map((_, index) =>
      index < visibleMarkersCount ? '#00f0ff' : 'rgba(255,255,255,0.1)'
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
            pointBackgroundColor: pointColors,
            pointBorderColor: '#050505',
            pointBorderWidth: 2,
            pointRadius: metrics.map((_, index) => index < visibleMarkersCount ? 4 : 2),
            pointHoverRadius: metrics.map((_, index) => index < visibleMarkersCount ? 6 : 2),
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
                const index = context.index;
                return index < visibleMarkersCount ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)';
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
            filter: (tooltipItem) => {
              // Hide tooltip for locked markers
              return tooltipItem.dataIndex < visibleMarkersCount;
            },
            callbacks: {
              label: (context) => {
                if (context.dataIndex >= visibleMarkersCount) {
                  return 'Upgrade to unlock';
                }
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      }
    };

    chartInstance.current = new ChartJS(ctx, config);

    return () => chartInstance.current?.destroy();
  }, [metrics, visibleMarkersCount]);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center relative p-2 md:p-4">
      <canvas ref={chartRef} />
    </div>
  );
};

export default RadarChart;
