import React, { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastContext';

const FIRST = ['Arjun','Priya','Rohan','Ananya','Vikram','Sneha','Karan','Divya','Aditya','Meera','Rahul','Pooja','Aryan','Kavya','Ishaan','Riya','Yash','Tanya','Dev','Simran'];
const LAST = ['Sharma','Verma','Patel','Reddy','Nair','Gupta','Iyer','Singh','Menon','Rao'];

// Nursery -> Class 10, in display order. `key` is what's stored on each student as `cls`.
const CLASS_DEFS = [
  { key: 'N', label: 'Nursery' },
  { key: 'LKG', label: 'LKG' },
  { key: 'UKG', label: 'UKG' },
  { key: '1', label: '1st' },
  { key: '2', label: '2nd' },
  { key: '3', label: '3rd' },
  { key: '4', label: '4th' },
  { key: '5', label: '5th' },
  { key: '6', label: '6th' },
  { key: '7', label: '7th' },
  { key: '8', label: '8th' },
  { key: '9', label: '9th' },
  { key: '10', label: '10th' },
];
const CLASS_LABEL = Object.fromEntries(CLASS_DEFS.map((c) => [c.key, c.label]));
const CLASS_ORDER = Object.fromEntries(CLASS_DEFS.map((c, i) => [c.key, i]));

function makeStudents() {
  let roll = 101;
  const list = [];
  CLASS_DEFS.forEach(({ key }, clsIdx) => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const first = FIRST[(clsIdx * 7 + i * 3) % FIRST.length];
      const last = LAST[(clsIdx * 3 + i) % LAST.length];
      const status = (clsIdx + i) % 3 === 0 ? 'Paid' : 'Pending';
      const total = 25000 + clsIdx * 500;
      const paid = status === 'Paid' ? total : Math.round((total * 0.5) / 500) * 500;
      const pending = total - paid;
      list.push({
        id: roll,
        roll,
        name: `${first} ${last}`,
        cls: key,
        parent: `${LAST[(clsIdx + i) % LAST.length]} Family`,
        phone: `+91 98${(10000000 + clsIdx * 1000 + i * 37) % 90000000 + 10000000}`.slice(0, 13),
        total,
        paid,
        pending,
        status,
      });
      roll++;
    }
  });
  return list;
}

export default function Students() {
  const showToast = useToast();
  const [students, setStudents] = useState(makeStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Paid' | 'Pending'
  const [classFilter, setClassFilter] = useState('all');   // 'all' | CLASS_DEFS key
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    return students
      .filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || String(s.roll).includes(search))
      .filter((s) => statusFilter === 'all' || s.status === statusFilter)
      .filter((s) => classFilter === 'all' || s.cls === classFilter)
      .sort((a, b) => CLASS_ORDER[a.cls] - CLASS_ORDER[b.cls] || a.roll - b.roll);
  }, [students, search, statusFilter, classFilter]);

  const paidCount = students.filter((s) => s.status === 'Paid').length;
  const pendingCount = students.filter((s) => s.status === 'Pending').length;

  function notifyParent(e, s) {
    e.stopPropagation();
    showToast(`Payment reminder sent to ${s.parent}`, 'ti-bell');
  }

  function csvEscape(value) {
    const str = String(value ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  }

  function exportExcel() {
    if (filtered.length === 0) { showToast('No data to export', 'ti-alert-triangle'); return; }
    const headers = ['Roll No.', 'Name', 'Class', 'Total', 'Paid', 'Pending', 'Status'];
    const rows = filtered.map((s) => [s.roll, s.name, CLASS_LABEL[s.cls] || s.cls, s.total, s.paid, s.pending, s.status]);
    const csv = '\ufeff' + [headers, ...rows].map((r) => r.map(csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Students-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Excel sheet downloaded', 'ti-file-spreadsheet');
  }

  function exportPDF() {
    if (filtered.length === 0) { showToast('No data to export', 'ti-alert-triangle'); return; }
    const totalSum = filtered.reduce((sum, s) => sum + s.total, 0);
    const paidSum = filtered.reduce((sum, s) => sum + s.paid, 0);
    const pendingSum = filtered.reduce((sum, s) => sum + s.pending, 0);

    const rowsHtml = filtered.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${s.roll}</td>
        <td>${s.name}</td>
        <td>${CLASS_LABEL[s.cls] || s.cls}</td>
        <td>₹${s.total.toLocaleString('en-IN')}</td>
        <td>₹${s.paid.toLocaleString('en-IN')}</td>
        <td>₹${s.pending.toLocaleString('en-IN')}</td>
        <td>${s.status}</td>
      </tr>`).join('');

    const printWindow = window.open('', '_blank', 'width=1000,height=1000');
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Fee Report</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, Helvetica, sans-serif; padding: 32px; color: #1f1f2e; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #4d0011; padding-bottom: 12px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 20px; }
            .header p { margin: 4px 0 0; color: #666; font-size: 12px; }
            .meta { text-align: right; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
            th { background: #4d0011; color: #fff; text-align: left; padding: 7px 9px; }
            td { padding: 6px 9px; border-bottom: 1px solid #eee; }
            tr:nth-child(even) { background: #f7f6fd; }
            .summary { display: flex; gap: 22px; margin: 16px 0 20px; font-size: 12px; flex-wrap: wrap; }
            .summary b { display: block; font-size: 16px; color: #4d0011; }
            .footer { margin-top: 24px; font-size: 10px; color: #999; text-align: center; }
            @media print { body { padding: 12mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Student Fee Report</h1>
              <p>Amit School · Fee Status Summary</p>
            </div>
            <div class="meta">Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
          <div class="summary">
            <div>Students <b>${filtered.length}</b></div>
            <div>Total Fee <b>₹${totalSum.toLocaleString('en-IN')}</b></div>
            <div>Paid <b>₹${paidSum.toLocaleString('en-IN')}</b></div>
            <div>Pending <b>₹${pendingSum.toLocaleString('en-IN')}</b></div>
          </div>
          <table>
            <thead>
              <tr><th>#</th><th>Roll No.</th><th>Name</th><th>Class</th><th>Total</th><th>Paid</th><th>Pending</th><th>Status</th></tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <div class="footer">This is a system-generated report.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="page-title">
          <h1>Students</h1>
          <p>Manage student records and fee status</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-purple"><i className="ti ti-users"></i></div>
          <div><div className="stat-num ">{students.length}</div><div className="stat-label">Total students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green"><i className="ti ti-circle-check"></i></div>
          <div><div className="stat-num">{paidCount}</div><div className="stat-label">Fees paid</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red"><i className="ti ti-alert-triangle"></i></div>
          <div><div className="stat-num">{pendingCount}</div><div className="stat-label">Fees pending</div></div>
        </div>
      </div>

      <div className="ec-card">
        <div className="toolbar-row" style={{ margin: '0 0 0', padding: '16px 20px' }}>
          <div className="search-wrap">
            <i className="ti ti-search"></i>
            <input
              placeholder="Search Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="std-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <select className="std-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">All Classes</option>
            {CLASS_DEFS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="d-flex gap-2">
            <button className="btn-ghost-purple std-export-pdf" onClick={exportPDF}>
              <i className="ti ti-file-type-pdf"></i>PDF
            </button>
            <button className="btn-ghost-purple std-export-excel" onClick={exportExcel}>
              <i className="ti ti-file-spreadsheet"></i>Excel
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll no</th>
                <th>Name</th>
                <th>Class</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No students match your search / filter.</td></tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => setViewing(s)} style={{ cursor: 'pointer' }}>
                  <td>{s.roll}</td>
                  <td>{s.name}</td>
                  <td>{CLASS_LABEL[s.cls] || s.cls}</td>
                  <td>₹{s.total.toLocaleString('en-IN')}</td>
                  <td>₹{s.paid.toLocaleString('en-IN')}</td>
                  <td>₹{s.pending.toLocaleString('en-IN')}</td>
                  <td><span className={`badge-pill ${s.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>{s.status}</span></td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name || ''} icon="ti-id-badge">
        {viewing && (
          <div>
            <div className="form-row mb-3">
              <div><div className="form-label">Admission no.</div><div>{viewing.roll}</div></div>
              <div><div className="form-label">Class</div><div>{CLASS_LABEL[viewing.cls] || viewing.cls}</div></div>
            </div>
            <div className="form-row mb-3">
              <div><div className="form-label">Parent</div><div>{viewing.parent}</div></div>
              <div><div className="form-label">Phone</div><div>{viewing.phone}</div></div>
            </div>
            <hr className="settings-divider" />
            <div className="form-row mb-3">
              <div><div className="form-label">Total fee</div><div>₹{viewing.total.toLocaleString('en-IN')}</div></div>
              <div><div className="form-label">Status</div><span className={`badge-pill ${viewing.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>{viewing.status}</span></div>
            </div>
            <div className="form-row">
              <div><div className="form-label">Paid</div><div style={{ color: '#1a8a4a', fontWeight: 600 }}>₹{viewing.paid.toLocaleString('en-IN')}</div></div>
              <div><div className="form-label">Pending</div><div style={{ color: '#c0392b', fontWeight: 600 }}>₹{viewing.pending.toLocaleString('en-IN')}</div></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}