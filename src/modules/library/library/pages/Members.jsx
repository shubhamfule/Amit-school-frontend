import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel } from '../utils/exportHelpers';

const AVATAR_COLORS = [
  { bg: 'var(--purple-light)', fg: 'var(--purple)' }, { bg: 'var(--blue-light)', fg: 'var(--blue)' },
  { bg: 'var(--red-light)', fg: 'var(--red)' }, { bg: 'var(--pink-light)', fg: 'var(--pink)' },
  { bg: 'var(--teal-light)', fg: 'var(--teal)' }, { bg: 'var(--amber-light)', fg: 'var(--amber)' },
  { bg: 'var(--green-light)', fg: 'var(--green)' },
];

function initials(name) {
  return name.replace(/^(Mr\.|Mrs\.|Ms\.)\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const INITIAL_MEMBERS = [
  { id: 'MEM-101', name: 'Priya Sharma', subject: 'Class 8A', role: 'Student', issued: 2, returned: 5, record: 'Active' },
  { id: 'MEM-102', name: 'Rohit Verma', subject: 'Class 7B', role: 'Student', issued: 0, returned: 3, record: 'Clear' },
  { id: 'MEM-103', name: 'Karan Mehta', subject: 'Class 9A', role: 'Student', issued: 1, returned: 2, record: 'Overdue' },
  { id: 'MEM-104', name: 'Simran Kaur', subject: 'Class 6A', role: 'Student', issued: 0, returned: 4, record: 'Clear' },
  { id: 'MEM-105', name: 'Aditya Singh', subject: 'Class 10B', role: 'Student', issued: 0, returned: 6, record: 'Clear' },
  { id: 'MEM-106', name: 'Ananya Gupta', subject: 'Class 8B', role: 'Student', issued: 0, returned: 1, record: 'Clear' },
  { id: 'MEM-201', name: 'Mrs. Anjali Nair', subject: 'Hindi', role: 'Teacher', issued: 1, returned: 8, record: 'Overdue' },
  { id: 'MEM-202', name: 'Mr. Suresh Iyer', subject: 'General Knowledge', role: 'Teacher', issued: 1, returned: 10, record: 'Active' },
  { id: 'MEM-203', name: 'Mrs. Kavita Rao', subject: 'Science', role: 'Teacher', issued: 0, returned: 12, record: 'Clear' },
  { id: 'MEM-204', name: 'Mr. Rajesh Kumar', subject: 'Social Science', role: 'Teacher', issued: 0, returned: 9, record: 'Clear' },
];

const recordBadge = { Active: 'badge-issued', Clear: 'badge-available', Overdue: 'badge-overdue' };

export default function Members() {
  const showToast = useToast();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [record, setRecord] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', subject: '' });

  const filtered = useMemo(() => members.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    const matchesRole = !role || m.role === role;
    const matchesRecord = !record || m.record === record;
    return matchesSearch && matchesRole && matchesRecord;
  }), [members, search, role, record]);

  const stats = {
    total: members.length,
    students: members.filter((m) => m.role === 'Student').length,
    teachers: members.filter((m) => m.role === 'Teacher').length,
    overdue: members.filter((m) => m.record === 'Overdue').length,
  };

  const saveMember = () => {
    if (!form.name || !form.role) { showToast('Please fill in required fields', 'ti-alert-circle'); return; }
    const prefix = form.role === 'Teacher' ? 'MEM-2' : 'MEM-1';
    const newId = prefix + String(members.length + 1).padStart(2, '0');
    setMembers((prev) => [...prev, { id: newId, name: form.name, subject: form.subject || '—', role: form.role, issued: 0, returned: 0, record: 'Clear' }]);
    setShowAdd(false);
    setForm({ name: '', role: '', subject: '' });
    showToast('New member added successfully!', 'ti-user-plus');
  };

  const exportMembers = () => exportToExcel('members', [
    { key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { key: 'subject', label: 'Subject / Class' },
    { key: 'role', label: 'Role' }, { key: 'issued', label: 'Books Issued' }, { key: 'returned', label: 'Books Returned' },
    { key: 'record', label: 'Current Record' },
  ], filtered);

  return (
    <>
      <PageHeader
        title="Members"
        subtitle="All students & teachers registered with the Amit School library"
        actions={<button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-user-plus"></i>Add member</button>}
      />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-users" color="purple" num={stats.total} label="Total members" />
        <StatCard icon="ti-school" color="blue" num={stats.students} label="Students" />
        <StatCard icon="ti-user-check" color="teal" num={stats.teachers} label="Teachers" />
        <StatCard icon="ti-alert-circle" color="red" num={stats.overdue} label="With overdue books" />
      </div>

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <input type="search" className="form-control" placeholder="Search by name, ID, or subject/class…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 170 }} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option><option>Student</option><option>Teacher</option>
          </select>
          <select className="form-select" style={{ maxWidth: 170 }} value={record} onChange={(e) => setRecord(e.target.value)}>
            <option value="">All records</option><option>Active</option><option>Clear</option><option>Overdue</option>
          </select>
          <button className="export-btn excel" onClick={exportMembers}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2><i className="ti ti-users me-1" style={{ color: 'var(--purple)' }}></i>All members <span className="att-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)', marginLeft: 6 }}>{filtered.length}</span></h2>
        </div>
        <div className="lib-table-wrap">
          <table className="lib-table">
            <thead>
              <tr><th className="text-start">Student ID</th><th className="text-start">Name</th><th>Subject / Class</th><th>Role</th><th>Books Issued</th><th>Books Returned</th><th>Current Record</th></tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <tr key={m.id}>
                    <td className="text-start">{m.id}</td>
                    <td className="text-start"><span className="member-avatar" style={{ background: c.bg, color: c.fg }}>{initials(m.name)}</span>{m.name}</td>
                    <td>{m.subject}</td>
                    <td>{m.role}</td>
                    <td>{m.issued}</td>
                    <td>{m.returned}</td>
                    <td><span className={`badge-status ${recordBadge[m.record]}`}>{m.record}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No members match your search/filter.</p>
          )}
        </div>
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Member" icon="ti-user-plus"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveMember}><i className="ti ti-check"></i>Add Member</button></>}>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Full Name</label><input className="form-control" placeholder="Student / teacher name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="col-6">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="">Select role</option><option>Student</option><option>Teacher</option>
            </select>
          </div>
          <div className="col-12"><label className="form-label">Subject / Class</label><input className="form-control" placeholder="e.g. Class 8A (student) or Mathematics (teacher)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
        </div>
      </Modal>
    </>
  );
}
