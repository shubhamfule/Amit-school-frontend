import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import { useToast } from '../components/ToastContext';

const TABS = [
  { id: 'profile', icon: 'ti-user-circle', label: 'Profile' },
  { id: 'rules', icon: 'ti-clipboard-list', label: 'Academic Rules' },
  { id: 'notifications', icon: 'ti-bell', label: 'Notifications' },
  { id: 'appearance', icon: 'ti-palette', label: 'Appearance' },
  { id: 'security', icon: 'ti-shield-lock', label: 'Security' },
  { id: 'data', icon: 'ti-database', label: 'Data & Backup' },
];

function Toggle({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider-track"></span>
    </label>
  );
}

export default function Settings() {
  const showToast = useToast();
  const { darkMode, setDarkMode } = useTheme();
  const [tab, setTab] = useState('profile');

  const [notifPrefs, setNotifPrefs] = useState({
    admissions: true, feeReminders: true, calendarEvents: true, staffAlerts: false,
    email: true, sms: false, push: true,
  });
  const [toggles, setToggles] = useState({ autoSuspend: true, allowHold: true, twoFa: false, autoBackup: true });
  const [themeChoice, setThemeChoice] = useState(darkMode ? 'dark' : 'light');

  function save(label) { showToast(label + ' saved', 'ti-circle-check'); }

  function chooseTheme(choice) {
    setThemeChoice(choice);
    if (choice === 'dark') { setDarkMode(true); showToast('Dark mode on', 'ti-moon'); }
    else if (choice === 'light') { setDarkMode(false); showToast('Light mode on', 'ti-sun'); }
    else { showToast('Following system theme', 'ti-device-desktop'); }
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Manage your profile, preferences and school-wide defaults</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-ghost-purple" onClick={() => showToast('Changes reverted', 'ti-refresh')}><i className="ti ti-refresh"></i>Reset</button>
          <button className="btn-purple" onClick={() => showToast('All changes saved', 'ti-circle-check')}><i className="ti ti-check"></i>Save all</button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          {TABS.map((t) => (
            <button key={t.id} className={`settings-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <i className={`ti ${t.icon}`}></i>{t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === 'profile' && (
            <div className="settings-panel">
              <div className="ec-card">
                <div className="ec-card-head"><h2><i className="ti ti-user-circle" style={{ color: 'var(--purple)', marginRight: 6 }}></i>My Profile</h2></div>
                <div className="ec-card-body">
                  <div className="avatar-upload-row">
                    <div className="avatar-lg">MS</div>
                    <div>
                      <button className="btn-ghost-purple" onClick={() => showToast('Photo upload coming soon', 'ti-photo')}><i className="ti ti-photo"></i>Change photo</button>
                      <div className="form-hint">JPG or PNG, at least 200×200px</div>
                    </div>
                  </div>
                  <div className="settings-grid-2">
                    <div className="form-group"><label className="form-label">Full name</label><input className="form-control" defaultValue="Mr. Sara" /></div>
                    <div className="form-group"><label className="form-label">Designation</label><input className="form-control" defaultValue="Super Admin" /></div>
                    <div className="form-group"><label className="form-label">Email address</label><input type="email" className="form-control" defaultValue="admin@amitschool.edu" /></div>
                    <div className="form-group"><label className="form-label">Phone number</label><input type="tel" className="form-control" defaultValue="+91 98765 43210" /></div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select className="form-select" defaultValue="Administration">
                        <option>Administration</option><option>Academics</option><option>Finance</option>
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Employee ID</label><input className="form-control" defaultValue="AS-ADM-0001" disabled /></div>
                  </div>
                  <div className="panel-savebar">
                    <button className="btn-ghost-purple" onClick={() => showToast('Changes reverted', 'ti-refresh')}>Cancel</button>
                    <button className="btn-purple" onClick={() => save('Profile')}><i className="ti ti-check"></i>Save profile</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'rules' && (
            <div className="settings-panel">
              <div className="ec-card">
                <div className="ec-card-head"><h2><i className="ti ti-clipboard-list" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Attendance &amp; Fee Rules</h2></div>
                <div className="ec-card-body">
                  <div className="settings-section-desc">These defaults apply automatically across Students, Finance and Calendar.</div>
                  <div className="settings-grid-2">
                    <div className="form-group">
                      <label className="form-label">Academic year length</label>
                      <div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue={10} /><span className="input-suffix">months</span></div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Minimum attendance required</label>
                      <div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue={75} /><span className="input-suffix">%</span></div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Late fee (overdue)</label>
                      <div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue={50} /><span className="input-suffix">₹ / day</span></div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fee payment grace period</label>
                      <div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue={7} /><span className="input-suffix">days</span></div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max leave days (staff)</label>
                      <div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue={12} /><span className="input-suffix">days/yr</span></div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Report card release</label>
                      <div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue={5} /><span className="input-suffix">days after exam</span></div>
                    </div>
                  </div>

                  <hr className="settings-divider" />

                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Auto-suspend on unpaid fines</div><div className="t-desc">Restrict portal access once a family's dues cross the grace period</div></div>
                    <Toggle checked={toggles.autoSuspend} onChange={(v) => setToggles({ ...toggles, autoSuspend: v })} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Allow online fee holds</div><div className="t-desc">Parents can request a temporary hold on a due date</div></div>
                    <Toggle checked={toggles.allowHold} onChange={(v) => setToggles({ ...toggles, allowHold: v })} />
                  </div>

                  <div className="panel-savebar">
                    <button className="btn-ghost-purple" onClick={() => showToast('Changes reverted', 'ti-refresh')}>Cancel</button>
                    <button className="btn-purple" onClick={() => save('Rules')}><i className="ti ti-check"></i>Save rules</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="settings-panel">
              <div className="ec-card">
                <div className="ec-card-head"><h2><i className="ti ti-bell" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Notification Preferences</h2></div>
                <div className="ec-card-body">
                  <div className="settings-section-desc">Choose what you get notified about, and how.</div>

                  <div className="settings-section-title mb-2">Alerts</div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">New admission requests</div><div className="t-desc">Notify me when a new student applies for admission</div></div>
                    <Toggle checked={notifPrefs.admissions} onChange={(v) => setNotifPrefs({ ...notifPrefs, admissions: v })} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Fee payment reminders</div><div className="t-desc">Notify me when a student's fee becomes overdue</div></div>
                    <Toggle checked={notifPrefs.feeReminders} onChange={(v) => setNotifPrefs({ ...notifPrefs, feeReminders: v })} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Upcoming calendar events</div><div className="t-desc">Reminder 1 day before ceremonies, meetings and exams</div></div>
                    <Toggle checked={notifPrefs.calendarEvents} onChange={(v) => setNotifPrefs({ ...notifPrefs, calendarEvents: v })} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Staff attendance alerts</div><div className="t-desc">Notify me when staff attendance drops below 80%</div></div>
                    <Toggle checked={notifPrefs.staffAlerts} onChange={(v) => setNotifPrefs({ ...notifPrefs, staffAlerts: v })} />
                  </div>

                  <hr className="settings-divider" />

                  <div className="settings-section-title mb-2">Delivery channels</div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Email notifications</div><div className="t-desc">Sent to admin@amitschool.edu</div></div>
                    <Toggle checked={notifPrefs.email} onChange={(v) => setNotifPrefs({ ...notifPrefs, email: v })} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">SMS notifications</div><div className="t-desc">Sent to +91 98765 43210</div></div>
                    <Toggle checked={notifPrefs.sms} onChange={(v) => setNotifPrefs({ ...notifPrefs, sms: v })} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-row-text"><div className="t-title">Push notifications</div><div className="t-desc">Show alerts in this dashboard</div></div>
                    <Toggle checked={notifPrefs.push} onChange={(v) => setNotifPrefs({ ...notifPrefs, push: v })} />
                  </div>

                  <div className="panel-savebar">
                    <button className="btn-purple" onClick={() => save('Preferences')}><i className="ti ti-check"></i>Save preferences</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="settings-panel">
              <div className="ec-card">
                <div className="ec-card-head"><h2><i className="ti ti-palette" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Appearance &amp; Locale</h2></div>
                <div className="ec-card-body">
                  <div className="settings-section-title mb-2">Theme</div>
                  <div className="settings-section-desc">Applies to the whole admin dashboard on this device.</div>
                  <div className="choice-card-group mb-3">
                    <div className={`choice-card ${themeChoice === 'light' ? 'selected' : ''}`} onClick={() => chooseTheme('light')}><i className="ti ti-sun"></i><span>Light</span></div>
                    <div className={`choice-card ${themeChoice === 'dark' ? 'selected' : ''}`} onClick={() => chooseTheme('dark')}><i className="ti ti-moon"></i><span>Dark</span></div>
                    <div className={`choice-card ${themeChoice === 'system' ? 'selected' : ''}`} onClick={() => chooseTheme('system')}><i className="ti ti-device-desktop"></i><span>System</span></div>
                  </div>

                  <hr className="settings-divider" />

                  <div className="settings-grid-2">
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <select className="form-select" defaultValue="English"><option>English</option><option>Tamil</option><option>Hindi</option></select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date format</label>
                      <select className="form-select" defaultValue="DD/MM/YYYY"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time zone</label>
                      <select className="form-select" defaultValue="chennai"><option value="chennai">(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi</option><option value="london">(GMT+0:00) London</option><option value="ny">(GMT-5:00) New York</option></select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default landing page</label>
                      <select className="form-select" defaultValue="Dashboard"><option>Dashboard</option><option>Students</option><option>Finance</option><option>Calendar</option></select>
                    </div>
                  </div>

                  <div className="panel-savebar">
                    <button className="btn-ghost-purple" onClick={() => showToast('Changes reverted', 'ti-refresh')}>Cancel</button>
                    <button className="btn-purple" onClick={() => save('Appearance')}><i className="ti ti-check"></i>Save appearance</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="settings-panel">
              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-lock" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Password</h2></div>
                <div className="ec-card-body">
                  <div className="settings-grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="form-group"><label className="form-label">Current password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
                    <div className="form-group"><label className="form-label">New password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
                    <div className="form-group"><label className="form-label">Confirm new password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
                  </div>
                  <div className="form-hint">Use at least 8 characters with a mix of letters, numbers and symbols.</div>
                  <div className="panel-savebar">
                    <button className="btn-purple" onClick={() => showToast('Password updated successfully', 'ti-lock')}><i className="ti ti-check"></i>Update password</button>
                  </div>
                </div>
              </div>

              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-shield-check" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Two-Factor Authentication</h2></div>
                <div className="ec-card-body">
                  <div className="toggle-row" style={{ borderBottom: 'none', paddingTop: 0 }}>
                    <div className="toggle-row-text"><div className="t-title">Require a verification code at login</div><div className="t-desc">Adds an extra step using an authenticator app or SMS code</div></div>
                    <Toggle checked={toggles.twoFa} onChange={(v) => { setToggles({ ...toggles, twoFa: v }); showToast(v ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled', 'ti-shield-check'); }} />
                  </div>
                </div>
              </div>

              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-devices" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Active Sessions</h2></div>
                <div className="ec-card-body">
                  <div className="session-item">
                    <div className="session-ico"><i className="ti ti-device-laptop"></i></div>
                    <div style={{ flex: 1 }}><div className="session-title">Windows · Chrome</div><div className="session-meta">Nagpur, Maharashtra · Current session</div></div>
                    <span className="session-badge">Active</span>
                  </div>
                  <div className="session-item">
                    <div className="session-ico"><i className="ti ti-device-mobile"></i></div>
                    <div style={{ flex: 1 }}><div className="session-title">iPhone · Safari</div><div className="session-meta">Nagpur, Maharashtra · Last active 2 days ago</div></div>
                    <button className="btn-ghost-purple" style={{ padding: '5px 12px', fontSize: 11.5 }} onClick={() => showToast('Session signed out', 'ti-logout')}>Sign out</button>
                  </div>
                </div>
              </div>

              <div className="ec-card">
                <div className="ec-card-head"><h2 style={{ color: 'var(--red)' }}><i className="ti ti-alert-triangle" style={{ color: 'var(--red)', marginRight: 6 }}></i>Danger Zone</h2></div>
                <div className="ec-card-body">
                  <div className="danger-box">
                    <div><div className="d-title">Sign out of all devices</div><div className="d-desc">This will end every active session except this one</div></div>
                    <button className="btn-danger-ghost" onClick={() => showToast('Signed out of all other devices', 'ti-logout')}><i className="ti ti-logout"></i>Sign out everywhere</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'data' && (
            <div className="settings-panel">
              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-database-export" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Export Data</h2></div>
                <div className="ec-card-body">
                  <div className="settings-section-desc">Download school records as a spreadsheet for offline reporting.</div>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn-ghost-purple" onClick={() => showToast('Exporting students…', 'ti-download')}><i className="ti ti-file-spreadsheet"></i>Export students (.csv)</button>
                    <button className="btn-ghost-purple" onClick={() => showToast('Exporting staff…', 'ti-download')}><i className="ti ti-file-spreadsheet"></i>Export staff (.csv)</button>
                    <button className="btn-ghost-purple" onClick={() => showToast('Exporting fee history…', 'ti-download')}><i className="ti ti-file-spreadsheet"></i>Export fee history (.csv)</button>
                  </div>
                </div>
              </div>

              <div className="ec-card">
                <div className="ec-card-head"><h2><i className="ti ti-cloud-upload" style={{ color: 'var(--purple)', marginRight: 6 }}></i>Automatic Backup</h2></div>
                <div className="ec-card-body">
                  <div className="toggle-row" style={{ borderBottom: 'none', paddingTop: 0 }}>
                    <div className="toggle-row-text"><div className="t-title">Enable scheduled backups</div><div className="t-desc">Automatically back up school data to secure cloud storage</div></div>
                    <Toggle checked={toggles.autoBackup} onChange={(v) => setToggles({ ...toggles, autoBackup: v })} />
                  </div>
                  <div className="settings-grid-2" style={{ marginTop: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Backup frequency</label>
                      <select className="form-select" defaultValue="Weekly"><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last backup</label>
                      <input className="form-control" defaultValue="1 Jul 2026, 3:00 AM" disabled />
                    </div>
                  </div>
                  <div className="panel-savebar">
                    <button className="btn-ghost-purple" onClick={() => showToast('Backup started…', 'ti-refresh')}><i className="ti ti-refresh"></i>Run backup now</button>
                    <button className="btn-purple" onClick={() => save('Backup settings')}><i className="ti ti-check"></i>Save backup settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
