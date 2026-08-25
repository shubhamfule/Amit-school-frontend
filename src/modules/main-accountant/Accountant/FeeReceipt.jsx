import { useState } from "react";

const items = [
  { type: "Admission Registration Fee", desc: "One-time processing fee for new applicants", amount: 1500 },
  { type: "Prospectus & Allotment Kit", desc: "Includes official syllabus manual and digital portal access key", amount: 500 },
  { type: "Caution Money (Refundable)", desc: "Security deposit refundable upon school exit", amount: 2000 },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}.00`;

export default function FeeReceipt({ studentName, onBack, onPaid, paying = false }) {
  const [method, setMethod] = useState("Online Payment");
  const [agree, setAgree] = useState(false);
  const [paid, setPaid] = useState(false);
  const total = items.reduce((s, i) => s + i.amount, 0);

  if (paid) {
    return (
      <div className="invoice-wrap">
        <div className="invoice-card" style={{ textAlign: "center" }}>
          <i className="bi bi-check-circle" style={{ fontSize: 46, color: "var(--green)" }}></i>
          <h2 style={{ color: "var(--purple)", marginTop: 12 }}>Payment received</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            {inr(total)} received from {studentName} via {method}. A confirmation has been sent to the registered mobile number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-wrap">
      <div className="invoice-card">
        <div className="invoice-header">
          <div className="invoice-meta">
            <h2>ADMISSION FEE DUE</h2>
            <p>Session: 2026 - 2027 &nbsp;·&nbsp; Applicant: {studentName}</p>
          </div>
        </div>

        <table className="statement-table">
          <thead>
            <tr><th>Fee Particulars</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.type}>
                <td>
                  <span className="fee-type">{it.type}</span>
                  <span className="fee-desc">{it.desc}</span>
                </td>
                <td>{inr(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="payment-method-section">
          <h3>Select Payment Method</h3>
          <div className="payment-options">
            <label className="option-group">
              <input type="radio" name="pm" checked={method === "Online Payment"} onChange={() => setMethod("Online Payment")} />
              Online Payment
            </label>
            <label className="option-group">
              <input type="radio" name="pm" checked={method === "Cash"} onChange={() => setMethod("Cash")} />
              Cash
            </label>
          </div>
        </div>

        <div className="summary-panel">
          <div className="summary-box">
            <div className="summary-row"><span>Subtotal:</span><span>{inr(total)}</span></div>
            <div className="summary-row grand-total"><span>Total Payable Now:</span><span>{inr(total)}</span></div>
          </div>
        </div>

        <div className="declaration">
          <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <label htmlFor="agree">
            I hereby verify the admission details above. I understand that registration fees are non-refundable and agree to complete the initial processing step.
          </label>
        </div>

        <div className="action-bar">
          <button className="btn btn-secondary" onClick={onBack}>Back to Documents</button>
          <button
            className="btn btn-primary"
            disabled={!agree || paying}
            onClick={async () => {
              const ok = onPaid ? await onPaid() : true;
              if (ok) setPaid(true);
            }}
          >
            {paying ? "Processing…" : method === "Cash" ? "Confirm Cash Receipt" : "Proceed to Secure Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
