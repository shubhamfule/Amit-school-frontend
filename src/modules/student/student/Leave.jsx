import { useState } from "react";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Student", "Leave", "Parent", "Confirm"];

export default function Leave() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [appCode, setAppCode] = useState("");
  const [form, setForm] = useState({
    name: "", grade: "", roll: "", gender: "",
    leaveType: "", fromDate: "", toDate: "", reason: "",
    parentName: "", contact: "", address: "",
    confirm: false
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function next() {
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function submit() {
    const prefix = "SLAP";
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    const code = `${prefix}-${year}-${random}`;
    localStorage.setItem("leaveApplicationCode", code);
    setAppCode(code);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Leave Application</h1>
            <hr/>
            <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Application submitted successfully</p><hr/>
          </div>
        </div>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", padding: "8px 4px" }}>
              <div style={styles.successIcon}><i className="bi bi-check-circle-fill"></i></div>
              <h3 style={{ margin: "10px 0 4px", fontSize: 17, color: "#1f2430" }}>Leave Application Submitted</h3>
              <p style={{ fontSize: 12.5, color: "#8892a0", margin: "0 0 14px" }}>Your Application Code</p>
              <div style={styles.codeBox}>{appCode}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Leave Application</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Apply for leave in a few quick steps</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.stepHeader}>
            <div style={styles.stepDots}>
              {STEP_LABELS.map((label, i) => (
                <div key={label} style={styles.stepDotWrap}>
                  <div style={{ ...styles.stepDot, ...(i <= step ? styles.stepDotActive : {}) }}>
                    {i < step ? <i className="bi bi-check-lg" style={{ fontSize: 11 }}></i> : i + 1}
                  </div>
                  <span style={{ ...styles.stepDotLabel, ...(i === step ? { color: "#4d0011", fontWeight: 700 } : {}) }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formBox}>
            {step === 0 && (
              <>
                <input style={styles.input} type="text" placeholder="Student Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                <div style={styles.row2}>
                  <input style={styles.input} type="text" placeholder="Class / Grade" value={form.grade} onChange={(e) => update("grade", e.target.value)} />
                  <input style={styles.input} type="text" placeholder="Roll Number" value={form.roll} onChange={(e) => update("roll", e.target.value)} />
                </div>
                <select style={styles.input} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </>
            )}

            {step === 1 && (
              <>
                <select style={styles.input} value={form.leaveType} onChange={(e) => update("leaveType", e.target.value)}>
                  <option value="">Leave Type</option>
                  <option>Medical Leave</option>
                  <option>Personal Leave</option>
                  <option>Family Function</option>
                  <option>Emergency</option>
                  <option>Other</option>
                </select>
                <div style={styles.row2}>
                  <input style={styles.input} type="date" value={form.fromDate} onChange={(e) => update("fromDate", e.target.value)} />
                  <input style={styles.input} type="date" value={form.toDate} onChange={(e) => update("toDate", e.target.value)} />
                </div>
                <textarea style={{ ...styles.input, height: 68, resize: "none" }} placeholder="Reason for Leave" value={form.reason} onChange={(e) => update("reason", e.target.value)} />
              </>
            )}

            {step === 2 && (
              <>
                <input style={styles.input} type="text" placeholder="Parent / Guardian Name" value={form.parentName} onChange={(e) => update("parentName", e.target.value)} />
                <input style={styles.input} type="tel" placeholder="Contact Number" value={form.contact} onChange={(e) => update("contact", e.target.value)} />
                <textarea style={{ ...styles.input, height: 68, resize: "none" }} placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </>
            )}

            {step === 3 && (
              <>
                <div style={styles.reviewBox}>
                  <div style={styles.reviewRow}><span>Student</span><strong>{form.name || "—"}</strong></div>
                  <div style={styles.reviewRow}><span>Class / Roll</span><strong>{form.grade || "—"} / {form.roll || "—"}</strong></div>
                  <div style={styles.reviewRow}><span>Leave Type</span><strong>{form.leaveType || "—"}</strong></div>
                  <div style={styles.reviewRow}><span>Dates</span><strong>{form.fromDate || "—"} to {form.toDate || "—"}</strong></div>
                  <div style={styles.reviewRow}><span>Parent</span><strong>{form.parentName || "—"}</strong></div>
                </div>
                <label style={styles.confirmRow}>
                  <input type="checkbox" checked={form.confirm} onChange={(e) => update("confirm", e.target.checked)} style={{ width: "auto" }} />
                  I confirm that the above information is correct
                </label>
              </>
            )}

            <div style={styles.actions}>
              {step > 0 ? <button style={styles.btnGhost} onClick={back}>Back</button> : <span />}
              {step < TOTAL_STEPS - 1 ? (
                <button style={styles.btn} onClick={next}>Next</button>
              ) : (
                <button
                  style={styles.btn}
                  onClick={() => {
                    if (!form.confirm) {
                      alert("Please confirm the declaration before submitting.");
                      return;
                    }
                    submit();
                  }}
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MAROON = "#4d0011";

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "4px 0 8px" },
  card: {
    width: 420, maxWidth: "100%", background: "#fff", borderRadius: 16,
    boxShadow: "0 8px 24px rgba(17,24,39,.06)", overflow: "hidden"
  },
  stepHeader: { padding: "16px 20px 12px", borderBottom: "1px solid #f1f2f6" },
  stepDots: { display: "flex", justifyContent: "space-between" },
  stepDotWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 },
  stepDot: {
    width: 24, height: 24, borderRadius: "50%", background: "#f1f2f6", color: "#9aa1ac",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 700
  },
  stepDotActive: { background: MAROON, color: "#fff" },
  stepDotLabel: { fontSize: 10.5, color: "#9aa1ac" },
  formBox: { padding: "18px 20px 20px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  input: {
    width: "100%", padding: "9px 11px", margin: "0 0 10px", border: "1px solid #e4e6ec",
    borderRadius: 9, display: "block", fontSize: 13.5, boxSizing: "border-box", color: "#1f2430"
  },
  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  btn: {
    background: MAROON, color: "#fff", padding: "9px 18px", border: "none", borderRadius: 9,
    cursor: "pointer", fontSize: 13.5, fontWeight: 600
  },
  btnGhost: {
    background: "#fff", color: MAROON, padding: "9px 16px", border: `1px solid ${MAROON}`,
    borderRadius: 9, cursor: "pointer", fontSize: 13.5, fontWeight: 600
  },
  confirmRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#5b6270", margin: "2px 0 14px" },
  reviewBox: { background: "#f8f5f6", borderRadius: 10, padding: "10px 14px", marginBottom: 14 },
  reviewRow: {
    display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#5b6270",
    padding: "6px 0", borderBottom: "1px solid #eee"
  },
  successIcon: { fontSize: 34, color: "#16a34a" },
  codeBox: {
    display: "inline-block", background: "#f8f5f6", color: MAROON, fontWeight: 800,
    fontSize: 18, letterSpacing: 1, padding: "8px 18px", borderRadius: 9
  }
};