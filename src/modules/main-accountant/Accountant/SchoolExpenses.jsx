import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import ExportButtons from "./ExportButtons";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../teacher/utils/api";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const categories = ["Utility", "Office", "Transport", "Maintenance"];
const modes = ["Cash", "Bank", "UPI"];
const acceptedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
const acceptAttr = ".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf";

const exportColumns = [
  { header: "Date", key: "date" },
  { header: "Expense", key: "expense" },
  { header: "Category", key: "category" },
  { header: "Amount", key: "amountLabel" },
  { header: "Mode", key: "mode" },
  { header: "Payment Proof", key: "proofLabel" },
  { header: "Status", key: "status" },
];

// paymentProof is stored on the backend as a plain "data:<mime>;base64,..."
// string (see Backend/src/module/Main-accountant.js) — reconstruct the
// {name, type, dataUrl} shape the table/thumbnail rendering below expects.
function proofFromStored(value) {
  if (!value) return null;
  const match = /^data:([^;]+);base64,/.exec(value);
  return { name: "Payment proof", type: match ? match[1] : "application/octet-stream", dataUrl: value };
}

function mapExpense(r) {
  return {
    id: r._id,
    date: r.date ? new Date(r.date).toISOString().slice(0, 10) : "",
    expense: r.expense,
    category: r.category,
    amount: r.amount,
    mode: r.mode,
    paymentProof: proofFromStored(r.paymentProof),
  };
}

export default function SchoolExpenses() {
  const { showToast } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ date: "", expense: "", category: categories[0], amount: "", mode: modes[0] });

  useEffect(() => {
    let cancelled = false;
    apiGet("/expenses")
      .then((res) => {
        if (cancelled) return;
        setRows((res.data ?? []).map(mapExpense));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Payment status is always derived from whether a proof file has been uploaded —
  // it is never set independently, so it can't drift out of sync with the upload.
  const computed = useMemo(
    () => rows.map((r) => ({ ...r, status: r.paymentProof ? "Paid" : "Pending" })),
    [rows]
  );

  const filtered = useMemo(
    () =>
      computed.filter((r) => {
        const matchesSearch = r.expense.toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [computed, search, categoryFilter, statusFilter]
  );

  const exportRows = filtered.map((r) => ({
    ...r,
    amountLabel: inr(r.amount),
    proofLabel: r.paymentProof ? r.paymentProof.name : "Not uploaded",
  }));

  const addExpense = async () => {
    if (!form.date || !form.expense || !form.amount) {
      showToast("Please fill date, expense and amount", "ti-alert-triangle");
      return;
    }
    try {
      const res = await apiPost("/expenses", { ...form, amount: Number(form.amount) });
      setRows((r) => [...r, mapExpense(res.data)]);
      setForm({ date: "", expense: "", category: categories[0], amount: "", mode: modes[0] });
      setModalOpen(false);
      showToast("Expense added", "ti-check");
    } catch (err) {
      showToast(err.message || "Could not add expense", "ti-alert-triangle");
    }
  };

  const removeRow = async (id) => {
    try {
      await apiDelete(`/expenses/${id}`);
      setRows((r) => r.filter((row) => row.id !== id));
      showToast("Expense removed", "ti-trash");
    } catch {
      showToast("Could not remove expense", "ti-alert-triangle");
    }
  };

  const handleFileChange = (id, file) => {
    if (!file) return;
    if (!acceptedFileTypes.includes(file.type)) {
      showToast("Only JPG, PNG, WEBP or PDF files are supported", "ti-alert-triangle");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await apiPatch(`/expenses/${id}`, { paymentProof: reader.result });
        setRows((r) => r.map((row) => (row.id === id ? { ...row, paymentProof: { name: file.name, type: file.type, dataUrl: reader.result } } : row)));
        showToast("Payment proof uploaded — status set to Paid", "ti-check");
      } catch (err) {
        showToast(err.message || "Could not upload payment proof", "ti-alert-triangle");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = async (id) => {
    try {
      await apiPatch(`/expenses/${id}`, { paymentProof: null });
      setRows((r) => r.map((row) => (row.id === id ? { ...row, paymentProof: null } : row)));
      showToast("Payment proof removed — status set to Pending", "ti-trash");
    } catch (err) {
      showToast(err.message || "Could not remove payment proof", "ti-alert-triangle");
    }
  };

  return (
    <div>
      <PageHeader title="School Expenses Management" subtitle="Amit Group of Schools | Operating expenses" />

      <div className="toolbar-row">
        <div className="filters-row" style={{ maxWidth: 640 }}>
          <button className="btn btn-dark" onClick={() => setModalOpen(true)}>
            <i className="bi bi-plus-lg"></i> Add Expense
          </button>
          <input
            type="text"
            className="form-control"
            placeholder="Search expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <ExportButtons title="School Expenses" columns={exportColumns} rows={exportRows} filename="school-expenses" />
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th><th>Expense</th><th>Category</th><th>Amount</th><th>Mode</th>
              <th>Payment Proof</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No expenses found.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.expense}</td>
                <td>{r.category}</td>
                <td>{inr(r.amount)}</td>
                <td>{r.mode}</td>
                <td>
                  <div className="proof-cell">
                    {r.paymentProof ? (
                      <div className="proof-uploaded">
                        {r.paymentProof.type === "application/pdf" ? (
                          <div className="proof-thumb proof-thumb-pdf" title={r.paymentProof.name}>
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                          </div>
                        ) : (
                          <img
                            src={r.paymentProof.dataUrl}
                            alt={r.paymentProof.name}
                            className="proof-thumb proof-thumb-img"
                            title={r.paymentProof.name}
                          />
                        )}
                        <div className="proof-meta">
                          <span className="proof-filename" title={r.paymentProof.name}>{r.paymentProof.name}</span>
                          <button type="button" className="proof-remove-btn" onClick={() => removeFile(r.id)}>
                            <i className="bi bi-x-circle"></i> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="proof-upload-btn">
                        <i className="bi bi-cloud-arrow-up"></i> Upload
                        <input
                          type="file"
                          accept={acceptAttr}
                          onChange={(e) => {
                            handleFileChange(r.id, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                </td>
                <td>
                  <span className={r.status === "Paid" ? "badge-paid" : "badge-pending"}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => removeRow(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h5>Add Expense</h5>
              <button onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <input type="date" className="form-control" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              <input type="text" className="form-control" placeholder="Expense Name" value={form.expense} onChange={(e) => setForm((f) => ({ ...f, expense: e.target.value }))} />
              <select className="form-control" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" className="form-control" placeholder="Amount" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
              <select className="form-control" value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}>
                {modes.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={addExpense}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
