import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Multi-line / area chart, styled to match BarChart so finance trend
// charts feel native to the rest of the dashboard.
export default function LineChart({
  labels, datasets, valuePrefix = '₹', valueSuffix = 'L',
  showLegend = false, valueFormatter,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const fmt = valueFormatter || ((v) => `${valuePrefix}${Number(v).toFixed(1)}${valueSuffix}`);

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: showLegend, position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, font: { size: 11.5 }, color: '#5e5a72', usePointStyle: true, pointStyle: 'circle' } },
          tooltip: {
            backgroundColor: '#1a1235', padding: 10, cornerRadius: 8,
            titleFont: { size: 12 }, bodyFont: { size: 12 },
            callbacks: { label: (ctx) => ` ${ctx.dataset.label ? ctx.dataset.label + ': ' : ''}${fmt(ctx.raw)}` },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9a96aa', maxRotation: 0 }, border: { display: false } },
          y: { grid: { color: 'rgba(77,0,17,0.07)' }, ticks: { font: { size: 11 }, color: '#9a96aa', callback: (v) => fmt(v) }, border: { display: false }, beginAtZero: true },
        },
      },
    });
    return () => chartRef.current && chartRef.current.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data.labels = labels;
    chart.data.datasets.forEach((ds, i) => { if (datasets[i]) ds.data = datasets[i].data; });
    chart.update();
  }, [labels, datasets]);

  return <canvas ref={canvasRef}></canvas>;
}
