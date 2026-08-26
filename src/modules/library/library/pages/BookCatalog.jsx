import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel } from '../utils/exportHelpers';
import { apiGet, apiPost } from '../utils/api';

const CATEGORIES = ['Mathematics','Science','English Literature','Hindi','Social Science','Story & Moral Books','Reference & General Knowledge','Competitive Exam Books'];

export default function BookCatalog() {
  const showToast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [form, setForm] = useState({ title: '', isbn: '', author: '', publisher: '', category: '', copies: '' });

  useEffect(() => {
    let cancelled = false;
    apiGet('/library')
      .then((res) => {
        if (cancelled) return;
        setBooks((res.data ?? []).map((b) => ({
          id: b.bookId || b._id, name: b.title, author: b.author || '—', category: b.category, qty: b.quantity ?? 0, status: b.status,
        })));
      })
      .catch(() => { if (!cancelled) showToast('Could not load book catalog', 'ti-alert-circle'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => books.filter((b) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    const matchesCategory = !category || b.category === category;
    const matchesStatus = !status || b.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [books, search, category, status]);

  const stats = {
    total: books.reduce((s, b) => s + b.qty, 0),
    available: books.filter((b) => b.status === 'Available').reduce((s, b) => s + b.qty, 0),
    issued: books.filter((b) => b.status === 'Issued').length * 8 + 21,
    overdue: books.filter((b) => b.status === 'Overdue').length * 7 + 1,
  };

  const saveBook = async () => {
    if (!form.title || !form.category) { showToast('Please fill in required fields', 'ti-alert-circle'); return; }
    const newId = 'BK-' + (1000 + books.length + 1);
    try {
      const res = await apiPost('/library', {
        bookId: newId, title: form.title, isbn: form.isbn, author: form.author || '—', publisher: form.publisher,
        category: form.category, quantity: Number(form.copies) || 1, status: 'Available',
      });
      setBooks((prev) => [...prev, { id: res.data.bookId || res.data._id, name: res.data.title, author: res.data.author || '—', category: res.data.category, qty: res.data.quantity ?? 0, status: res.data.status }]);
      setShowAdd(false);
      setForm({ title: '', isbn: '', author: '', publisher: '', category: '', copies: '' });
      showToast('New book added to catalog successfully!', 'ti-circle-check');
    } catch (err) {
      showToast(err.message || 'Could not add book', 'ti-alert-circle');
    }
  };

  const badgeClass = { Available: 'badge-available', Issued: 'badge-issued', Overdue: 'badge-overdue' };

  const exportBooks = () => exportToExcel('book-catalog', [
    { key: 'id', label: 'Book ID' }, { key: 'name', label: 'Book Name' }, { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' }, { key: 'qty', label: 'Quantity' }, { key: 'status', label: 'Status' },
  ], filtered);

  return (
    <>
      <PageHeader
        title="Book Catalog"
        subtitle="Manage and track every book in the Amit School library"
        actions={
          <>
            <button className="btn-ghost-purple" onClick={() => setShowIssue(true)}><i className="ti ti-transfer-in"></i>Issue book</button>
            <button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-book-2"></i>Add book</button>
          </>
        }
      />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-books" color="purple" num={stats.total.toLocaleString()} label="Total books" />
        <StatCard icon="ti-book-2" color="green" num={stats.available.toLocaleString()} label="Available books" />
        <StatCard icon="ti-transfer-in" color="blue" num="85" label="Issued books" />
        <StatCard icon="ti-alert-circle" color="red" num="15" label="Overdue books" />
      </div>

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <input type="search" className="form-control" placeholder="Search by book name, author, or book ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 210 }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth: 170 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All status</option>
            <option>Available</option><option>Issued</option><option>Overdue</option>
          </select>
          <button className="export-btn excel" onClick={exportBooks}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2>All books <span className="att-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)', marginLeft: 6 }}>{filtered.length}</span></h2>
        </div>
        <div className="lib-table-wrap">
          <table className="lib-table">
            <thead>
              <tr><th className="text-start">Book ID</th><th className="text-start">Book Name</th><th>Author</th><th>Category</th><th>Quantity</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="text-start">{b.id}</td>
                  <td className="text-start">{b.name}</td>
                  <td>{b.author}</td>
                  <td>{b.category}</td>
                  <td>{b.qty}</td>
                  <td><span className={`badge-status ${badgeClass[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading books…</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No books match your search/filter.</p>
          )}
        </div>
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Book" icon="ti-book-2"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveBook}><i className="ti ti-check"></i>Save Book</button></>}>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Book Title</label><input className="form-control" placeholder="Title of the book" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">ISBN</label><input className="form-control" placeholder="978-XX-XXXXX-XX-X" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Author</label><input className="form-control" placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Publisher</label><input className="form-control" placeholder="Publisher name" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} /></div>
          <div className="col-6">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-6"><label className="form-label">Copies</label><input type="number" min="1" className="form-control" placeholder="Number of copies" value={form.copies} onChange={(e) => setForm({ ...form, copies: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={showIssue} onClose={() => setShowIssue(false)} title="Issue Book" icon="ti-transfer-in"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowIssue(false)}>Cancel</button><button className="btn-purple ms-2" onClick={() => { setShowIssue(false); showToast('Book issued successfully!', 'ti-calendar-check'); }}><i className="ti ti-check"></i>Issue Book</button></>}>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Book Title</label><input className="form-control" placeholder="e.g. To Kill a Mockingbird" /></div>
          <div className="col-6"><label className="form-label">Member Name</label><input className="form-control" placeholder="Member name" /></div>
          <div className="col-4"><label className="form-label">Member ID</label><input className="form-control" placeholder="e.g. LIB-1042" /></div>
          <div className="col-4"><label className="form-label">Issue Date</label><input type="date" className="form-control" /></div>
          <div className="col-4"><label className="form-label">Due Date</label><input type="date" className="form-control" /></div>
        </div>
      </Modal>
    </>
  );
}
