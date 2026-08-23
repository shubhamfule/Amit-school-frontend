import * as XLSX from 'xlsx';

/**
 * Exports the given rows to a real .xlsx workbook and triggers a download.
 * @param {string} filename   File name without extension
 * @param {{key: string, label: string}[]} columns
 * @param {object[]} rows
 */
export function exportToExcel(filename, columns, rows) {
  const data = rows.map((row) => {
    const record = {};
    columns.forEach((col) => { record[col.label] = row[col.key] ?? ''; });
    return record;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = columns.map((col) => ({ wch: Math.max(col.label.length + 4, 14) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Opens a clean, print-ready clearance receipt for a single clearance form
 * entry and triggers the browser's print dialog (so it can be saved as PDF).
 * @param {{label: string, value: string}[]} fields
 * @param {string} totalFine
 */
export function printClearanceReceipt(fields, totalFine) {
  const win = window.open('', '_blank', 'width=650,height=820');
  if (!win) return;

  const style = `
    <style>
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; padding: 32px; color: #1a1235; }
      .receipt { max-width: 520px; margin: 0 auto; border: 1px solid rgba(77,0,17,0.18); border-radius: 14px; overflow: hidden; }
      .receipt-head { background: #4d0011; color: #fff; padding: 20px 24px; }
      .receipt-head h1 { margin: 0; font-size: 17px; font-weight: 700; }
      .receipt-head p { margin: 4px 0 0; font-size: 12px; opacity: 0.85; }
      .receipt-body { padding: 20px 24px; }
      .row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px dashed rgba(77,0,17,0.18); font-size: 13px; }
      .row:last-of-type { border-bottom: none; }
      .row .label { color: #5e5a72; }
      .row .value { font-weight: 600; text-align: right; }
      .total-box { margin-top: 16px; background: #fce8f1; border-left: 4px solid #4d0011; border-radius: 6px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
      .total-box .label { font-size: 13px; font-weight: 600; color: #4d0011; }
      .total-box .amount { font-size: 20px; font-weight: 700; color: #4d0011; }
      .meta { font-size: 11px; color: #9a96aa; margin-top: 18px; text-align: center; }
      @media print { body { padding: 0; } .receipt { border: none; } }
    </style>`;

  const rows = fields
    .map((f) => `<div class="row"><span class="label">${f.label}</span><span class="value">${f.value || '—'}</span></div>`)
    .join('');

  win.document.write(`
    <html>
      <head><title>Clearance Receipt</title>${style}</head>
      <body>
        <div class="receipt">
          <div class="receipt-head">
            <h1><i></i>Amit School Library</h1>
            <p>Clearance Receipt</p>
          </div>
          <div class="receipt-body">
            ${rows}
            <div class="total-box">
              <span class="label">Total Fine</span>
              <span class="amount">₹${totalFine}</span>
            </div>
          </div>
        </div>
        <div class="meta">Generated on ${new Date().toLocaleString()}</div>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}
