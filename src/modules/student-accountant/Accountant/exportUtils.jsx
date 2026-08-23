import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Export tabular data to a PDF file.
 * columns: [{ header: "Name", key: "name" }, ...]
 * rows: [{ name: "...", ... }, ...]
 */
export function exportToPDF({ title, columns, rows, filename }) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.setTextColor(77, 0, 17);
  doc.text(title || "Report", 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${new Date().toLocaleString("en-IN")}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => formatCell(row[c.key]))),
    headStyles: { fillColor: [77, 0, 17], textColor: 255, fontSize: 9 },
    styles: { fontSize: 8.5, cellPadding: 4 },
    alternateRowStyles: { fillColor: [249, 248, 254] },
  });

  doc.save(`${filename || "report"}.pdf`);
}

/**
 * Export tabular data to an .xlsx file.
 */
export function exportToExcel({ columns, rows, filename, sheetName = "Sheet1" }) {
  const data = rows.map((row) => {
    const record = {};
    columns.forEach((c) => {
      record[c.header] = formatCell(row[c.key]);
    });
    return record;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename || "report"}.xlsx`);
}

function formatCell(value) {
  if (value === null || value === undefined) return "";
  return value;
}
