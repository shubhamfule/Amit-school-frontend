import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

// Same hex values as the CSS custom properties in theme.css — kept in sync so charts
// match the rest of the UI exactly.
export const palette = {
  purple: "#4d0011",
  pink: "#d4537e",
  blue: "#2a78d6",
  amber: "#ba7517",
  green: "#3b6d11",
  teal: "#0f6e56",
};

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function ChartCard({ title, subtitle, type = "line", data, dataKeys, xKey = "month" }) {
  const Chart = type === "bar" ? BarChart : LineChart;

  return (
    <div className="chart-card">
      <h4>{title}</h4>
      {subtitle && <div className="chart-sub">{subtitle}</div>}
      <ResponsiveContainer width="100%" height={230}>
        <Chart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-mid)" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            formatter={(value) => inr(value)}
            contentStyle={{ borderRadius: 10, border: "1px solid var(--border-mid)", fontSize: 12.5 }}
          />
          {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {dataKeys.map((k) =>
            type === "bar" ? (
              <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color} radius={[4, 4, 0, 0]} />
            ) : (
              <Line key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={2.5} dot={{ r: 3 }} />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
