import { memo, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const MetricChart = ({
  title,
  labels,
  values,
  borderColor,
  height = "h-72",
  fillArea = true,
}) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title,
          data: values,
          borderColor,
          backgroundColor: `${borderColor}33`,
          fill: fillArea,
          tension: 0.4,
        },
      ],
    }),
    [labels, values, borderColor, title],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: "#64748b" },
          grid: { color: "#e2e8f0" },
        },
        y: {
          ticks: { color: "#64748b" },
          grid: { color: "#e2e8f0" },
        },
      },
    }),
    [],
  );

  return (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm ${height}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Real-time
        </span>
      </div>
      <div className="mt-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default memo(MetricChart);
