import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import MiniCalendar from '../components/MiniCalendar';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const STATS = [
  { icon: 'ti-books', color: 'purple', num: '1,250', label: 'Total books' },
  { icon: 'ti-transfer-in', color: 'blue', num: '85', label: 'Books issued' },
  { icon: 'ti-alert-circle', color: 'red', num: '15', label: 'Overdue books' },
  { icon: 'ti-circle-check', color: 'green', num: '70', label: 'Returned books' },
  { icon: 'ti-plus', color: 'amber', num: '25', label: 'New books added' },
  { icon: 'ti-book-2', color: 'teal', num: '1,165', label: 'Available books' },
  { icon: 'ti-users', color: 'pink', num: '320', label: 'Total students' },
  { icon: 'ti-user-check', color: 'blue', num: '60', label: 'Students issued' },
  { icon: 'ti-user-star', color: 'purple', num: '25', label: 'Teachers issued' },
  { icon: 'ti-report-money', color: 'amber', num: '200', label: 'Total clearance' },
];

const ATTENDANCE = [
  { title: 'Textbooks (NCERT/CBSE)', badgeBg: 'var(--purple-light)', badgeColor: 'var(--purple)', stroke: '#4d0011', ringBg: 'var(--purple-light)', dash: '183 18', pct: '91%', available: '4,752', issued: '437' },
  { title: 'Story & moral books', badgeBg: 'var(--pink-light)', badgeColor: 'var(--pink)', stroke: '#d4537e', ringBg: 'var(--pink-light)', dash: '195 6', pct: '97%', available: '1,320', issued: '40' },
  { title: 'Reference & general knowledge', badgeBg: 'var(--blue-light)', badgeColor: 'var(--blue)', stroke: '#2a78d6', ringBg: 'var(--blue-light)', dash: '169 32', pct: '84%', available: '980', issued: '186' },
];

const EVENTS = [
  { num: 8, color: 'var(--purple)', name: 'New arrivals shelving', time: '8–10 Jul · 11:00 AM – 12:00 PM' },
  { num: 8, color: 'var(--pink)', name: 'Librarian staff meeting', time: '8–10 Jul · 4:00 PM – 5:00 PM' },
  { num: 12, color: 'var(--blue)', name: 'Book fair & author meet', time: '12 Jul · 9:00 AM – 1:00 PM' },
  { num: 15, color: 'var(--teal)', name: 'Annual reading marathon', time: '15 Jul · 8:00 AM – 4:00 PM' },
  { num: 18, color: 'var(--amber)', name: 'Book donation drive', time: '18 Jul · 10:00 AM – 2:00 PM' },
  { num: 22, color: 'var(--green)', name: 'Storytelling session rehearsal', time: '22 Jul · 3:00 PM – 6:00 PM' },
  { num: 28, color: 'var(--red)', name: 'Annual stock-taking begins', time: '28 Jul · All day' },
];

const PERIOD_DATA = {
  month:   { label: 'This month',   labels: ['Week 1','Week 2','Week 3','Week 4'], total: [250,300,280,350], collected: [180,220,190,280] },
  quarter: { label: 'This quarter', labels: ['Jul','Aug','Sep'], total: [850,900,750], collected: [600,720,580] },
  year:    { label: 'This year',    labels: ['Q1','Q2','Q3','Q4','Q1','Q2','Q3','Q4'], total: [450,550,650,1000,750,550,450,800], collected: [320,420,500,830,520,380,320,620] },
};

const PERF_DATA = {
  Mathematics: { pct: 75, att: '95%', grade: 'B+', rating: 'Good', dash: '170 56' },
  Science: { pct: 82, att: '97%', grade: 'A', rating: 'Very Good', dash: '185 41' },
  'English Literature': { pct: 68, att: '91%', grade: 'B', rating: 'Average', dash: '153 73' },
  'Story & Moral Books': { pct: 88, att: '98%', grade: 'A+', rating: 'Excellent', dash: '198 28' },
  'General Knowledge': { pct: 79, att: '93%', grade: 'B+', rating: 'Good', dash: '178 48' },
};

const TIMETABLE = [
  ['Monday', '6A', '7A', '8A', '9A'],
  ['Tuesday', '6B', '7B', '8B', '9B'],
  ['Wednesday', '6A', '7A', '8A', '9A'],
  ['Thursday', '6B', '7B', '8B', '9B'],
  ['Friday', '6A', '7A', '8A', '9A'],
];

export default function Dashboard() {
  const showToast = useToast();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [period, setPeriod] = useState('year');
  const [perf, setPerf] = useState('Mathematics');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [totalBooks, setTotalBooks] = useState(1250);
  const [eventCount, setEventCount] = useState(15);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [issueForm, setIssueForm] = useState({ id: '', name: '', userType: '', bookId: '', bookName: '', issueDate: '', dueDate: '' });

  useEffect(() => {
    const d = PERIOD_DATA[period];
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          { label: 'Books issued', data: d.total, backgroundColor: '#f5deb3', borderRadius: 5, borderSkipped: false, barPercentage: 0.55, categoryPercentage: 0.7 },
          { label: 'Books returned', data: d.collected, backgroundColor: '#4d0011', borderRadius: 5, borderSkipped: false, barPercentage: 0.55, categoryPercentage: 0.7 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1a1235', padding: 10, cornerRadius: 8, callbacks: { label: (ctx) => ' ' + ctx.raw + ' books' } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9a96aa', maxRotation: 0 }, border: { display: false } },
          y: { grid: { color: 'rgba(77,0,17,0.07)' }, ticks: { font: { size: 11 }, color: '#9a96aa' }, border: { display: false }, beginAtZero: true },
        },
      },
    });
    return () => chartRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePeriod = (p) => {
    setPeriod(p);
    const d = PERIOD_DATA[p];
    const chart = chartRef.current;
    chart.data.labels = d.labels;
    chart.data.datasets[0].data = d.total;
    chart.data.datasets[1].data = d.collected;
    chart.update();
    showToast('Showing ' + d.label.toLowerCase() + ' data', 'ti-chart-bar');
  };

  const saveBook = () => {
    setShowAddBook(false);
    setTotalBooks((n) => n + 1);
    showToast('New book added to catalog successfully!', 'ti-circle-check');
  };

  const saveIssue = () => {
    if (!issueForm.name || !issueForm.userType || !issueForm.bookName) {
      showToast('Please fill in required fields', 'ti-alert-circle');
      return;
    }
    setShowIssue(false);
    setIssueForm({ id: '', name: '', userType: '', bookId: '', bookName: '', issueDate: '', dueDate: '' });
    showToast('Book issued successfully!', 'ti-calendar-check');
  };

  const saveEvent = () => {
    if (!eventTitle || !eventDate) { showToast('Please fill in title and date', 'ti-alert-circle'); return; }
    setEventCount((n) => n + 1);
    setShowAddEvent(false);
    showToast(`Event "${eventTitle}" added!`, 'ti-calendar-plus');
    setEventTitle(''); setEventDate('');
  };

  const p = PERF_DATA[perf];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Hi, welcome to Amit School Library dashboard"
        actions={
          <>
            <button className="btn-ghost-purple" onClick={() => setShowIssue(true)}>
              <i className="ti ti-transfer-in"></i>Issue book
            </button>
            <button className="btn-purple" onClick={() => setShowAddBook(true)}>
              <i className="ti ti-book-2"></i>Add new book
            </button>
          </>
        }
      />

      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3 mb-4">
        {STATS.map((s, i) => (
          <StatCard key={i} {...s} num={i === 0 ? totalBooks.toLocaleString() : s.num} />
        ))}
      </div>

      <div className="row g-3 mb-4">
        {ATTENDANCE.map((a, i) => (
          <div className="col-lg-4 col-md-6" key={i}>
            <div className="att-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="att-card-title">{a.title}</span>
                <span className="att-badge" style={{ background: a.badgeBg, color: a.badgeColor }}>July 2024</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="donut-ring">
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" strokeWidth="9" style={{ stroke: a.ringBg }} />
                    <circle cx="40" cy="40" r="32" fill="none" stroke={a.stroke} strokeWidth="9" strokeDasharray={a.dash} strokeLinecap="round" />
                  </svg>
                  <div className="donut-pct">{a.pct}</div>
                </div>
                <div>
                  <div className="mb-2"><div className="att-stat-label">Available</div><div className="att-stat-val">{a.available}</div></div>
                  <div><div className="att-stat-label">Issued out</div><div className="att-stat-val" style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{a.issued}</div></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="ec-card h-100">
            <div className="ec-card-head">
              <h2>Book circulation</h2>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, display: 'inline-block', background: '#f5deb3' }}></span>Books issued
                  </div>
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, display: 'inline-block', background: '#4d0011' }}></span>Books returned
                  </div>
                </div>
                <div className="dropdown">
                  <button className="chart-period-btn" onClick={() => document.getElementById('periodMenu').classList.toggle('show')}>
                    {PERIOD_DATA[period].label} <i className="ti ti-chevron-down"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" id="periodMenu" style={{ position: 'absolute' }}>
                    {Object.entries(PERIOD_DATA).map(([key, d]) => (
                      <li key={key}>
                        <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changePeriod(key); document.getElementById('periodMenu').classList.remove('show'); }}>
                          {d.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="chart-wrap"><canvas ref={canvasRef}></canvas></div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="ec-card h-100">
            <div className="ec-card-head">
              <h2>Library calendar</h2>
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <MiniCalendar
                eventDays={{ [new Date().getFullYear()]: { [new Date().getMonth()]: [9, 11] } }}
                onAddEvent={() => setShowAddEvent(true)}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="ec-card h-100">
            <div className="ec-card-head">
              <h2>Upcoming events <span className="att-badge" style={{ background: 'var(--amber-light)', color: 'var(--amber)', marginLeft: 6 }}>{eventCount}</span></h2>
              <button className="see-all-btn" onClick={() => setShowAllEvents(true)}>See all</button>
            </div>
            <div>
              {EVENTS.slice(0, 3).map((e, i) => (
                <div className="act-item" key={i} style={i === 2 ? { borderBottom: 'none' } : undefined} onClick={() => showToast('Opening: ' + e.name, 'ti-calendar-event')}>
                  <div className="act-num" style={{ background: e.color }}>{e.num}</div>
                  <div className="flex-grow-1"><div className="act-name">{e.name}</div><div className="act-time">{e.time}</div></div>
                  <i className="ti ti-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="ec-card h-100">
            <div className="ec-card-head">
              <h2>Category performance</h2>
              <select className="perf-std-select" value={perf} onChange={(e) => { setPerf(e.target.value); showToast(e.target.value + ' data loaded', 'ti-books'); }}>
                {Object.keys(PERF_DATA).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="d-flex align-items-center gap-4 p-3">
              <div className="perf-ring">
                <svg viewBox="0 0 86 86">
                  <circle cx="43" cy="43" r="36" fill="none" strokeWidth="9" style={{ stroke: 'var(--purple-light)' }} />
                  <circle cx="43" cy="43" r="36" fill="none" stroke="#4d0011" strokeWidth="9" strokeDasharray={p.dash} strokeLinecap="round" />
                </svg>
                <div className="perf-center">
                  <div className="perf-pct">{p.pct}%</div>
                  <div className="perf-label">{p.rating}</div>
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="mb-3">
                  <div className="perf-label">Checkout rate</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--purple)' }}>{p.att}</div>
                </div>
                <div>
                  <div className="perf-label">Member rating</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pink)' }}>{p.grade}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <div className="ec-card">
            <div className="ec-card-head">
              <h2><i className="ti ti-calendar-time me-1" style={{ color: 'var(--purple)' }}></i>Library timetable</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>This week</span>
            </div>
            <div className="lib-table-wrap">
              <table className="lib-table">
                <tbody>
                  <tr><th>Day</th><th>9 – 10</th><th>10 – 11</th><th>11 – 12</th><th>12 – 1</th></tr>
                  {TIMETABLE.map((row, i) => (
                    <tr key={i}>
                      <td>{row[0]}</td>
                      {row.slice(1).map((slot, j) => <td key={j}><span className="slot-chip">{slot}</span></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="thought-banner">
        <i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.
      </div>

      <Modal open={showAddBook} onClose={() => setShowAddBook(false)} title="Add New Book" icon="ti-book-2"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowAddBook(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveBook}><i className="ti ti-check"></i>Save Book</button></>}>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Book Title</label><input className="form-control" placeholder="Title of the book" /></div>
          <div className="col-6"><label className="form-label">ISBN</label><input className="form-control" placeholder="978-XX-XXXXX-XX-X" /></div>
          <div className="col-6"><label className="form-label">Author</label><input className="form-control" placeholder="Author name" /></div>
          <div className="col-6"><label className="form-label">Publisher</label><input className="form-control" placeholder="Publisher name" /></div>
          <div className="col-6">
            <label className="form-label">Category</label>
            <select className="form-select">
              <option>Select category</option><option>Mathematics</option><option>Science</option>
              <option>English Literature</option><option>Hindi</option><option>Social Science</option>
              <option>Story &amp; Moral Books</option><option>Reference &amp; General Knowledge</option><option>Competitive Exam Books</option>
            </select>
          </div>
          <div className="col-6"><label className="form-label">Copies</label><input type="number" className="form-control" placeholder="Number of copies" min="1" /></div>
        </div>
      </Modal>

      <Modal open={showIssue} onClose={() => setShowIssue(false)} title="Issue Book" icon="ti-transfer-in"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowIssue(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveIssue}><i className="ti ti-check"></i>Issue Book</button></>}>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">ID</label><input className="form-control" placeholder="e.g. ISS-006 (auto if left blank)" value={issueForm.id} onChange={(e) => setIssueForm({ ...issueForm, id: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Name</label><input className="form-control" placeholder="Student / teacher name" value={issueForm.name} onChange={(e) => setIssueForm({ ...issueForm, name: e.target.value })} /></div>
          <div className="col-6">
            <label className="form-label">User Type</label>
            <select className="form-select" value={issueForm.userType} onChange={(e) => setIssueForm({ ...issueForm, userType: e.target.value })}>
              <option value="">Select type</option><option>Student</option><option>Teacher</option>
            </select>
          </div>
          <div className="col-6"><label className="form-label">Book ID</label><input className="form-control" placeholder="e.g. BK-1002" value={issueForm.bookId} onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Book Name</label><input className="form-control" placeholder="e.g. To Kill a Mockingbird" value={issueForm.bookName} onChange={(e) => setIssueForm({ ...issueForm, bookName: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Issue Date</label><input type="date" className="form-control" value={issueForm.issueDate} onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Due Date</label><input type="date" className="form-control" value={issueForm.dueDate} onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={showAddEvent} onClose={() => setShowAddEvent(false)} title="Add Event" icon="ti-calendar-plus" size="sm"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowAddEvent(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveEvent}><i className="ti ti-check"></i>Add Event</button></>}>
        <div className="mb-3"><label className="form-label">Event Title</label><input className="form-control" placeholder="e.g. Book Club Meetup" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} /></div>
        <div className="mb-3"><label className="form-label">Date</label><input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></div>
        <div className="mb-0"><label className="form-label">Time</label><input type="time" className="form-control" /></div>
      </Modal>

      <Modal open={showAllEvents} onClose={() => setShowAllEvents(false)} title="All Upcoming Events" icon="ti-calendar-event">
        <div style={{ margin: '-20px' }}>
          {EVENTS.map((e, i) => (
            <div className="act-item" key={i} style={i === EVENTS.length - 1 ? { borderBottom: 'none' } : undefined}>
              <div className="act-num" style={{ background: e.color }}>{e.num}</div>
              <div className="flex-grow-1"><div className="act-name">{e.name}</div><div className="act-time">{e.time}</div></div>
              <i className="ti ti-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
