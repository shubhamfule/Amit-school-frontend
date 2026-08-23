import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import { notices as seedNotices } from "./directoryData";

export default function Notices() {
  const { showToast } = useOutletContext();
  const [list, setList] = useState(seedNotices);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", audience: "All Classes" });

  const addNotice = () => {
    if (!form.title.trim()) {
      showToast("Please enter a notice title", "ti-alert-triangle");
      return;
    }
    setList((l) => [{ id: Date.now(), title: form.title, audience: form.audience, date: new Date().toISOString().slice(0, 10) }, ...l]);
    setForm({ title: "", audience: "All Classes" });
    setModalOpen(false);
    showToast("Notice published", "ti-check");
  };

  return (
    <div>
      <PageHeader title="Notices" subtitle="Amit Group of Schools | School-wide announcements" />

      <div className="toolbar-row">
        <div />
        <button className="btn btn-dark" onClick={() => setModalOpen(true)}>
          <i className="bi bi-plus-lg"></i> Create Notice
        </button>
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead><tr><th>Title</th><th>Audience</th><th>Date</th></tr></thead>
          <tbody>
            {list.map((n) => (
              <tr key={n.id}><td>{n.title}</td><td>{n.audience}</td><td>{n.date}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h5>Create Notice</h5>
              <button onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <input type="text" className="form-control" placeholder="Notice title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <select className="form-control" value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}>
                <option>All Classes</option>
                <option>Parents</option>
                <option>Teaching Staff</option>
                <option>Teaching Staff</option>
              </select>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={addNotice}>Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
