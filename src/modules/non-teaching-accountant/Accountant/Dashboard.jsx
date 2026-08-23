import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";
import KpiCard from "./KpiCard";
import Widget from "./Widget";
import SimplePagination from "./SimplePagination";
import ChartCard, { palette } from "./ChartCard";
import MiniCalendar from "./MiniCalendar";
import { getAccountStats, monthlySeries } from "./accountsData";
import { nonTeachingRows } from "./salaryData";
import { notices, upcomingEvents } from "./directoryData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const PAGE_SIZE = 5;

const quickActions = [
  { icon: "bi bi-person-workspace", label: "Add Staff", to: "/non-teaching-accountant/admission/non-teaching" },
  { icon: "bi bi-cash-coin", label: "Pay Salary", to: "/non-teaching-accountant/accounts/staff/non-teaching" },
  { icon: "bi bi-receipt", label: "Add Expense", to: "/non-teaching-accountant/accounts/expenses" },
  { icon: "bi bi-megaphone", label: "Create Notice", to: "/non-teaching-accountant/notices" },
  { icon: "bi bi-file-earmark-bar-graph", label: "Generate Report", to: "/non-teaching-accountant/accounts/reports" },
  { icon: "bi bi-calendar2-check", label: "Mark Attendance", to: "/non-teaching-accountant/attendance" },
];

export default function Dashboard() {
  const stats = getAccountStats();
  const [page, setPage] = useState(1);

  const totalStaff = nonTeachingRows.length;

  const sortedStaff = useMemo(() => [...nonTeachingRows].sort((a, b) => a.name.localeCompare(b.name)), []);
  const totalPages = Math.ceil(sortedStaff.length / PAGE_SIZE);
  const pageRows = sortedStaff.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Non-Teaching Accountant" subtitle="Amit Group of Schools — welcome back, Non-Teaching Accountant" />

      {/* Top row — statistics cards */}
      <div className="kpi-grid">
        <KpiCard icon="bi bi-person-workspace" label="Total Non-Teaching Staff" value={totalStaff} trend="Same" trendDirection="up" color="#ba7517" bg="var(--amber-light)" />
        <KpiCard icon="bi bi-cash-coin" label="Salary Paid" value={inr(stats.salaryPaid)} trend="6.4%" trendDirection="up" color="#3b6d11" bg="var(--green-light)" />
        <KpiCard icon="bi bi-wallet2" label="Pending Salary" value={inr(stats.pendingSalary)} trend="2.3%" trendDirection="down" color="#a32d2d" bg="var(--red-light)" />
        <KpiCard icon="bi bi-receipt" label="Total Expenses" value={inr(stats.totalExpenses)} trend="This month" trendDirection="up" color="#4d0011" bg="var(--purple-light)" />
      </div>

      {/* Quick actions */}
      <div className="quick-actions-grid">
        {quickActions.map((a) => (
          <Link key={a.label} to={a.to} className="quick-action-btn">
            <i className={a.icon}></i>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Salary + expenses charts */}
      <div className="dash-grid-main-side">
        <ChartCard
          title="Non-Teaching Salary Trend"
          subtitle="Non-teaching staff salary paid per month"
          type="line"
          data={monthlySeries}
          dataKeys={[{ key: "salary", label: "Salary Paid", color: palette.amber }]}
        />
        <ChartCard
          title="Non-Teaching Expenses"
          subtitle="Salary + operating expenses per month"
          type="bar"
          data={monthlySeries}
          dataKeys={[{ key: "expenses", label: "Expenses", color: palette.purple }]}
        />
      </div>

      {/* Staff table + calendar — one line */}
      <div className="dash-grid-main-side dash-bottom-row">
        <div className="table-wrap dash-staff-table">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th><th>Designation</th><th>Area / Department</th><th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => (
                <tr key={s.key}>
                  <td>{s.name}</td>
                  <td>{s.designation}</td>
                  <td>{s.meta}</td>
                  <td>{inr(s.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <SimplePagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>

        <div className="dash-side-stack">
          <MiniCalendar />
        </div>
      </div>

      {/* Upcoming events + recent notices — one line */}
      <div className="dash-grid-2">
        <Widget
          icon="bi bi-calendar-event-fill"
          title="Upcoming Events"
          items={upcomingEvents}
          renderItem={(e) => (
            <>
              <div className="w-title">{e.title}</div>
              <div className="w-date">{e.date}</div>
            </>
          )}
        />
        <Widget
          icon="bi bi-megaphone-fill"
          title="Recent Notices"
          items={notices}
          renderItem={(n) => (
            <>
              <div>
                <div className="w-title">{n.title}</div>
                <div className="w-sub">{n.audience}</div>
              </div>
              <div className="w-date">{n.date}</div>
            </>
          )}
        />
      </div>

      {/* School information — final full-width section */}
      <div className="widget-card school-info-full-width" style={{ marginBottom: 0 }}>
        <h4><i className="bi bi-bank"></i>Amit Group of Schools</h4>
        <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
          Non-teaching staff admissions, salary payments and expenses are managed from this
          dashboard. Use the sidebar to navigate to Admission and Accounts.
        </p>
      </div>
    </div>
  );
}
