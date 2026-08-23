import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { TextField, SelectField } from "./Field";

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

const NAV_ITEMS = [
  { key: "profile", label: "Profile", icon: "bi bi-person-circle" },
  { key: "academic", label: "Academic Rules", icon: "bi bi-clipboard-check" },
  { key: "notifications", label: "Notifications", icon: "bi bi-bell" },
  { key: "appearance", label: "Appearance", icon: "bi bi-palette2" },
  { key: "security", label: "Security", icon: "bi bi-shield-check" },
  { key: "backup", label: "Data & Backup", icon: "bi bi-hdd-stack" },
];

export default function AccountantSettings() {
  const { showToast } = useOutletContext();
  const [tab, setTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Mr. Sara",
    designation: "Non-Teaching Accountant",
    email: "nonteaching.accounts@amitschools.edu",
    phone: "+91 98765 43210",
    department: "Accounts",
    employeeId: "AS-NTA-0001",
  });

  const [prefs, setPrefs] = useState({
    currency: "INR (₹)",
    dateFormat: "DD MMM YYYY",
    fiscalYearStart: "April",
  });

  const [notify, setNotify] = useState({
    feeDueReminders: true,
    invoiceAlerts: true,
    payrollAlerts: true,
    lowBalanceAlerts: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    autoLogout: true,
  });

  const initials = profile.name
    .replace(/^Mr\.|^Mrs\.|^Ms\.|^Dr\./i, "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveAll = () => showToast("All settings saved", "ti-check");
  const resetAll = () => showToast("Settings reset to last saved values", "ti-refresh");
  const saveProfile = () => showToast("Profile saved", "ti-check");
  const savePrefs = () => showToast("Accounting preferences saved", "ti-check");
  const changePassword = () => showToast("Password change link sent to your email", "ti-mail");

  return (
    <div>
      <div className="settings-header">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Manage your profile, preferences and school-wide defaults</p>
        </div>
        <div className="settings-header-actions">
          <button className="btn-light" onClick={resetAll}>
            <i className="bi bi-arrow-counterclockwise"></i> Reset
          </button>
          <button className="btn btn-dark" onClick={saveAll}>
            <i className="bi bi-check-lg"></i> Save all
          </button>
        </div>
      </div>

      <div className="settings-shell">
        <div className="settings-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`settings-nav-item ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {tab === "profile" && (
            <>
              <h4 className="settings-panel-title"><i className="bi bi-person-circle"></i>My Profile</h4>

              <div className="settings-avatar-row">
                <div className="settings-avatar-circle">{initials}</div>
                <div className="settings-avatar-actions">
                  <button className="btn-light">
                    <i className="bi bi-image"></i> Change photo
                  </button>
                  <div className="settings-avatar-hint">JPG or PNG, at least 200×200px</div>
                </div>
              </div>

              <div className="settings-form-grid">
                <TextField label="Full name" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
                <TextField label="Designation" value={profile.designation} onChange={(v) => setProfile((p) => ({ ...p, designation: v }))} />
                <TextField label="Email address" type="email" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
                <TextField label="Phone number" value={profile.phone} onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
                <SelectField
                  label="Department"
                  value={profile.department}
                  onChange={(v) => setProfile((p) => ({ ...p, department: v }))}
                  options={["Accounts", "Administration", "Academics", "Operations"]}
                />
                <TextField label="Employee ID" value={profile.employeeId} onChange={(v) => setProfile((p) => ({ ...p, employeeId: v }))} />
              </div>

              <div className="settings-panel-foot">
                <button className="btn-light">Cancel</button>
                <button className="btn btn-dark" onClick={saveProfile}>
                  <i className="bi bi-check-lg"></i> Save profile
                </button>
              </div>
            </>
          )}

          {tab === "academic" && (
            <>
              <h4 className="settings-panel-title"><i className="bi bi-clipboard-check"></i>Academic Rules</h4>
              <div className="settings-form-grid">
                <SelectField
                  label="Default Currency"
                  value={prefs.currency}
                  onChange={(v) => setPrefs((p) => ({ ...p, currency: v }))}
                  options={["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)"]}
                />
                <SelectField
                  label="Date Format"
                  value={prefs.dateFormat}
                  onChange={(v) => setPrefs((p) => ({ ...p, dateFormat: v }))}
                  options={["DD MMM YYYY", "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                />
                <SelectField
                  label="Fiscal Year Start"
                  value={prefs.fiscalYearStart}
                  onChange={(v) => setPrefs((p) => ({ ...p, fiscalYearStart: v }))}
                  options={["January", "April", "July"]}
                />
              </div>
              <div className="settings-panel-foot">
                <button className="btn btn-dark" onClick={savePrefs}>
                  <i className="bi bi-check-lg"></i> Save preferences
                </button>
              </div>
            </>
          )}

          {tab === "notifications" && (
            <>
              <h4 className="settings-panel-title"><i className="bi bi-bell"></i>Notifications</h4>
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

          {tab === "appearance" && (
            <>
              <h4 className="settings-panel-title"><i className="bi bi-palette2"></i>Appearance</h4>
              <div className="settings-placeholder">
                <i className="bi bi-cone-striped"></i>
                <p>Appearance preferences are coming soon.</p>
              </div>
            </>
          )}

          {tab === "security" && (
            <>
              <h4 className="settings-panel-title"><i className="bi bi-shield-check"></i>Security</h4>
              <SettingRow label="Two-factor authentication" hint="Extra security on every login">
                <Toggle checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} />
              </SettingRow>
              <SettingRow label="Auto logout after inactivity" hint="Sign out after 15 minutes idle">
                <Toggle checked={security.autoLogout} onChange={(v) => setSecurity((s) => ({ ...s, autoLogout: v }))} />
              </SettingRow>
              <div className="settings-panel-foot">
                <button className="btn-light" onClick={changePassword}>
                  <i className="bi bi-key"></i> Change password
                </button>
              </div>
            </>
          )}

          {tab === "backup" && (
            <>
              <h4 className="settings-panel-title"><i className="bi bi-hdd-stack"></i>Data & Backup</h4>
              <div className="settings-placeholder">
                <i className="bi bi-cone-striped"></i>
                <p>Data & backup controls are coming soon.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
