import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";

const tabs = [
  { key: "profile", label: "Profile", icon: "bi bi-person-circle" },
  { key: "academic", label: "Academic Rules", icon: "bi bi-clipboard2-data" },
  { key: "notifications", label: "Notifications", icon: "bi bi-bell" },
  { key: "appearance", label: "Appearance", icon: "bi bi-palette2" },
  { key: "security", label: "Security", icon: "bi bi-shield-lock" },
  { key: "backup", label: "Data & Backup", icon: "bi bi-hdd-stack" },
];

const defaultProfile = {
  name: "Mr. Sara",
  designation: "Teaching Accountant",
  email: "teaching.accounts@amitschools.edu",
  phone: "+91 98765 43210",
  department: "Accounts",
  employeeId: "AS-TA-0001",
};

function Toggle({ checked, onChange }) {
  return (
    <label className="ec-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ec-switch-track"><span className="ec-switch-thumb"></span></span>
    </label>
  );
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        {hint && <div className="settings-row-hint">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export default function AccountantSettings() {
  const { showToast } = useOutletContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(defaultProfile);

  const [notify, setNotify] = useState({
    feeDueReminders: true,
    invoiceAlerts: true,
    payrollAlerts: true,
    lowBalanceAlerts: false,
  });

  const [appearance, setAppearance] = useState({
    compactSidebar: false,
    highContrast: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    autoLogout: true,
  });

  const setField = (key) => (v) => setProfile((p) => ({ ...p, [key]: v }));

  const saveAll = () => showToast("All settings saved", "ti-check");
  const resetAll = () => {
    setProfile(defaultProfile);
    showToast("Settings reset to defaults", "ti-refresh");
  };
  const saveProfile = () => showToast("Profile saved", "ti-check");
  const cancelProfile = () => setProfile(defaultProfile);
  const changePassword = () => showToast("Password change link sent to your email", "ti-mail");

  return (
    <div>
      <div className="settings-head-row">
        <PageHeader title="Settings" subtitle="Manage your profile, preferences and school-wide defaults" />
        <div className="settings-head-actions">
          <button className="btn btn-outline" onClick={resetAll}>
            <i className="bi bi-arrow-counterclockwise"></i> Reset
          </button>
          <button className="btn btn-dark" onClick={saveAll}>
            <i className="bi bi-check-lg"></i> Save all
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`settings-tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              <i className={t.icon}></i> {t.label}
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {activeTab === "profile" && (
            <>
              <div className="settings-panel-head">
                <i className="bi bi-person-fill"></i> My Profile
              </div>

              <div className="profile-avatar-row">
                <div className="profile-avatar-circle">{profile.name.trim().charAt(0).toUpperCase() || "S"}</div>
                <div className="profile-avatar-meta">
                  <button className="btn btn-outline btn-sm" type="button">
                    <i className="bi bi-image"></i> Change photo
                  </button>
                  <span className="profile-avatar-hint">JPG or PNG, at least 200×200px</span>
                </div>
              </div>

              <div className="settings-field-grid">
                <div className="settings-field">
                  <label>Full name</label>
                  <input className="form-control" value={profile.name} onChange={(e) => setField("name")(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Designation</label>
                  <input className="form-control" value={profile.designation} onChange={(e) => setField("designation")(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Email address</label>
                  <input type="email" className="form-control" value={profile.email} onChange={(e) => setField("email")(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Phone number</label>
                  <input className="form-control" value={profile.phone} onChange={(e) => setField("phone")(e.target.value)} />
                </div>
              </div>

              <div className="settings-field-grid cols-2">
                <div className="settings-field">
                  <label>Department</label>
                  <select className="form-control" value={profile.department} onChange={(e) => setField("department")(e.target.value)}>
                    {["Accounts", "Administration", "Academics", "Library"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="settings-field">
                  <label>Employee ID</label>
                  <input className="form-control" value={profile.employeeId} onChange={(e) => setField("employeeId")(e.target.value)} />
                </div>
              </div>

              <div className="settings-panel-foot">
                <button className="btn btn-outline" onClick={cancelProfile}>Cancel</button>
                <button className="btn btn-dark" onClick={saveProfile}>
                  <i className="bi bi-check-lg"></i> Save profile
                </button>
              </div>
            </>
          )}

          {activeTab === "academic" && (
            <>
              <div className="settings-panel-head">
                <i className="bi bi-clipboard2-data"></i> Academic Rules
              </div>
              <div className="settings-field-grid cols-2">
                <div className="settings-field">
                  <label>Grading system</label>
                  <select className="form-control" defaultValue="Percentage">
                    {["Percentage", "GPA", "Letter Grade"].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="settings-field">
                  <label>Minimum attendance required</label>
                  <select className="form-control" defaultValue="75%">
                    {["65%", "75%", "80%", "90%"].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="settings-panel-foot">
                <button className="btn btn-dark" onClick={() => showToast("Academic rules saved", "ti-check")}>
                  <i className="bi bi-check-lg"></i> Save rules
                </button>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="settings-panel-head">
                <i className="bi bi-bell-fill"></i> Notifications
              </div>
              <SettingRow label="Fee due reminders" hint="Get notified before student fees are due">
                <Toggle checked={notify.feeDueReminders} onChange={(v) => setNotify((n) => ({ ...n, feeDueReminders: v }))} />
              </SettingRow>
              <SettingRow label="Invoice alerts" hint="Alerts for new & overdue invoices">
                <Toggle checked={notify.invoiceAlerts} onChange={(v) => setNotify((n) => ({ ...n, invoiceAlerts: v }))} />
              </SettingRow>
              <SettingRow label="Payroll alerts" hint="Reminders on salary run dates">
                <Toggle checked={notify.payrollAlerts} onChange={(v) => setNotify((n) => ({ ...n, payrollAlerts: v }))} />
              </SettingRow>
              <SettingRow label="Low balance alerts" hint="Warn when school balance runs low">
                <Toggle checked={notify.lowBalanceAlerts} onChange={(v) => setNotify((n) => ({ ...n, lowBalanceAlerts: v }))} />
              </SettingRow>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <div className="settings-panel-head">
                <i className="bi bi-palette2"></i> Appearance
              </div>
              <SettingRow label="Compact sidebar" hint="Show icons only in the sidebar">
                <Toggle checked={appearance.compactSidebar} onChange={(v) => setAppearance((a) => ({ ...a, compactSidebar: v }))} />
              </SettingRow>
              <SettingRow label="High contrast mode" hint="Increase contrast for better readability">
                <Toggle checked={appearance.highContrast} onChange={(v) => setAppearance((a) => ({ ...a, highContrast: v }))} />
              </SettingRow>
              <p className="settings-placeholder">Use the moon icon in the top bar to switch between light and dark mode.</p>
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="settings-panel-head">
                <i className="bi bi-shield-lock-fill"></i> Security
              </div>
              <SettingRow label="Two-factor authentication" hint="Extra security on every login">
                <Toggle checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} />
              </SettingRow>
              <SettingRow label="Auto logout after inactivity" hint="Sign out after 15 minutes idle">
                <Toggle checked={security.autoLogout} onChange={(v) => setSecurity((s) => ({ ...s, autoLogout: v }))} />
              </SettingRow>
              <div className="settings-panel-foot" style={{ justifyContent: "flex-start" }}>
                <button className="btn btn-outline" onClick={changePassword}>
                  <i className="bi bi-key"></i> Change password
                </button>
              </div>
            </>
          )}

          {activeTab === "backup" && (
            <>
              <div className="settings-panel-head">
                <i className="bi bi-hdd-stack-fill"></i> Data & Backup
              </div>
              <p className="settings-placeholder">Export school data or download a full backup for safekeeping.</p>
              <div className="settings-panel-foot" style={{ justifyContent: "flex-start" }}>
                <button className="btn btn-outline" onClick={() => showToast("Exporting data…", "ti-download")}>
                  <i className="bi bi-download"></i> Export all data
                </button>
                <button className="btn btn-outline" onClick={() => showToast("Backup started", "ti-cloud-upload")}>
                  <i className="bi bi-cloud-arrow-up"></i> Download backup
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
