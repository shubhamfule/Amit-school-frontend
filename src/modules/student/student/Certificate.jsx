import { useMemo, useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import FilterChips from "./FilterChips.jsx";
import { BarTrend } from "./TrendChart.jsx";

const CERTIFICATES = [
  { id: "c1", title: "1st Place — Inter-School Science Fair", category: "excellence", issuer: "District Science Council", date: "12 Jun 2024", icon: "bi-trophy-fill", bg: "#fff8e1", color: "#e59d00" },
  { id: "c2", title: "Academic Excellence Award", category: "academic", issuer: "Amit School", date: "18 Apr 2024", icon: "bi-mortarboard-fill", bg: "#e8f4fd", color: "#2a78d6" },
  { id: "c3", title: "Best Team Spirit — Annual Sports Day", category: "sports", issuer: "Amit School", date: "22 Feb 2024", icon: "bi-people-fill", bg: "#dcfce7", color: "#16a34a" },
  { id: "c4", title: "100m Sprint — 2nd Place", category: "sports", issuer: "District Sports Board", date: "10 Feb 2024", icon: "bi-lightning-fill", bg: "#dcfce7", color: "#16a34a" },
  { id: "c5", title: "Participation — Math Olympiad", category: "participation", issuer: "National Math Olympiad", date: "05 Jan 2024", icon: "bi-calculator-fill", bg: "#ede9fe", color: "#4f3de8" },
  { id: "c6", title: "Perfect Attendance Award", category: "academic", issuer: "Amit School", date: "20 Dec 2023", icon: "bi-calendar-check", bg: "#e8f4fd", color: "#2a78d6" },
  { id: "c7", title: "Chess Tournament — Runner Up", category: "sports", issuer: "Amit School", date: "14 Nov 2023", icon: "bi-award-fill", bg: "#dcfce7", color: "#16a34a" },
  { id: "c8", title: "Participation — Art & Craft Fest", category: "participation", issuer: "Amit School", date: "02 Oct 2023", icon: "bi-palette-fill", bg: "#ede9fe", color: "#4f3de8" },
  { id: "c9", title: "Top Scorer — Term 1 Examination", category: "academic", issuer: "Amit School", date: "18 Sep 2023", icon: "bi-graph-up-arrow", bg: "#e8f4fd", color: "#2a78d6" }
];

const CATEGORY_META = {
  academic: { label: "Academic", tagClass: "tag-academic", icon: "bi-mortarboard-fill", bg: "#e8f4fd", color: "#2a78d6" },
  sports: { label: "Sports", tagClass: "tag-sports", icon: "bi-trophy-fill", bg: "#dcfce7", color: "#16a34a" },
  participation: { label: "Participation", tagClass: "tag-participation", icon: "bi-calculator-fill", bg: "#ede9fe", color: "#4f3de8" },
  excellence: { label: "Excellence", tagClass: "tag-excellence", icon: "bi-award-fill", bg: "#fff8e1", color: "#e59d00" }
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "academic", label: "Academic" },
  { value: "sports", label: "Sports" },
  { value: "participation", label: "Participation" },
  { value: "excellence", label: "Excellence" }
];

/**
 * Builds the certificate as an SVG string via plain string templating.
 * This is safe here (unlike the old vanilla-JS version) because it's
 * never sitting inside a literal <script> tag that an HTML parser has
 * to find the end of — it's just a JS string value inside a React
 * component, so there's no "does this tag-soup accidentally close
 * something" risk at all.
 */
function buildCertificateSvg(cert) {
  const safeTitle = cert.title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
  <rect width="900" height="640" fill="#f5f4fb"/>
  <rect x="24" y="24" width="852" height="592" fill="#ffffff" stroke="${cert.color}" stroke-width="6" rx="18"/>
  <rect x="48" y="48" width="804" height="544" fill="none" stroke="${cert.color}" stroke-width="1.5" stroke-dasharray="6 6" rx="10"/>
  <text x="450" y="140" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="16" letter-spacing="4" fill="#9090a8">CERTIFICATE OF ACHIEVEMENT</text>
  <text x="450" y="230" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="34" font-weight="700" fill="#1a1a2e">${safeTitle}</text>
  <text x="450" y="280" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="15" fill="#5a5a78">This certificate is proudly presented to</text>
  <text x="450" y="330" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="28" font-weight="700" fill="${cert.color}">Mr. Sham</text>
  <text x="450" y="365" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="13" fill="#9090a8">Class 6, Roll No. 20</text>
  <text x="450" y="430" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="14" fill="#5a5a78">Issued by ${cert.issuer} on ${cert.date}</text>
  <circle cx="450" cy="500" r="34" fill="${cert.bg}" stroke="${cert.color}" stroke-width="2"/>
  <text x="450" y="508" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="22" fill="${cert.color}">&#9733;</text>
  <line x1="180" y1="560" x2="360" y2="560" stroke="#c9c6d8" stroke-width="1"/>
  <text x="270" y="580" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="11" fill="#9090a8">Principal</text>
  <line x1="540" y1="560" x2="720" y2="560" stroke="#c9c6d8" stroke-width="1"/>
  <text x="630" y="580" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="11" fill="#9090a8">Class Teacher</text>
</svg>`;
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Downloads either the uploaded image (if the cert has one) or the
// generated SVG certificate as a fallback.
function downloadCertificate(cert) {
  if (cert.imageUrl) {
    const a = document.createElement("a");
    a.href = cert.imageUrl;
    a.download = slugify(cert.title) + (cert.imageExt ? `.${cert.imageExt}` : ".png");
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }
  const svg = buildCertificateSvg(cert);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = slugify(cert.title) + ".svg";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const EMPTY_FORM = { title: "", category: "academic", issuer: "", date: "", imageFile: null, imagePreview: null };

export default function Certificate() {
  const [certificates, setCertificates] = useState(CERTIFICATES);
  const [filter, setFilter] = useState("all");
  const [activeCert, setActiveCert] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const rows = useMemo(
    () => (filter === "all" ? certificates : certificates.filter((c) => c.category === filter)),
    [filter, certificates]
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageFile: file, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function closeUploadModal() {
    setShowUpload(false);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  function handleUploadSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.issuer.trim() || !form.date.trim()) {
      setFormError("Please fill in Certificate, Issued By and Date.");
      return;
    }
    const meta = CATEGORY_META[form.category];
    const ext = form.imageFile ? (form.imageFile.name.split(".").pop() || "png") : null;

    const newCert = {
      id: `c${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      issuer: form.issuer.trim(),
      date: form.date,
      icon: meta.icon,
      bg: meta.bg,
      color: meta.color,
      imageUrl: form.imagePreview || null,
      imageExt: ext
    };

    setCertificates((prev) => [newCert, ...prev]);
    closeUploadModal();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Certificate</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Your earned certificates and awards</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline"><i className="bi bi-share-fill"></i> Share Portfolio</button>
          <button className="btn-primary"><i className="bi bi-download"></i> Download All</button>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCard icon="bi-award-fill" iconBg="#ede9fe" value={String(certificates.length)} label="Total Certificates" badge="All Time" badgeClass="badge-blue" />
        <KpiCard icon="bi-mortarboard-fill" iconBg="#e8f4fd" value={String(certificates.filter(c => c.category === "academic").length)} label="Academic" badge="Highest Count" badgeClass="badge-blue" />
        <KpiCard icon="bi-trophy-fill" iconBg="#dcfce7" value={String(certificates.filter(c => c.category === "sports").length)} label="Sports" badge="Great Form" badgeClass="badge-green" />
        <KpiCard icon="bi-stars" iconBg="#fff8e1" value="Jun 2024" label="Latest Certificate" badge="Science Fair" badgeClass="badge-amber" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Certificates by Category</span>
            <span className="month-badge mb-purple">All Time</span>
          </div>
          <div className="att-body">
            <Donut values={[4, 3, 2]} colors={["#4d0011", "#8a5a3d", "#c9a878"]} centerLabel={String(certificates.length)} cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Academic</span><span className="sval">{certificates.filter(c => c.category === "academic").length}</span></div>
              <div className="row"><span className="slbl">Sports</span><span className="sval">{certificates.filter(c => c.category === "sports").length}</span></div>
              <div className="row"><span className="slbl">Participation</span><span className="sval">{certificates.filter(c => c.category === "participation").length}</span></div>
            </div>
          </div>
        </div>

        <div className="att-card" style={{ gridColumn: "span 2" }}>
          <div className="att-header">
            <span className="att-title">Achievement Highlights</span>
            <span className="month-badge mb-blue">Top Picks</span>
          </div>
          <div>
            <div className="highlight-item">
              <div className="highlight-icon"><i className="bi bi-trophy-fill"></i></div>
              <div className="highlight-text">
                <div className="highlight-title">1st Place — Inter-School Science Fair</div>
                <div className="highlight-sub">Awarded Jun 2024 · District Science Council</div>
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon"><i className="bi bi-award-fill"></i></div>
              <div className="highlight-text">
                <div className="highlight-title">Academic Excellence Award</div>
                <div className="highlight-sub">Awarded Apr 2024 · Amit School</div>
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon"><i className="bi bi-people-fill"></i></div>
              <div className="highlight-text">
                <div className="highlight-title">Best Team Spirit — Annual Sports Day</div>
                <div className="highlight-sub">Awarded Feb 2024 · Amit School</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Certificates Earned Per Year</span>
            <button className="filter-btn">Last 4 Years <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>Certificates</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend labels={["2021", "2022", "2023", "2024"]} data={[1, 2, 3, 3]} color="#4d0011" />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header"><span className="cal-title">Certificate Wallet</span></div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            All your certificates are stored securely and can be viewed or downloaded anytime for scholarship or admission applications.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <span className="kpi-badge badge-blue">PDF Ready</span>
            <span className="kpi-badge badge-green">Verified</span>
            <span className="kpi-badge badge-amber">Shareable Link</span>
          </div>
        </div>
      </div>

      <div className="log-card">
        <div className="chart-header">
          <span className="chart-title">All Certificates</span>
          <button className="filter-btn" style={{marginLeft:"830px"}}>Sort: Newest <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          <button type="button" className="btn-outline" onClick={() => setShowUpload(true)}>
            <i className="bi bi-upload"></i> Upload
          </button>
        </div>

        <FilterChips options={FILTER_OPTIONS} active={filter} onChange={setFilter} />

        <table>
          <thead>
            <tr><th>Certificate</th><th>Category</th><th>Issued By</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="log-empty">No certificates in this category.</td></tr>}
            {rows.map((c) => {
              const meta = CATEGORY_META[c.category];
              return (
                <tr key={c.id}>
                  <td>
                    <div className="cert-title-cell">
                      <div className="cert-icon" style={{ background: c.bg, color: c.color, overflow: "hidden" }}>
                        {c.imageUrl
                          ? <img src={c.imageUrl} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <i className={`bi ${c.icon}`}></i>}
                      </div>
                      <div>
                        <div className="cert-title-text">{c.title}</div>
                        <div className="cert-issuer">{c.issuer}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`status-pill ${meta.tagClass}`}>{meta.label}</span></td>
                  <td>{c.issuer}</td>
                  <td>{c.date}</td>
                  <td>
                    <button className="view-btn" onClick={() => setActiveCert(c)}><i className="bi bi-eye"></i> View</button>{" "}
                    <button className="download-btn" onClick={() => downloadCertificate(c)}><i className="bi bi-download"></i> Download</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeCert && (
        <div className="cert-modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setActiveCert(null); }}>
          <div className="cert-modal">
            <button className="cert-modal-close" onClick={() => setActiveCert(null)}><i className="bi bi-x-lg"></i></button>
            <div className="cert-modal-art">
              {activeCert.imageUrl
                ? <img src={activeCert.imageUrl} alt={activeCert.title} style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10, objectFit: "contain" }} />
                : <i className={`bi ${activeCert.icon}`}></i>}
              <h3>{activeCert.title}</h3>
              <p>Issued by {activeCert.issuer}</p>
            </div>
            <div className="cert-modal-body">
              <div className="cert-modal-row"><span>Category</span><span>{CATEGORY_META[activeCert.category].label}</span></div>
              <div className="cert-modal-row"><span>Date Issued</span><span>{activeCert.date}</span></div>
              <div className="cert-modal-row"><span>Recipient</span><span>Mr. Sham (Roll No. 20)</span></div>
              <div className="cert-modal-actions">
                <button className="download-btn primary" onClick={() => downloadCertificate(activeCert)}>
                  <i className="bi bi-download"></i> Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="cert-modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) closeUploadModal(); }}>
          <div className="cert-modal" style={{ maxWidth: 460 }}>
            <button className="cert-modal-close" onClick={closeUploadModal}><i className="bi bi-x-lg"></i></button>
            <div className="cert-modal-body" style={{ paddingTop: 8 }}>
              <h3 style={{ margin: "0 0 16px" }}>Upload Certificate</h3>
              <form onSubmit={handleUploadSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Certificate
                    <input
                      type="text"
                      placeholder="e.g. Best Team Spirit — Annual Sports Day"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 8, border: "1px solid #d8d8e2", fontSize: 13 }}
                    />
                  </label>

                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Category
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 8, border: "1px solid #d8d8e2", fontSize: 13 }}
                    >
                      <option value="academic">Academic</option>
                      <option value="sports">Sports</option>
                      <option value="participation">Participation</option>
                      <option value="excellence">Excellence</option>
                    </select>
                  </label>

                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Issued By
                    <input
                      type="text"
                      placeholder="e.g. Amit School"
                      value={form.issuer}
                      onChange={(e) => updateField("issuer", e.target.value)}
                      style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 8, border: "1px solid #d8d8e2", fontSize: 13 }}
                    />
                  </label>

                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Date
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 8, border: "1px solid #d8d8e2", fontSize: 13 }}
                    />
                  </label>

                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Certificate Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "block", marginTop: 6, fontSize: 12 }}
                    />
                  </label>

                  {form.imagePreview && (
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      style={{ width: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 8, border: "1px solid #eee" }}
                    />
                  )}

                  {formError && <div style={{ color: "#dc2626", fontSize: 12 }}>{formError}</div>}

                  <div className="cert-modal-actions" style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button type="button" className="btn-outline" onClick={closeUploadModal} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="download-btn primary" style={{ flex: 1 }}>
                      <i className="bi bi-check2"></i> Upload
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}