import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import { apiGet, apiPost } from "../../teacher/utils/api";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

export default function Notices() {
  const { showToast } = useOutletContext();
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", audience: "All Classes" });

  useEffect(() => {
    let cancelled = false;
    apiGet("/notices")
      .then((res) => {
        if (cancelled) return;
        setList((res.data ?? []).map((n) => ({ id: n._id, title: n.title, audience: n.audience, date: formatDate(n.date) })));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const addNotice = async () => {
    if (!form.title.trim()) {
      showToast("Please enter a notice title", "ti-alert-triangle");
      return;
    }
    try {
      const res = await apiPost("/notices", { title: form.title, audience: form.audience });
      setList((l) => [{ id: res.data._id, title: res.data.title, audience: res.data.audience, date: formatDate(res.data.date) }, ...l]);
      setForm({ title: "", audience: "All Classes" });
      setModalOpen(false);
      showToast("Notice published", "ti-check");
    } catch (err) {
      showToast(err.message || "Could not publish notice", "ti-alert-triangle");
    }
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
                <option>Non-Teaching Staff</option>
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
