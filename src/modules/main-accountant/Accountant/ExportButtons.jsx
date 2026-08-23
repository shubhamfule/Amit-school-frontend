import { exportToPDF, exportToExcel } from "./exportUtils";

export default function ExportButtons({ title, columns, rows, filename }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => exportToPDF({ title, columns, rows, filename })}
        title="Export as PDF"
      >
        <i className="bi bi-file-earmark-pdf"></i> PDF
      </button>
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => exportToExcel({ columns, rows, filename })}
        title="Export as Excel"
      >
        <i className="bi bi-file-earmark-excel"></i> Excel
      </button>
    </div>
  );
}
