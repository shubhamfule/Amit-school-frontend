import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel } from '../utils/exportHelpers';
import { apiGet, apiPost } from '../utils/api';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const EMPTY_ISSUE_FORM = { id: '', name: '', userType: '', bookId: '', bookName: '', issueDate: '', dueDate: '' };

const ISSUE_COLUMNS = [
  { key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { key: 'type', label: 'User Type' },
  { key: 'bookId', label: 'Book ID' }, { key: 'bookName', label: 'Book Name' },
  { key: 'issueDate', label: 'Issue Date' }, { key: 'dueDate', label: 'Due Date' },
];

const RETURN_COLUMNS = [
  { key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { key: 'type', label: 'User Type' },
  { key: 'bookId', label: 'Book ID' }, { key: 'issueDate', label: 'Issue Date' }, { key: 'returnDate', label: 'Return Date' },
  { key: 'clearanceAmount', label: 'Clearance Amount' }, { key: 'damageType', label: 'Damage Type' }, { key: 'payment', label: 'Payment Status' },
];

export default function IssueReturn() {
  const showToast = useToast();
  const [issued, setIssued] = useState([]);
  const [returned, setReturned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState('issue'); // 'issue' | 'return'
  const [userType, setUserType] = useState('');
  const [issuedSearch, setIssuedSearch] = useState('');
  const [returnedSearch, setReturnedSearch] = useState('');
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState(EMPTY_ISSUE_FORM);

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiGet('/book-issues'), apiGet('/book-returns')])
      .then(([issuedRes, returnedRes]) => {
        if (cancelled) return;
        setIssued((issuedRes.data ?? []).map((r) => ({
          id: r.memberId || r._id, name: r.name, type: r.userType, bookId: r.bookId, bookName: r.bookName, issueDate: r.issueDate, dueDate: r.dueDate,
        })));
        setReturned((returnedRes.data ?? []).map((r) => ({
          id: r.memberId || r._id, name: r.name, type: r.userType, bookId: r.bookId, issueDate: r.issueDate, returnDate: r.returnDate,
          clearanceAmount: r.clearanceAmount ?? 0, damageType: r.damageType || 'No Damage', payment: r.payment || 'Unpaid',
        })));
      })
      .catch(() => { if (!cancelled) showToast('Could not load issue/return records', 'ti-alert-circle'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredIssued = useMemo(() => issued.filter((r) =>
    (!userType || r.type === userType) &&
    (!issuedSearch || `${r.name} ${r.bookName} ${r.bookId} ${r.id}`.toLowerCase().includes(issuedSearch.toLowerCase()))
  ), [issued, userType, issuedSearch]);

  const filteredReturned = useMemo(() => returned.filter((r) =>
    (!userType || r.type === userType) &&
    (!returnedSearch || `${r.name} ${r.bookId} ${r.id}`.toLowerCase().includes(returnedSearch.toLowerCase()))
  ), [returned, userType, returnedSearch]);

  const saveIssue = async () => {
    if (!issueForm.name || !issueForm.userType || !issueForm.bookName || !issueForm.issueDate || !issueForm.dueDate) {
      showToast('Please fill in required fields', 'ti-alert-circle');
      return;
    }
    const newId = issueForm.id || (issueForm.userType === 'Teacher' ? 'MEM-2' : 'MEM-1') + String(issued.length + 1).padStart(2, '0');
    try {
      const res = await apiPost('/book-issues', {
        memberId: newId, name: issueForm.name, userType: issueForm.userType, bookId: issueForm.bookId || '—',
        bookName: issueForm.bookName, issueDate: issueForm.issueDate, dueDate: issueForm.dueDate,
      });
      setIssued((prev) => [{
        id: res.data.memberId || res.data._id, name: res.data.name, type: res.data.userType, bookId: res.data.bookId,
        bookName: res.data.bookName, issueDate: res.data.issueDate, dueDate: res.data.dueDate,
      }, ...prev]);
      setShowIssue(false);
      setIssueForm(EMPTY_ISSUE_FORM);
      showToast('Book issued successfully!', 'ti-calendar-check');
    } catch (err) {
      showToast(err.message || 'Could not issue book', 'ti-alert-circle');
    }
  };

  const exportIssued = () => exportToExcel('issue-table', ISSUE_COLUMNS, filteredIssued);
  const exportReturned = () => exportToExcel('return-table', RETURN_COLUMNS, filteredReturned);

  return (
    <>
      <PageHeader
        title="Issue & Return"
        subtitle="Track every book issued to and returned by students & teachers"
        actions={
          <button className="btn-purple" onClick={() => setShowIssue(true)}><i className="ti ti-transfer-in"></i>Issue book</button>
        }
      />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-transfer-in" color="blue" num={issued.length} label="Currently issued" />
        <StatCard icon="ti-corner-down-left" color="green" num={returned.length} label="Returned this month" />
        <StatCard icon="ti-alert-circle" color="red" num="7" label="Overdue" />
        <StatCard icon="ti-clock-hour-4" color="amber" num="3" label="Due today" />
      </div>

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="seg-tabs">
            <button className={`seg-tab ${activeTable === 'issue' ? 'active' : ''}`} onClick={() => setActiveTable('issue')}>
              <i className="ti ti-transfer-in"></i>Issue
            </button>
            <button className={`seg-tab ${activeTable === 'return' ? 'active' : ''}`} onClick={() => setActiveTable('return')}>
              <i className="ti ti-corner-down-left"></i>Return
            </button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
              <i className="ti ti-filter" style={{ fontSize: 14, verticalAlign: -2 }}></i> Filter by:
            </div>
            <select className="form-select" style={{ maxWidth: 170 }} value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="">All user types</option><option>Student</option><option>Teacher</option>
            </select>
          </div>
        </div>
      </div>

      {activeTable === 'issue' && (
        <div className="ec-card mb-3">
          <div className="ec-card-head flex-wrap gap-2">
            <h2><i className="ti ti-transfer-in me-1" style={{ color: 'var(--blue)' }}></i>Issue table <span className="att-badge" style={{ background: 'var(--blue-light)', color: 'var(--blue)', marginLeft: 6 }}>{filteredIssued.length}</span></h2>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div style={{ minWidth: 220 }}>
                <input type="search" className="form-control" placeholder="Search issued books…" value={issuedSearch} onChange={(e) => setIssuedSearch(e.target.value)} />
              </div>
              <button className="export-btn excel" onClick={exportIssued}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
            </div>
          </div>
          <div className="lib-table-wrap">
            <table className="lib-table">
              <thead><tr><th className="text-start">Student ID</th><th className="text-start">Name</th><th>User Type</th><th>Book ID</th><th className="text-start">Book Name</th><th>Issue Date</th><th>Due Date</th></tr></thead>
              <tbody>
                {filteredIssued.map((r) => (
                  <tr key={r.id}>
                    <td className="text-start">{r.id}</td><td className="text-start">{r.name}</td><td>{r.type}</td><td>{r.bookId}</td>
                    <td className="text-start">{r.bookName}</td><td>{formatDate(r.issueDate)}</td><td>{formatDate(r.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>}
            {!loading && filteredIssued.length === 0 && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No issued books match your search/filter.</p>}
          </div>
        </div>
      )}

      {activeTable === 'return' && (
        <div className="ec-card">
          <div className="ec-card-head flex-wrap gap-2">
            <h2><i className="ti ti-corner-down-left me-1" style={{ color: 'var(--green)' }}></i>Return table <span className="att-badge" style={{ background: 'var(--green-light)', color: 'var(--green)', marginLeft: 6 }}>{filteredReturned.length}</span></h2>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div style={{ minWidth: 220 }}>
                <input type="search" className="form-control" placeholder="Search returned books…" value={returnedSearch} onChange={(e) => setReturnedSearch(e.target.value)} />
              </div>
              <button className="export-btn excel" onClick={exportReturned}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
            </div>
          </div>
          <div className="lib-table-wrap">
            <table className="lib-table">
              <thead><tr><th className="text-start">Student ID</th><th className="text-start">Name</th><th>User Type</th><th>Book ID</th><th>Issue Date</th><th>Return Date</th><th>Clearance Amount</th><th>Damage Type</th><th>Payment Status</th></tr></thead>
              <tbody>
                {filteredReturned.map((r) => (
                  <tr key={r.id}>
                    <td className="text-start">{r.id}</td><td className="text-start">{r.name}</td><td>{r.type}</td><td>{r.bookId}</td>
                    <td>{formatDate(r.issueDate)}</td><td>{formatDate(r.returnDate)}</td><td>₹{r.clearanceAmount}</td><td>{r.damageType}</td>
                    <td><span className={`badge-status ${r.payment === 'Paid' ? 'badge-ontime' : 'badge-late'}`}>{r.payment}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>}
            {!loading && filteredReturned.length === 0 && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No returned books match your search/filter.</p>}
          </div>
        </div>
      )}

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal open={showIssue} onClose={() => setShowIssue(false)} title="Issue Book" icon="ti-transfer-in"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowIssue(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveIssue}><i className="ti ti-check"></i>Issue Book</button></>}>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Student ID</label><input className="form-control" placeholder="e.g. MEM-101 (existing member ID, auto if left blank)" value={issueForm.id} onChange={(e) => setIssueForm({ ...issueForm, id: e.target.value })} /></div>
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
    </>
  );
}
