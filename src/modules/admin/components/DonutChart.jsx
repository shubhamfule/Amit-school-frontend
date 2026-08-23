import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Doughnut chart, styled to match BarChart/LineChart for finance breakdowns
// (e.g. salary by role, expense share).
export default function DonutChart({ labels, data, colors, valuePrefix = '₹', valueFormatter }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const fmt = valueFormatter || ((v) => `${valuePrefix}${Number(v).toLocaleString('en-IN')}`);

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#ffffff', hoverOffset: 4 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { display: true, position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, font: { size: 11.5 }, color: '#5e5a72', usePointStyle: true, pointStyle: 'rectRounded', padding: 14 } },
          tooltip: {
            backgroundColor: '#1a1235', padding: 10, cornerRadius: 8,
            titleFont: { size: 12 }, bodyFont: { size: 12 },
            callbacks: { label: (ctx) => ` ${ctx.label}: ${fmt(ctx.raw)}` },
          },
        },
      },
    });
    return () => chartRef.current && chartRef.current.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors;
    chart.update();
  }, [labels, data, colors]);

  return <canvas ref={canvasRef}></canvas>;
}
