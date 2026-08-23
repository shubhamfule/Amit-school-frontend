import React, { useState } from 'react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import MiniCalendar from '../components/MiniCalendar';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastContext';

const PERIOD_DATA = {
  month:   { label: 'This month',   labels: ['Week 1','Week 2','Week 3','Week 4'], total: [2.5,3.0,2.8,3.5], collected: [1.8,2.2,1.9,2.8] },
  quarter: { label: 'This quarter', labels: ['Jul','Aug','Sep'], total: [8.5,9.0,7.5], collected: [6.0,7.2,5.8] },
  year:    { label: 'This year',    labels: ['Q1','Q2','Q3','Q4'], total: [15.5,17.0,15,20.5], collected: [11.2,12.5,10.9,15.7] },
};

// Combined salary data: teaching + non-teaching shown together, like the "Revenue vs expense" reference
const SALARY_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  teacher: { label: 'Teaching staff', data: [8.2, 8.4, 8.3, 8.6, 8.5, 8.8], color: '#4d0011' },
  nonTeaching: { label: 'Non-teaching staff', data: [3.1, 3.0, 3.2, 3.3, 3.2, 3.4], color: '#2a78d6' },
};

const NOTICES = [
  { title: 'Half-yearly exam schedule released', tag: 'All Classes', date: '2026-07-21' },
  { title: 'PTA meeting on 28th July',            tag: 'Parents',     date: '2026-07-20' },
  { title: 'Annual sports day registrations open', tag: 'All Classes', date: '2026-07-18' },
];

const ACTIVITIES = [
  { num: 8,  color: 'var(--purple)', name: 'Student counselling',        time: '8–10 Jul · 11:00 AM – 12:00 PM' },
  { num: 8,  color: 'var(--pink)',   name: 'Teachers meeting',           time: '8–10 Jul · 4:00 PM – 5:00 PM' },
  { num: 12, color: 'var(--blue)',   name: 'Parent-teacher conference',  time: '12 Jul · 9:00 AM – 1:00 PM' },
  { num: 15, color: 'var(--teal)',   name: 'Annual Sports Day',          time: '15 Jul · 8:00 AM – 4:00 PM' },
  { num: 18, color: 'var(--amber)',  name: 'Science exhibition',         time: '18 Jul · 10:00 AM – 2:00 PM' },
  { num: 22, color: 'var(--green)',  name: 'Cultural fest rehearsal',    time: '22 Jul · 3:00 PM – 6:00 PM' },
  { num: 28, color: 'var(--red)',    name: 'End-of-term exams begin',    time: '28 Jul · All day' },
];

function Donut({ pct, color, lightVar, present, absent }) {
  const circumference = 2 * Math.PI * 32;
  const dash = (pct / 100) * circumference;
  return (
    <div className="d-flex align-center gap-3">
      <div className="donut-ring">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" strokeWidth="9" style={{ stroke: `var(${lightVar})` }} />
          <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="9"
            strokeDasharray={`${dash.toFixed(0)} ${(circumference - dash).toFixed(0)}`} strokeLinecap="round" />
        </svg>
        <div className="donut-pct">{pct}%</div>
      </div>
      <div>
        <div className="mb-2"><div className="att-stat-label">Present</div><div className="att-stat-val">{present}</div></div>
        <div><div className="att-stat-label">Absent</div><div className="att-stat-val" style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{absent}</div></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const showToast = useToast();
  const [students, setStudents] = useState(5252);
  const [eventsCount, setEventsCount] = useState(15);
  const [period, setPeriod] = useState('month');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [salarySort, setSalarySort] = useState('none'); // 'none' | 'asc' | 'desc'
  const [showAllActivities, setShowAllActivities] = useState(false);

  const pd = PERIOD_DATA[period];

  // Build the sorted-together salary view: reorder months by combined (teacher + nonTeaching) total
  function getSortedSalary() {
    const rows = SALARY_DATA.labels.map((label, i) => ({
      label,
      teacher: SALARY_DATA.teacher.data[i],
      nonTeaching: SALARY_DATA.nonTeaching.data[i],
      total: SALARY_DATA.teacher.data[i] + SALARY_DATA.nonTeaching.data[i],
    }));
    if (salarySort === 'asc') rows.sort((a, b) => a.total - b.total);
    if (salarySort === 'desc') rows.sort((a, b) => b.total - a.total);
    return rows;
  }

  const sortedSalary = getSortedSalary();

  function cycleSalarySort() {
    setSalarySort((prev) => {
      const next = prev === 'none' ? 'desc' : prev === 'desc' ? 'asc' : 'none';
      const label = next === 'none' ? 'default (by month)' : next === 'desc' ? 'highest to lowest' : 'lowest to highest';
      showToast(`Sorted salary by ${label}`, 'ti-arrows-sort');
      return next;
    });
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Hi, welcome to Amit School dashboard</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap si-purple"><i className="ti ti-users"></i></div>
          <div>
            <div className="stat-num">{students.toLocaleString()}</div>
            <div className="stat-label">Total students</div>
            <div className="trend trend-up"><i className="ti ti-trending-up" style={{ fontSize: 12 }}></i>+4.2%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-pink"><i className="ti ti-user-check"></i></div>
          <div>
            <div className="stat-num">132</div>
            <div className="stat-label">Total teachers</div>
            <div className="trend trend-up"><i className="ti ti-trending-up" style={{ fontSize: 12 }}></i>+1.5%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue"><i className="ti ti-briefcase"></i></div>
          <div>
            <div className="stat-num">38</div>
            <div className="stat-label">Working staff</div>
            <div className="trend trend-down"><i className="ti ti-trending-down" style={{ fontSize: 12 }}></i>−2.1%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber"><i className="ti ti-calendar-event"></i></div>
          <div>
            <div className="stat-num">{eventsCount}</div>
            <div className="stat-label">Events this month</div>
            <div className="trend trend-up"><i className="ti ti-trending-up" style={{ fontSize: 12 }}></i>+3 new</div>
          </div>
        </div>
      </div>

      <div className="att-grid">
        <div className="att-card">
          <div className="d-flex justify-between align-center mb-3">
            <span className="att-card-title">Student attendance</span>
            <span className="att-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>This month</span>
          </div>
          <Donut pct={91} color="#4d0011" lightVar="--purple-light" present="4,752" absent="437" />
        </div>
        <div className="att-card">
          <div className="d-flex justify-between align-center mb-3">
            <span className="att-card-title">Teacher attendance</span>
            <span className="att-badge" style={{ background: 'var(--pink-light)', color: 'var(--pink)' }}>This month</span>
          </div>
          <Donut pct={97} color="#d4537e" lightVar="--pink-light" present="132" absent="4" />
        </div>
        <div className="att-card">
          <div className="d-flex justify-between align-center mb-3">
            <span className="att-card-title">Staff attendance</span>
            <span className="att-badge" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>This month</span>
          </div>
          <Donut pct={84} color="#2a78d6" lightVar="--blue-light" present="32" absent="6" />
        </div>
      </div>

      <div className="dash-stack">
        {/* Row 1: Fees collection beside Calendar */}
        <div className="dash-row">
          <div className="ec-card fees-card">
            <div className="ec-card-head">
              <h2>Fees collection</h2>
              <div className="d-flex align-center gap-3">
                <div className="d-flex align-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, display: 'inline-block', background: '#f5deb3' }}></span>Total fee
                </div>
                <div className="d-flex align-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, display: 'inline-block', background: '#4d0011' }}></span>Collected
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="chart-period-btn" onClick={() => setPeriodOpen((o) => !o)}>
                    {pd.label} <i className="ti ti-chevron-down" style={{ fontSize: 12 }}></i>
                  </button>
                  {periodOpen && (
                    <div className="notif-dropdown period-dd">
                      {Object.entries(PERIOD_DATA).map(([key, val]) => (
                        <div
                          key={key}
                          className={`dd-item ${period === key ? 'active' : ''}`}
                          onClick={() => { setPeriod(key); setPeriodOpen(false); showToast(`Showing ${val.label.toLowerCase()} data`, 'ti-chart-bar'); }}
                        >
                          {val.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="chart-wrap">
              {/* Line chart, styled like the salary-trend reference: smooth lines, filled area, dashed grid, ₹ axis */}
              <LineChart
                labels={pd.labels}
                valueUnit={100000} /* data is stored in lakhs (e.g. 2.5 => ₹2.5L) */
                datasets={[
                  {
                    label: 'Total fee',
                    data: pd.total,
                    borderColor: '#e0a96d',
                    backgroundColor: 'rgba(224,169,109,0.15)',
                    pointBorderColor: '#e0a96d',
                  },
                  {
                    label: 'Collected fee',
                    data: pd.collected,
                    borderColor: '#4d0011',
                    backgroundColor: 'rgba(77,0,17,0.12)',
                    pointBorderColor: '#4d0011',
                  },
                ]}
              />
            </div>
          </div>

          <div className="ec-card cal-card">
            <div className="ec-card-head">
              <h2>Calendar</h2>
            </div>
            <div className="cal-body">
              <MiniCalendar eventDays={{ [new Date().getFullYear()]: { [new Date().getMonth()]: [9, 11, 15] } }} />
            </div>
          </div>
        </div>

        {/* Row 2: Staff salary graph beside Recent notices */}
        <div className="dash-row">
          <div className="ec-card salary-card">
            <div className="ec-card-head">
              <h2>Staff salary</h2>
              <div className="d-flex align-center gap-3">
                <div className="d-flex align-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, display: 'inline-block', background: SALARY_DATA.teacher.color }}></span>
                  Teaching
                </div>
                <div className="d-flex align-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, display: 'inline-block', background: SALARY_DATA.nonTeaching.color }}></span>
                  Non-teaching
                </div>
                <button className="chart-period-btn" onClick={cycleSalarySort}>
                  <i className="ti ti-arrows-sort" style={{ fontSize: 12 }}></i>
                  {salarySort === 'none' ? 'Sort' : salarySort === 'desc' ? 'Highest first' : 'Lowest first'}
                </button>
              </div>
            </div>
            <div className="chart-wrap">
              {/* Dual-bar chart, styled like the "Revenue vs expense" reference: both series shown together */}
              <BarChart
                labels={sortedSalary.map((r) => r.label)}
                datasets={[
                  {
                    label: SALARY_DATA.teacher.label,
                    data: sortedSalary.map((r) => r.teacher),
                    backgroundColor: SALARY_DATA.teacher.color,
                    borderRadius: 5,
                    borderSkipped: false,
                    barPercentage: 0.55,
                    categoryPercentage: 0.7,
                  },
                  {
                    label: SALARY_DATA.nonTeaching.label,
                    data: sortedSalary.map((r) => r.nonTeaching),
                    backgroundColor: SALARY_DATA.nonTeaching.color,
                    borderRadius: 5,
                    borderSkipped: false,
                    barPercentage: 0.55,
                    categoryPercentage: 0.7,
                  },
                ]}
              />
            </div>
          </div>

          <div className="ec-card">
            <div className="ec-card-head">
              <h2><i className="ti ti-speakerphone" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Recent Notices</h2>
            </div>
            <div className="notice-list">
              {NOTICES.map((n, i) => (
                <div className="notice-item" key={i} onClick={() => showToast('Opening: ' + n.title, 'ti-speakerphone')}>
                  <div>
                    <div className="notice-title">{n.title}</div>
                    <div className="notice-tag">{n.tag}</div>
                  </div>
                  <div className="notice-date">{n.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming activities */}
        <div className="ec-card">
          <div className="ec-card-head">
            <h2>Upcoming Events</h2>
            <button className="see-all-btn" onClick={() => setShowAllActivities(true)}>See all</button>
          </div>
          <div>
            {ACTIVITIES.slice(0, 3).map((a, i) => (
              <div className="act-item" key={i} onClick={() => showToast('Opening: ' + a.name, 'ti-calendar-event')}>
                <div className="act-num" style={{ background: a.color }}>{a.num}</div>
                <div className="flex-grow-1" style={{ flex: 1 }}>
                  <div className="act-name">{a.name}</div>
                  <div className="act-time">{a.time}</div>
                </div>
                <i className="ti ti-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="footer-card">
          <h3><i className="ti ti-building" style={{ color: 'var(--red)' }}></i>Amit Group of Schools</h3>
          <p>Teaching staff admissions, salary payments and expenses are managed from this dashboard. Use the sidebar to navigate to Admission and Accounts.</p>
        </div>
      </div>

      {/* Modals */}
      <Modal open={showAllActivities} onClose={() => setShowAllActivities(false)} title="All Upcoming Activities" icon="ti-calendar-event" size="lg">
        <div style={{ margin: '-20px' }}>
          {ACTIVITIES.map((a, i) => (
            <div className="act-item" key={i} style={i === ACTIVITIES.length - 1 ? { borderBottom: 'none' } : undefined}>
              <div className="act-num" style={{ background: a.color }}>{a.num}</div>
              <div style={{ flex: 1 }}>
                <div className="act-name">{a.name}</div>
                <div className="act-time">{a.time}</div>
              </div>
              <i className="ti ti-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}