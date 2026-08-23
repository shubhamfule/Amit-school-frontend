import { useState, useRef } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import { BarTrend } from "./TrendChart.jsx";

const PERSONAL_ROWS = [
  ["Full Name", "Amit Kumar"],
  ["Roll Number", "15"],
  ["Admission Number", "ADM1025"],
  ["Date of Birth", "12 May 2010"],
  ["Gender", "Male"],
  ["Blood Group", "O+"]
];

const PARENT_ROWS = [
  ["Father Name", "Rajesh Kumar"],
  ["Mother Name", "Sunita Devi"],
  ["Parent Contact", "9876543210"]
];

const CONTACT_ACADEMIC_ROWS = [
  ["Email", "student@gmail.com"],
  ["Address", "House No. 12, Main Road, Delhi"],
  ["Class Teacher", "Mrs. Sharma"],
  ["Teacher Contact", "9876541230"],
  ["Academic Year", "2025-26"],
  ["Subjects", "English, Maths, Science, SST"]
];

const FULL_PROFILE_ROWS = [
  { section: "1", field: "Full Name", value: "Amit Kumar" },
  { section: "2", field: "Roll Number", value: "15" },
  { section: "3", field: "Admission Number", value: "ADM1025" },
  { section: "4", field: "Date of Birth", value: "12 May 2010" },
  { section: "5", field: "Gender", value: "Male" },
  { section: "6", field: "Blood Group", value: "O+" },
  { section: "7", field: "Caste", value: "OBC" },
  { section: "Parent", field: "Father Name", value: "Rajesh Kumar" },
  { section: "Parent", field: "Mother Name", value: "Sunita Devi" },
  { section: "Parent", field: "Parent Contact", value: "9876543210" },
  { section: "Contact", field: "Email", value: "student@gmail.com" },
  { section: "Contact", field: "Home Address", value: "House No. 12, Main Road, Delhi" },
  { section: "Academic", field: "Class Teacher", value: "Mrs. Sharma" },
  { section: "Academic", field: "Teacher Contact", value: "9876541230" },
  { section: "Academic", field: "Academic Year", value: "2025-26" },
  { section: "Academic", field: "Subjects", value: "English, Maths, Science, SST" }
];

export default function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const [personalRows, setPersonalRows] = useState(PERSONAL_ROWS);
  const [parentRows, setParentRows] = useState(PARENT_ROWS);
  const [contactRows, setContactRows] = useState(CONTACT_ACADEMIC_ROWS);

  // Draft copies edited while in edit mode; only committed to real state on Save
  const [draftPersonal, setDraftPersonal] = useState(PERSONAL_ROWS);
  const [draftParent, setDraftParent] = useState(PARENT_ROWS);
  const [draftContact, setDraftContact] = useState(CONTACT_ACADEMIC_ROWS);

  const getValue = (rows, label) => {
    const row = rows.find(([l]) => l === label);
    return row ? row[1] : "";
  };

  const handleEditClick = () => {
    if (!isEditing) {
      // Entering edit mode: seed drafts from current committed values
      setDraftPersonal(personalRows);
      setDraftParent(parentRows);
      setDraftContact(contactRows);
      setIsEditing(true);
    } else {
      // Saving: commit drafts
      setPersonalRows(draftPersonal);
      setParentRows(draftParent);
      setContactRows(draftContact);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const updateDraftValue = (setter, rows, label, newValue) => {
    setter(rows.map(([l, v]) => (l === label ? [l, newValue] : [l, v])));
  };

  const handleDownloadIdCard = () => {
    setIsDownloading(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 640;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Card background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Header band
    ctx.fillStyle = "#4d0011";
    ctx.fillRect(0, 0, width, 90);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText("STUDENT ID CARD", 24, 40);
    ctx.font = "13px Arial";
    ctx.fillText("Academic Year " + getValue(contactRows, "Academic Year"), 24, 64);

    // Photo placeholder
    ctx.strokeStyle = "#4d0011";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 114, 120, 140);
    ctx.fillStyle = "#f0f0f8";
    ctx.fillRect(26, 116, 116, 136);
    ctx.fillStyle = "#4d0011";
    ctx.font = "12px Arial";
    ctx.fillText("PHOTO", 55, 190);

    // Details
    const details = [
      ["Name", getValue(personalRows, "Full Name")],
      ["Class", "10-A"],
      ["Roll No", getValue(personalRows, "Roll Number")],
      ["Admission No", getValue(personalRows, "Admission Number")],
      ["Date of Birth", getValue(personalRows, "Date of Birth")],
      ["Blood Group", getValue(personalRows, "Blood Group")],
      ["Parent Contact", getValue(parentRows, "Parent Contact")]
    ];

    let y = 130;
    ctx.textBaseline = "alphabetic";
    details.forEach(([label, value]) => {
      ctx.fillStyle = "#666666";
      ctx.font = "12px Arial";
      ctx.fillText(label.toUpperCase(), 168, y);
      ctx.fillStyle = "#111111";
      ctx.font = "bold 15px Arial";
      ctx.fillText(String(value || "-"), 168, y + 18);
      y += 40;
    });

    ctx.strokeStyle = "#eeeeee";
    ctx.beginPath();
    ctx.moveTo(0, height - 40);
    ctx.lineTo(width, height - 40);
    ctx.stroke();
    ctx.fillStyle = "#999999";
    ctx.font = "11px Arial";
    ctx.fillText("This card is property of the school. If found, please return.", 24, height - 16);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const safeName = (getValue(personalRows, "Full Name") || "student").replace(/\s+/g, "_");
    link.download = `${safeName}_ID_Card.png`;
    link.href = dataUrl;
    link.click();
    setIsDownloading(false);
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="page-header">
        <div>
          <h1>Student Profile</h1>
          <hr/>
          <p>Admission No : ADM1025 &nbsp; · &nbsp; Class : 10-A &nbsp; · &nbsp; Roll No : 15</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleDownloadIdCard} disabled={isDownloading}>
            <i className="bi bi-download"></i> {isDownloading ? "Preparing…" : "Download ID Card"}
          </button>
          {isEditing && (
            <button className="btn-outline" onClick={handleCancelEdit}>
              <i className="bi bi-x-circle"></i> Cancel
            </button>
          )}
          <button className="btn-primary" onClick={handleEditClick}>
            <i className={isEditing ? "bi bi-check2-circle" : "bi bi-pencil-square"}></i> {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCard icon="bi-mortarboard-fill" iconBg="#ede9fe" value="10-A" label="Class" badge="Section A" badgeClass="badge-blue" />
        <KpiCard icon="bi-calendar-check" iconBg="#dcfce7" value="92%" label="Attendance" badge={<><i className="bi bi-check-circle"></i> Excellent</>} badgeClass="badge-green" />
        <KpiCard icon="bi-heart-pulse-fill" iconBg="#fee2e2" value="O+" label="Blood Group" badge="Health Record" badgeClass="badge-red" />
        <KpiCard icon="bi-patch-check-fill" iconBg="#e8f4fd" value="Active" label="Status" badge="Verified" badgeClass="badge-blue" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title"><i className="bi bi-person-fill" style={{ color: "#4d0011" }}></i> Personal Info</span>
            <span className="month-badge mb-purple">Student</span>
          </div>
          <div style={{ marginTop: 6 }}>
            {(isEditing ? draftPersonal : personalRows).map(([label, value]) => (
              <div className="row" key={label}>
                <span className="slbl">{label}</span>
                {isEditing ? (
                  <input
                    className="sval"
                    style={{ textAlign: "right", border: "1px solid #ddd", borderRadius: 4, padding: "2px 6px", width: "55%" }}
                    value={value}
                    onChange={(e) => updateDraftValue(setDraftPersonal, draftPersonal, label, e.target.value)}
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
            <span className="att-title"><i className="bi bi-people-fill" style={{ color: "#4d0011" }}></i> Parent Info</span>
            <span className="month-badge mb-pink">Guardians</span>
          </div>
          <div style={{ marginTop: 6 }}>
            {(isEditing ? draftParent : parentRows).map(([label, value]) => (
              <div className="row" key={label}>
                <span className="slbl">{label}</span>
                {isEditing ? (
                  <input
                    className="sval"
                    style={{ textAlign: "right", border: "1px solid #ddd", borderRadius: 4, padding: "2px 6px", width: "55%" }}
                    value={value}
                    onChange={(e) => updateDraftValue(setDraftParent, draftParent, label, e.target.value)}
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
            <span className="att-title">My Attendance</span>
            <span className="month-badge mb-blue">This Month</span>
          </div>
          <div className="att-body">
            <Donut values={[92, 8]} colors={["#4d0011", "#f0f0f8"]} centerLabel="92%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Present</span><span className="sval">22 Days</span></div>
              <div className="row"><span className="slbl">Absent</span><span className="sval">2 Days</span></div>
              <div className="row"><span className="slbl">Leave</span><span className="sval">1 Days</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Subject-wise Marks</span>
            <button className="filter-btn">This Term <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>Marks Obtained</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend
              labels={["Math", "Science", "English", "Computer", "History", "Geography"]}
              data={[92, 88, 95, 90, 84, 89]}
              color="#4d0011"
              max={100}
            />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header"><span className="cal-title">Contact &amp; Academic</span></div>
          <div style={{ marginTop: 6 }}>
            {(isEditing ? draftContact : contactRows).map(([label, value]) => (
              <div className="row" key={label}>
                <span className="slbl">{label}</span>
                {isEditing ? (
                  <input
                    className="sval"
                    style={{ textAlign: "right", border: "1px solid #ddd", borderRadius: 4, padding: "2px 6px", width: "55%" }}
                    value={value}
                    onChange={(e) => updateDraftValue(setDraftContact, draftContact, label, e.target.value)}
                  />
                ) : (
                  <span className="sval">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="log-card profile-details-card">
        <div className="chart-header">
          <span className="chart-title">Full Profile Details</span>
        </div>
        <div className="profile-details-grid">
          {FULL_PROFILE_ROWS.map((r, i) => {
            const liveRows =
              r.section === "Personal" ? personalRows :
              r.section === "Parent" ? parentRows :
              (r.field === "Home Address" || r.field === "Email") ? contactRows.map(([l, v]) => (l === "Address" ? ["Home Address", v] : [l, v])) :
              contactRows;
            const liveValue = getValue(liveRows, r.field) || r.value;
            return (
              <div className="profile-detail-item" key={i}>
                <span className="profile-detail-section">{r.section}</span>
                <span className="profile-detail-field">{r.field}</span>
                <strong className="profile-detail-value">{liveValue}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}