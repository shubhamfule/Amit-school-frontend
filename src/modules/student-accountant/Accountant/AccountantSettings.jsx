import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

const tabs = [
  ["profile", "Profile", "bi bi-person-circle"],
  ["academic", "Academic Rules", "bi bi-clipboard2-check"],
  ["notifications", "Notifications", "bi bi-bell"],
  ["appearance", "Appearance", "bi bi-palette"],
  ["security", "Security", "bi bi-shield-lock"],
  ["backup", "Data & Backup", "bi bi-database"],
];

export default function AccountantSettings() {
  const { showToast } = useOutletContext();
  const fileRef = useRef(null);
  const [active, setActive] = useState("profile");
  const [photo, setPhoto] = useState("");
  const [profile, setProfile] = useState({
    name: "Mr. Sara",
    designation: "Super Admin",
    email: "admin@amitschools.edu",
    phone: "+91 98765 43210",
    department: "Administration",
    employeeId: "AS-ADM-0001",
  });

  const update = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const reset = () => {
    setProfile({
      name: "Mr. Sara",
      designation: "Super Admin",
      email: "admin@amitschools.edu",
      phone: "+91 98765 43210",
      department: "Administration",
      employeeId: "AS-ADM-0001",
    });
    setPhoto("");
    setActive("profile");
    showToast("Settings reset", "ti-reload");
  };

  const saveAll = () => showToast("All settings saved", "ti-check");
  const saveProfile = () => showToast("Profile saved", "ti-check");

  const onPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    showToast("Profile photo updated", "ti-check");
  };

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, preferences and school-wide defaults</p>
        </div>
        <div className="settings-top-actions">
          <button type="button" className="settings-btn settings-btn-light" onClick={reset}>
            <i className="bi bi-arrow-counterclockwise"></i> Reset
          </button>
          <button type="button" className="settings-btn settings-btn-primary" onClick={saveAll}>
            <i className="bi bi-check-lg"></i> Save all
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {tabs.map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              className={`settings-tab ${active === id ? "active" : ""}`}
              onClick={() => setActive(id)}
            >
              <i className={icon}></i>
              <span>{label}</span>
            </button>
          ))}
        </aside>

        <section className="settings-panel">
          {active === "profile" && (
            <>
              <div className="settings-panel-title"><i className="bi bi-person-circle"></i> My Profile</div>
              <div className="settings-panel-body">
                <div className="profile-photo-row">
                  <div className="profile-photo">
                    {photo ? <img src={photo} alt="Profile" /> : "MS"}
                  </div>
                  <div>
                    <button type="button" className="change-photo-btn" onClick={() => fileRef.current?.click()}>
                      <i className="bi bi-image"></i> Change photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onPhoto} />
                    <p>JPG or PNG, at least 200×200px</p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <label>Full name
                    <input value={profile.name} onChange={(e) => update("name", e.target.value)} />
                  </label>
                  <label>Designation
                    <input value={profile.designation} onChange={(e) => update("designation", e.target.value)} />
                  </label>
                  <label>Email address
                    <input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
                  </label>
                  <label>Phone number
                    <input value={profile.phone} onChange={(e) => update("phone", e.target.value)} />
                  </label>
                  <label>Department
                    <select value={profile.department} onChange={(e) => update("department", e.target.value)}>
                      <option>Administration</option>
                      <option>Accounts</option>
                      <option>Academic</option>
                      <option>Human Resources</option>
                    </select>
                  </label>
                  <label>Employee ID
                    <input value={profile.employeeId} onChange={(e) => update("employeeId", e.target.value)} />
                  </label>
                </div>

                <div className="settings-panel-footer">
                  <button type="button" className="settings-btn settings-btn-light" onClick={reset}>Cancel</button>
                  <button type="button" className="settings-btn settings-btn-primary" onClick={saveProfile}>
                    <i className="bi bi-check-lg"></i> Save profile
                  </button>
                </div>
              </div>
            </>
          )}

          {active === "academic" && <SettingsPlaceholder icon="bi bi-clipboard2-check" title="Academic Rules" text="Manage school-wide academic defaults and rules." />}
          {active === "notifications" && <SettingsPlaceholder icon="bi bi-bell" title="Notifications" text="Manage school notification preferences." />}
          {active === "appearance" && <SettingsPlaceholder icon="bi bi-palette" title="Appearance" text="Manage the application's visual preferences." />}
          {active === "security" && <SettingsPlaceholder icon="bi bi-shield-lock" title="Security" text="Manage account security preferences." />}
          {active === "backup" && <SettingsPlaceholder icon="bi bi-database" title="Data & Backup" text="Manage school data and backup preferences." />}
        </section>
      </div>
    </div>
  );
}

function SettingsPlaceholder({ icon, title, text }) {
  return (
    <>
      <div className="settings-panel-title"><i className={icon}></i> {title}</div>
      <div className="settings-placeholder">
        <i className={icon}></i>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </>
  );
}
