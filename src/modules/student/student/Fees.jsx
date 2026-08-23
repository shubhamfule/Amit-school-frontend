import { useState, useRef } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import { BarTrend } from "./TrendChart.jsx";

const TOTAL_FEES = 50000;

const INITIAL_TRANSACTIONS = [
  { date: "15 Apr 2024", desc: "1st Installment", amount: 10000, status: "paid" },
  { date: "15 May 2024", desc: "2nd Installment (Advance)", amount: 10000, status: "paid" },
  { date: "01 Jul 2024", desc: "Library Fine", amount: 1000, status: "paid" },
  { date: "15 Jun 2024", desc: "Full Payment", amount: 20000, status: "paid" }
];

const INITIAL_INSTALLMENTS = [
  { id: "inst-2", name: "2nd Installment", date: "Due 15 Jul 2024", amount: 10000 },
  { id: "inst-3", name: "3rd Installment", date: "Due 15 Oct 2024", amount: 5000 }
];

const PAY_METHODS = [
  { id: "card", label: "Card", icon: "bi-credit-card" },
  { id: "netbanking", label: "Net Banking", icon: "bi-bank" },
  { id: "upi", label: "UPI", icon: "bi-phone" },
  { id: "wallet", label: "Wallet", icon: "bi-wallet2" }
];

const STATUS_ICON = { paid: "bi-check-circle", pending: "bi-hourglass-split", overdue: "bi-exclamation-circle" };

const formatINR = (n) => "₹" + n.toLocaleString("en-IN");

export default function Fees() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [installments, setInstallments] = useState(INITIAL_INSTALLMENTS);
  const [paidAmount, setPaidAmount] = useState(40000);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isPaying, setIsPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const receiptCanvasRef = useRef(null);

  const pendingAmount = Math.max(TOTAL_FEES - paidAmount, 0);
  const paidPct = Math.round((paidAmount / TOTAL_FEES) * 100);
  const pendingPct = 100 - paidPct;

  const downloadTextFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadStatement = () => {
    const lines = [
      "FEE STATEMENT",
      "=============",
      "Class : 6   Roll No : 20",
      `Statement generated: ${new Date().toLocaleDateString()}`,
      "",
      "Summary",
      "-------",
      `Total Fees (2024-25): ${formatINR(TOTAL_FEES)}`,
      `Amount Paid: ${formatINR(paidAmount)} (${paidPct}%)`,
      `Amount Pending: ${formatINR(pendingAmount)} (${pendingPct}%)`,
      "",
      "Fee Breakdown",
      "-------------",
      "Tuition: ₹32,000",
      "Transport: ₹10,000",
      "Library & Exam: ₹8,000",
      "",
      "Upcoming Installments",
      "----------------------",
      ...(installments.length
        ? installments.map((inst) => `${inst.name} - ${formatINR(inst.amount)} (${inst.date})`)
        : ["None — all installments paid."]),
      "",
      "Transaction History",
      "--------------------",
      ...transactions.map(
        (t) => `${t.date} | ${t.desc} | ${formatINR(t.amount)} | ${t.status.toUpperCase()}`
      )
    ];
    downloadTextFile("Fee_Statement.txt", lines.join("\n"));
  };

  const processPayment = (installmentId) => {
    if (isPaying) return;

    const target = installmentId
      ? installments.find((inst) => inst.id === installmentId)
      : installments[0];

    if (!target) {
      setStatusMessage("All fees are already paid. Nothing pending.");
      setTimeout(() => setStatusMessage(""), 4000);
      return;
    }

    setIsPaying(true);
    setStatusMessage(`Processing payment of ${formatINR(target.amount)} via ${PAY_METHODS.find((m) => m.id === selectedMethod)?.label || "Card"}…`);

    // Simulated payment processing (swap this block for a real payment gateway call).
    setTimeout(() => {
      const todayStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      setTransactions((prev) => [
        { date: todayStr, desc: target.name, amount: target.amount, status: "paid" },
        ...prev
      ]);
      setInstallments((prev) => prev.filter((inst) => inst.id !== target.id));
      setPaidAmount((prev) => Math.min(prev + target.amount, TOTAL_FEES));
      setIsPaying(false);
      setStatusMessage(`Payment of ${formatINR(target.amount)} successful. Receipt added to Transaction History.`);
      setTimeout(() => setStatusMessage(""), 5000);
    }, 700);
  };

  const handlePayNow = () => processPayment();

  const handleDownloadReceipt = (transaction, index) => {
    const canvas = receiptCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 500;
    const height = 320;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#4d0011";
    ctx.fillRect(0, 0, width, 70);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("PAYMENT RECEIPT", 24, 42);

    const rows = [
      ["Description", transaction.desc],
      ["Date", transaction.date],
      ["Amount", formatINR(transaction.amount)],
      ["Status", transaction.status.toUpperCase()],
      ["Class", "6"],
      ["Roll No", "20"],
      ["Receipt No", `RCPT-${String(index + 1).padStart(4, "0")}`]
    ];

    let y = 110;
    rows.forEach(([label, value]) => {
      ctx.fillStyle = "#666666";
      ctx.font = "12px Arial";
      ctx.fillText(label.toUpperCase(), 24, y);
      ctx.fillStyle = "#111111";
      ctx.font = "bold 15px Arial";
      ctx.fillText(String(value), 200, y);
      y += 28;
    });

    ctx.strokeStyle = "#eeeeee";
    ctx.beginPath();
    ctx.moveTo(0, height - 36);
    ctx.lineTo(width, height - 36);
    ctx.stroke();
    ctx.fillStyle = "#999999";
    ctx.font = "11px Arial";
    ctx.fillText("This is a system-generated receipt.", 24, height - 14);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Receipt_${transaction.desc.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div>
      <canvas ref={receiptCanvasRef} style={{ display: "none" }} />

      <div className="page-header">
        <div>
          <center><h1 style={{ color: "#4d0011" }}>Fees Payment</h1></center>
          <hr />
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Track and pay your school fees</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleDownloadStatement}>
            <i className="bi bi-download"></i> Download Statement
          </button>
          <button className="btn-primary" onClick={handlePayNow} disabled={isPaying || installments.length === 0}>
            <i className="bi bi-credit-card-fill"></i> {isPaying ? "Processing…" : installments.length === 0 ? "All Paid" : "Pay Now"}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            background: "#fdf2f4",
            border: "1px solid #4d0011",
            color: "#4d0011",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 13
          }}
        >
          <i className="bi bi-info-circle" style={{ marginRight: 6 }}></i>
          {statusMessage}
        </div>
      )}

      <div className="kpi-row">
        <KpiCard icon="bi-wallet2" iconBg="#ede9fe" value={formatINR(TOTAL_FEES)} label="Total Fees (2024-25)" badge="Annual" badgeClass="badge-blue" />
        <KpiCard icon="bi-check2-circle" iconBg="#dcfce7" value={formatINR(paidAmount)} label="Amount Paid" badge={`${paidPct}% Complete`} badgeClass="badge-green" />
        <KpiCard icon="bi-exclamation-circle" iconBg="#fee2e2" value={formatINR(pendingAmount)} label="Amount Pending" badge={`${installments.length} Installment${installments.length === 1 ? "" : "s"} Due`} badgeClass="badge-red" />
        <KpiCard icon="bi-calendar-event" iconBg="#fff8e1" value="15 Jul" label="Next Due Date" badge="5 Days Left" badgeClass="badge-amber" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Fee Breakdown</span>
            <span className="month-badge mb-purple">2024-25</span>
          </div>
          <div className="att-body">
            <Donut values={[32000, 10000, 8000]} colors={["#4d0011", "#FDF5E6", "#F5DEB3"]} centerLabel="₹50k" cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Tuition</span><span className="sval">₹32,000</span></div>
              <div className="row"><span className="slbl">Transport</span><span className="sval">₹10,000</span></div>
              <div className="row"><span className="slbl">Library &amp; Exam</span><span className="sval">₹8,000</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Payment Status</span>
            <span style={{ color: "#4d0011" }}>Overall</span>
          </div>
          <div className="att-body">
            <Donut values={[paidPct, pendingPct]} colors={["#4d0011", "#FAEBD7"]} centerLabel={`${paidPct}%`} />
            <div className="att-stats" style={{ width: "100%" }}>
              <div className="fee-progress-wrap" style={{ width: "100%" }}>
                <div className="fee-progress-label"><span>Paid</span><span>{formatINR(paidAmount)} / {formatINR(TOTAL_FEES)}</span></div>
                <div className="fee-progress-track">
                  <div className="fee-progress-fill" style={{ width: `${paidPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Upcoming Installments</span>
            <span className="month-badge mb-blue">{installments.length} Left</span>
          </div>
          <div>
            {installments.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--text2)", padding: "8px 0" }}>
                No installments pending. You're all caught up!
              </p>
            )}
            {installments.map((inst) => (
              <div className="installment-row" key={inst.id}>
                <div>
                  <div className="installment-name">{inst.name}</div>
                  <div className="installment-date">{inst.date}</div>
                </div>
                <div className="installment-amt">{formatINR(inst.amount)}</div>
                <button
                  className="pay-btn"
                  style={{ marginLeft: 12 }}
                  onClick={() => processPayment(inst.id)}
                  disabled={isPaying}
                >
                  <i className="bi bi-credit-card"></i> Pay
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Payment History</span>
            <button className="filter-btn">This Year <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>Amount Paid (₹)</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend
              labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
              data={[10000, 10000, 10000, 10000, 0, 0]}
              color="#4d0011"
              yFormatter={(val) => "₹" + val / 1000 + "k"}
            />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header"><span className="cal-title">Payment Methods</span></div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            Choose how you'd like to pay your pending fees. Saved methods appear first for faster checkout.
          </p>
          <div className="pay-methods">
            {PAY_METHODS.map((method) => (
              <span
                key={method.id}
                className="pay-method-chip"
                onClick={() => setSelectedMethod(method.id)}
                style={{
                  cursor: "pointer",
                  border: selectedMethod === method.id ? "1.5px solid #4d0011" : "1.5px solid transparent",
                  background: selectedMethod === method.id ? "#fdf2f4" : undefined,
                  fontWeight: selectedMethod === method.id ? 600 : 400
                }}
              >
                <i className={`bi ${method.icon}`}></i> {method.label}
              </span>
            ))}
          </div>
          <button
            className="add-event"
            style={{ marginTop: 16 }}
            onClick={handlePayNow}
            disabled={isPaying || installments.length === 0}
          >
            <i className="bi bi-arrow-right-circle"></i> {isPaying ? "Processing…" : installments.length === 0 ? "All Paid" : "Proceed to Pay"}
          </button>
        </div>
      </div>

      <div className="log-card">
        <div className="chart-header">
          <span className="chart-title">Transaction History</span>
          <button className="filter-btn">All Time <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th>Receipt</th></tr>
          </thead>
          <tbody>
            {transactions.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.desc}</td>
                <td>{formatINR(r.amount)}</td>
                <td>
                  <span className={`status-pill status-${r.status}`}>
                    <i className={`bi ${STATUS_ICON[r.status]}`}></i> {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
                <td>
                  {r.status === "paid"
                    ? <button className="receipt-btn" onClick={() => handleDownloadReceipt(r, i)}><i className="bi bi-download"></i> Receipt</button>
                    : <button className="pay-btn" onClick={handlePayNow}><i className="bi bi-credit-card"></i> Pay Now</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}