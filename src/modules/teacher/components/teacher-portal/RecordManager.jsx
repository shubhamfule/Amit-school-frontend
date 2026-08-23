import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../PageHeader";
import ExportButtons from "../ExportButtons";
import { apiGet, apiPost, apiDelete } from "../../utils/api";

/**
 * columns: [{ header, key, badge?: { field values -> className } }]
 * formFields: [{ key, label, type: 'text'|'date'|'number'|'select'|'textarea', options?, required? }]
 * rows: initial seed records (must each include an 'id')
 * searchKey: which field the search box filters on
 * filterField: optional { key, options } for a dropdown filter (e.g. status)
 * apiEndpoint: optional API endpoint (e.g. "/students") for real data
 */
export default function RecordManager({
  title,
  subtitle,
  icon,
  columns,
  rows: initialRows,
  formFields,
  searchKey,
  filterField,
  addButtonLabel = "Add Record",
  actionsRightOfAdd = null,
  onFormFieldChange = null,
  makeDefaults = () => ({}),
  transform = (row) => row,
  exportFilename = "records",
  apiEndpoint = null,
  mapResponseToRows = (data) => data.data || data,
}) {
  const { showToast } = useOutletContext();
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(() => Object.fromEntries(formFields.map((f) => [f.key, ""])));
  const [loading, setLoading] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    if (apiEndpoint) {
      setLoading(true);
      apiGet(apiEndpoint)
        .then((response) => {
          const apiRows = mapResponseToRows(response);
          const mappedRows = apiRows.map((row) => ({
            ...row,
            id: row._id || row.id,
          }));
          setRows(mappedRows);
        })
        .catch((error) => {
          console.error(`Failed to load data from ${apiEndpoint}:`, error);
          showToast(`Failed to load records: ${error.message}`, "ti-alert-triangle");
        })
        .finally(() => setLoading(false));
    }
  }, [apiEndpoint, mapResponseToRows, showToast]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch = !searchKey || String(r[searchKey] || "").toLowerCase().includes(search.trim().toLowerCase());
      const matchesFilter = !filterField || filterValue === "all" || r[filterField.key] === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filterValue]);

  const setField = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: value };
      if (!onFormFieldChange) return next;
      const patch = onFormFieldChange({ key: k, value, form: next });
      return patch && typeof patch === "object" ? { ...next, ...patch } : next;
    });
  };

  const submit = async () => {
    const missing = formFields.find((f) => f.required && !String(form[f.key] || "").trim());
    if (missing) {
      showToast(`Please fill "${missing.label}"`, "ti-alert-triangle");
      return;
    }

    try {
      if (apiEndpoint) {
        // Make API call
        const newRecord = await apiPost(apiEndpoint, form);
        const mapped = { ...newRecord, id: newRecord._id || newRecord.id };
        setRows((r) => [transform(mapped), ...r]);
      } else {
        // Use local state
        setRows((r) => [transform({ id: Date.now(), ...makeDefaults(), ...form }), ...r]);
      }
      setForm(Object.fromEntries(formFields.map((f) => [f.key, ""])));
      setModalOpen(false);
      showToast("Record saved", "ti-check");
    } catch (error) {
      console.error("Failed to save record:", error);
      showToast(`Failed to save record: ${error.message}`, "ti-alert-triangle");
    }
  };

  const removeRow = async (id) => {
    try {
      if (apiEndpoint) {
        // Make API call
        await apiDelete(`${apiEndpoint}/${id}`);
      }
      setRows((r) => r.filter((row) => row.id !== id));
      showToast("Record removed", "ti-trash");
    } catch (error) {
      console.error("Failed to delete record:", error);
      showToast(`Failed to delete record: ${error.message}`, "ti-alert-triangle");
    }
  };

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="toolbar-row">
        <div className="filters-row" style={{ maxWidth: 640 }}>
          <button className="btn btn-dark" onClick={() => setModalOpen(true)}>
            <i className={icon || "bi bi-plus-lg"}></i> {addButtonLabel}
          </button>
          {actionsRightOfAdd}
          {searchKey && (
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {filterField && (
            <select className="form-control" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
              <option value="all">All {filterField.label}</option>
              {filterField.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
        </div>
        <ExportButtons title={title} columns={columns} rows={filtered} filename={exportFilename} />
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>{columns.map((c) => <th key={c.key}>{c.header}</th>)}<th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No records found.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.badge ? (
                      <span className={`status-badge ${c.badge[r[c.key]] || "active"}`}>{r[c.key]}</span>
                    ) : (
                      r[c.key]
                    )}
                  </td>
                ))}
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
              <h5>{addButtonLabel}</h5>
              <button onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {formFields.map((f) => (
                <div key={f.key}>
                  {f.type === "select" ? (
                    <select className="form-control" value={form[f.key]} onChange={setField(f.key)}>
                      <option value="">{f.label}</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea className="form-control" placeholder={f.label} value={form[f.key]} onChange={setField(f.key)} readOnly={Boolean(f.readOnly)} />
                  ) : (
                    <input
                      type={f.type || "text"}
                      className="form-control"
                      placeholder={f.label}
                      value={form[f.key]}
                      onChange={setField(f.key)}
                      readOnly={Boolean(f.readOnly)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={submit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
