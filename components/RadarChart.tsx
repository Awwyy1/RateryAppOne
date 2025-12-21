
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

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: metrics.map(m => m.label.toUpperCase()),
        datasets: [
          {
            label: 'SUBJECT_DNA',
            data: metrics.map(m => m.value),
            backgroundColor: 'rgba(0, 240, 255, 0.15)',
            borderColor: '#00f0ff',
            borderWidth: 2,
            pointBackgroundColor: '#00f0ff',
            pointBorderColor: '#050505',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'BASELINE',
            data: metrics.map(m => m.benchmark),
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
              color: 'rgba(255,255,255,0.4)',
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
            borderWidth: 1
          }
        }
      }
    };

    chartInstance.current = new ChartJS(ctx, config);

    return () => chartInstance.current?.destroy();
  }, [metrics]);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative p-4">
      <canvas ref={chartRef} />
    </div>
  );
};

export default RadarChart;
