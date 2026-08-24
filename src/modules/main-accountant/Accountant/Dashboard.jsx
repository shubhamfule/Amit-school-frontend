import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";
import KpiCard from "./KpiCard";
import Widget from "./Widget";
import SimplePagination from "./SimplePagination";
import { AdmissionLineChart, FeeBarChart, AttendanceDonutChart, ClassPieChart } from "./DashboardCharts";
import MiniCalendar from "./MiniCalendar";
import { getAccountStats } from "./accountsData";
import {
  students, teachers, classes, notices, upcomingEvents, teachersOnLeave, birthdaysToday, attendanceToday,
} from "./directoryData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const PAGE_SIZE = 5;

const quickActions = [
  { icon: "bi bi-person-plus-fill", label: "Add Student", to: "/main-accountant/admission/students" },
  { icon: "bi bi-person-badge", label: "Add Teacher", to: "/main-accountant/admission/teaching" },
  { icon: "bi bi-cash-coin", label: "Collect Fees", to: "/main-accountant/accounts/student-fee" },
  { icon: "bi bi-calendar2-check", label: "Mark Attendance", to: "/main-accountant/attendance" },
  { icon: "bi bi-megaphone", label: "Create Notice", to: "/main-accountant/notices" },
  { icon: "bi bi-file-earmark-bar-graph", label: "Generate Report", to: "/main-accountant/accounts/reports" },
];

export default function Dashboard() {
  const stats = getAccountStats();
  const [page, setPage] = useState(1);

  const totalStudents = students.length + 640; // seed data represents a sample; totals reflect full roll
  const totalTeachers = teachers.length + 34;
  const attendancePct = Math.round(
    (attendanceToday.present / (attendanceToday.present + attendanceToday.absent + attendanceToday.onLeave)) * 100
  );

  const recentAdmissions = useMemo(
    () => [...students].sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate)),
    []
  );
  const totalPages = Math.ceil(recentAdmissions.length / PAGE_SIZE);
  const pageRows = recentAdmissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader title="School Management System" subtitle="Amit Group of Schools — welcome back, Mr. Sara" />

      {/* Top row — statistics cards */}
      <div className="kpi-grid">
        <KpiCard icon="bi bi-mortarboard-fill" label="Total Students" value={totalStudents} trend="4.2%" trendDirection="up" color="#4d0011" bg="var(--purple-light)" />
        <KpiCard icon="bi bi-person-badge-fill" label="Total Teachers" value={totalTeachers} trend="1.8%" trendDirection="up" color="#2a78d6" bg="var(--blue-light)" />
        <KpiCard icon="bi bi-collection-fill" label="Total Classes" value={classes.length} trend="Same" trendDirection="up" color="#d4537e" bg="var(--pink-light)" />
        <KpiCard icon="bi bi-briefcase-fill" label="Total Staff" value={26} trend="2.1%" trendDirection="up" color="#ba7517" bg="var(--amber-light)" />
        <KpiCard icon="bi bi-cash-stack" label="Total Fee Collection" value={inr(stats.feeCollection)} trend="6.4%" trendDirection="up" color="#3b6d11" bg="var(--green-light)" />
        <KpiCard icon="bi bi-wallet2" label="Pending Fees" value={inr(stats.pendingFees)} trend="2.3%" trendDirection="down" color="#a32d2d" bg="var(--red-light)" />
        <KpiCard icon="bi bi-calendar2-check-fill" label="Today's Attendance" value={`${attendancePct}%`} trend="1.1%" trendDirection="up" color="#0f6e56" bg="var(--teal-light)" />
        <KpiCard icon="bi bi-clipboard2-check-fill" label="Upcoming Exams" value={3} trend="This month" trendDirection="up" color="#4d0011" bg="var(--purple-light)" />
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

      {/* Middle row — Admission line chart + Attendance donut */}
      <div className="dash-grid-main-side">
        <AdmissionLineChart />
        <AttendanceDonutChart />
      </div>

      {/* Fee bar chart + Students by class pie */}
      <div className="dash-grid-2">
        <FeeBarChart />
        <ClassPieChart />
      </div>

      {/* Bottom row — Recent admissions table */}
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Student Name</th><th>Class</th><th>Admission Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.admissionDate}</td>
                <td><span className={`status-badge ${s.status === "Active" ? "active" : "pending"}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <SimplePagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {/* Calendar + recent notices — one line */}
      <div className="dash-grid-2 compact-widgets-row">
        <MiniCalendar />
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
          icon="bi bi-person-dash-fill"
          title="Teacher on Leave"
          items={teachersOnLeave}
          emptyLabel="No teachers on leave today."
          renderItem={(t) => (
            <>
              <div>
                <div className="w-title">{t.name}</div>
                <div className="w-sub">{t.subject}</div>
              </div>
              <div className="w-date">{t.from} → {t.to}</div>
            </>
          )}
        />
      </div>

      <div className="dash-grid-2" style={{ marginBottom: 0 }}>
        <Widget
          icon="bi bi-gift-fill"
          title="Birthdays Today"
          items={birthdaysToday}
          emptyLabel="No birthdays today."
          renderItem={(b) => (
            <>
              <div className="w-title">{b.name}</div>
              <div className="w-sub">{b.role}</div>
            </>
          )}
        />
        <div className="widget-card">
          <h4><i className="bi bi-bank"></i>Amit Group of Schools</h4>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            All admissions, fee collection, salaries and reports are managed from this dashboard.
            Use the sidebar to navigate to Admission, Accounts and Library.
          </p>
        </div>
      </div>
    </div>
  );
}
