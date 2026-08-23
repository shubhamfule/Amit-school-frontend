import { useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import { BarTrend } from "./TrendChart.jsx";

const FATHER_ROWS = [
  ["Name", "Rajesh Kumar"],
  ["Occupation", "Businessman"],
  ["Qualification", "MBA"],
  ["Phone", "9876543210"],
  ["Email", "rajesh@gmail.com"]
];

const MOTHER_ROWS = [
  ["Name", "Sunita Devi"],
  ["Occupation", "Teacher"],
  ["Qualification", "M.A."],
  ["Phone", "9876548888"],
  ["Email", "sunita@gmail.com"]
];

const DETAIL_ROWS = [
  // { section: "Address", field: "House No.", value: "12" },
  // { section: "Address", field: "Street", value: "Main Road" },
  // { section: "Address", field: "City", value: "Delhi" },
  // { section: "Address", field: "PIN Code", value: "110001" },
  // { section: "Emergency", field: "Primary Contact", value: "9876543210" },
  // { section: "Emergency", field: "Secondary Contact", value: "9876548888" },
  // { section: "Emergency", field: "Guardian", value: "Suresh Kumar" },
  // { section: "Emergency", field: "Guardian Phone", value: "9876500000" }
];

const VERIFICATION_ROWS = [
  ["Documents Verified", "Yes"],
  ["KYC Complete", "Yes"],
  ["Last Updated", "12 Jun 2024"]
];

export default function ParentInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [fatherRows, setFatherRows] = useState(FATHER_ROWS);
  const [motherRows, setMotherRows] = useState(MOTHER_ROWS);
  const [verificationRows, setVerificationRows] = useState(VERIFICATION_ROWS);

  // Draft copies edited while in edit mode; only committed to real state on Save
  const [draftFather, setDraftFather] = useState(FATHER_ROWS);
  const [draftMother, setDraftMother] = useState(MOTHER_ROWS);
  const [draftVerification, setDraftVerification] = useState(VERIFICATION_ROWS);

  const getValue = (rows, label) => {
    const row = rows.find(([l]) => l === label);
    return row ? row[1] : "";
  };

  const handleEditClick = () => {
    if (!isEditing) {
      setDraftFather(fatherRows);
      setDraftMother(motherRows);
      setDraftVerification(verificationRows);
      setIsEditing(true);
    } else {
      setFatherRows(draftFather);
      setMotherRows(draftMother);
      setVerificationRows(draftVerification);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const updateDraftValue = (setter, rows, label, newValue) => {
    setter(rows.map(([l, v]) => (l === label ? [l, newValue] : [l, v])));
  };

  const handleDownloadDetails = () => {
    setIsDownloading(true);

    const formatSection = (title, rows) =>
      `${title}\n${"-".repeat(title.length)}\n` +
      rows.map(([label, value]) => `${label}: ${value}`).join("\n");

    const lines = [
      "PARENT & GUARDIAN DETAILS",
      "=========================",
      "Class : 6   Roll No : 20",
      "",
      formatSection("Father Details", fatherRows),
      "",
      formatSection("Mother Details", motherRows),
      "",
      formatSection("Verification & Contacts", verificationRows),
      "",
      "Fee Status",
      "----------",
      "Paid: ₹40,000",
      "Pending: ₹10,000",
      "",
      `Generated on: ${new Date().toLocaleDateString()}`
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = (getValue(fatherRows, "Name") || "parent").replace(/\s+/g, "_");
    link.download = `${safeName}_Parent_Details.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Parents Info</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Parent details, contacts and verification</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleDownloadDetails} disabled={isDownloading}>
            <i className="bi bi-download"></i> {isDownloading ? "Preparing…" : "Download Details"}
          </button>
          {isEditing && (
            <button className="btn-outline" onClick={handleCancelEdit}>
              <i className="bi bi-x-circle"></i> Cancel
            </button>
          )}
          <button className="btn-primary" onClick={handleEditClick}>
            <i className={isEditing ? "bi bi-check2-circle" : "bi bi-pencil-square"}></i> {isEditing ? "Save Info" : "Edit Info"}
          </button>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCard icon="bi-people-fill" iconBg="#ede9fe" value="2" label="Total Parents" badge="Both Active" badgeClass="badge-blue" />
        <KpiCard icon="bi-telephone-fill" iconBg="#fff8e1" value="3" label="Emergency Contacts" badge="Up to date" badgeClass="badge-amber" />
        <KpiCard icon="bi-wallet2" iconBg="#dcfce7" value="Paid" label="Fee Status" badge={<><i className="bi bi-check-circle"></i> On Time</>} badgeClass="badge-green" />
        <KpiCard icon="bi-patch-check-fill" iconBg="#e8f4fd" value="Done" label="Verification" badge="Verified" badgeClass="badge-blue" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title"><i className="bi bi-person-fill" style={{ color: "#4d0011" }}></i> Father Details</span>
            <span className="month-badge mb-purple">Primary</span>
          </div>
          <div style={{ marginTop: 6 }}>
            {(isEditing ? draftFather : fatherRows).map(([label, value]) => (
              <div className="row" key={label}>
                <span className="slbl">{label}</span>
                {isEditing ? (
                  <input
                    className="sval"
                    style={{ textAlign: "right", border: "1px solid #ddd", borderRadius: 4, padding: "2px 6px", width: "55%" }}
                    value={value}
                    onChange={(e) => updateDraftValue(setDraftFather, draftFather, label, e.target.value)}
                  />
                ) : (
                  <span className="sval">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title"><i className="bi bi-person-heart" style={{ color: "#4d0011" }}></i> Mother Details</span>
            <span className="month-badge mb-pink">Secondary</span>
          </div>
          <div style={{ marginTop: 6 }}>
            {(isEditing ? draftMother : motherRows).map(([label, value]) => (
              <div className="row" key={label}>
                <span className="slbl">{label}</span>
                {isEditing ? (
                  <input
                    className="sval"
                    style={{ textAlign: "right", border: "1px solid #ddd", borderRadius: 4, padding: "2px 6px", width: "55%" }}
                    value={value}
                    onChange={(e) => updateDraftValue(setDraftMother, draftMother, label, e.target.value)}
                  />
                ) : (
                  <span className="sval">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Fee Status</span>
            <span className="month-badge mb-blue">2024-25</span>
          </div>
          <div className="att-body">
            <Donut values={[90, 10]} colors={["#4d0011", "wheat"]} centerLabel="90%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Paid</span><span className="sval">₹40,000</span></div>
              <div className="row"><span className="slbl">Pending</span><span className="sval">₹10,000</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Parent Meetings</span>
            <button className="filter-btn">This Year <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>Meetings Attended</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend labels={["Term-1", "Term-2", "Annual"]} data={[4, 5, 6]} color="#4d0011" />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header"><span className="cal-title">Verification &amp; Contacts</span></div>
          <div style={{ marginTop: 6 }}>
            {(isEditing ? draftVerification : verificationRows).map(([label, value]) => (
              <div className="row" key={label}>
                <span className="slbl">{label}</span>
                {isEditing ? (
                  <input
                    className="sval"
                    style={{ textAlign: "right", border: "1px solid #ddd", borderRadius: 4, padding: "2px 6px", width: "55%" }}
                    value={value}
                    onChange={(e) => updateDraftValue(setDraftVerification, draftVerification, label, e.target.value)}
                  />
                ) : (
                  <span className="sval">{value}</span>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginTop: 14 }}>
            Quick-dial numbers for the school office in case of an emergency.
          </p>
          <div className="pay-methods">
            <span className="pay-method-chip"><i className="bi bi-telephone-fill"></i> Primary</span>
            <span className="pay-method-chip"><i className="bi bi-telephone-fill"></i> Secondary</span>
            <span className="pay-method-chip"><i className="bi bi-person-fill"></i> Guardian</span>
          </div>
        </div>
      </div>

      {/* <div className="log-card"> */}
        <div>
          {/* <span className="chart-title">Address &amp; Emergency Details</span> */}
        </div>
        <table>
          <thead>
            {/* <tr><th>Section</th><th>Field</th><th>Detail</th></tr> */}
          </thead>
          <tbody>
            {DETAIL_ROWS.map((r, i) => (
              <tr key={i}>
                <td>{r.section}</td>
                <td>{r.field}</td>
                <td>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}