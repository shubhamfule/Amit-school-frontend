import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Switch from '../components/Switch';
import { useToast } from '../context/ToastContext';

const NAV = [
  { key: 'profile', icon: 'ti-user-circle', label: 'Profile' },
  { key: 'library', icon: 'ti-books', label: 'Library Rules' },
  { key: 'notifications', icon: 'ti-bell', label: 'Notifications' },
  { key: 'appearance', icon: 'ti-palette', label: 'Appearance' },
  { key: 'security', icon: 'ti-shield-lock', label: 'Security' },
  { key: 'data', icon: 'ti-database', label: 'Data & Backup' },
];

export default function Settings() {
  const showToast = useToast();
  const [active, setActive] = useState('profile');
  const [notif, setNotif] = useState({
    overdue: true, reservation: true, calendar: true, finePaid: false,
    email: true, sms: false, inApp: true,
  });
  const [rules, setRules] = useState({ autoSuspend: true, allowReservation: true });
  const [theme, setTheme] = useState('light');
  const [twoFa, setTwoFa] = useState(false);
  const [backup, setBackup] = useState(true);

  const save = (label) => showToast(label + ' saved successfully!', 'ti-check');

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, library rules, notifications and account security"
        actions={
          <>
            <button className="btn-ghost-purple" onClick={() => showToast('Changes reset', 'ti-refresh')}><i className="ti ti-refresh"></i>Reset changes</button>
            <button className="btn-purple" onClick={() => save('All settings')}><i className="ti ti-device-floppy"></i>Save changes</button>
          </>
        }
      />

      <div className="settings-layout">
        <div className="settings-nav">
          {NAV.map((n) => (
            <div key={n.key} className={`settings-nav-item${active === n.key ? ' active' : ''}`} onClick={() => setActive(n.key)}>
              <i className={`ti ${n.icon}`}></i>{n.label}
            </div>
          ))}
        </div>

        <div>
          {active === 'profile' && (
            <div className="ec-card">
              <div className="ec-card-head"><h2><i className="ti ti-user-circle me-1" style={{ color: 'var(--purple)' }}></i>Profile Information</h2></div>
              <div className="ec-card-body">
                <div className="settings-section-desc">This information identifies you across the librarian portal.</div>
                <div className="avatar-upload-row">
                  <div className="avatar-lg">MR</div>
                  <div>
                    <button className="btn-ghost-purple" onClick={() => showToast('Choose a photo to upload', 'ti-upload')}><i className="ti ti-upload"></i>Change photo</button>
                    <div className="form-hint">JPG or PNG, at least 200×200px</div>
                  </div>
                </div>
                <hr className="settings-divider" />
                <div className="row g-3">
                  <div className="col-md-6 form-row"><label className="form-label">Full name</label><input className="form-control" defaultValue="Meera Rao" /></div>
                  <div className="col-md-6 form-row"><label className="form-label">Designation</label><input className="form-control" defaultValue="Head Librarian" /></div>
                  <div className="col-md-6 form-row"><label className="form-label">Email address</label><input type="email" className="form-control" defaultValue="meera.rao@amitschool.edu" /></div>
                  <div className="col-md-6 form-row"><label className="form-label">Phone number</label><input type="tel" className="form-control" defaultValue="+91 98765 43210" /></div>
                  <div className="col-md-6 form-row">
                    <label className="form-label">Department</label>
                    <select className="form-select" defaultValue="Library & Resource Center">
                      <option>Library &amp; Resource Center</option><option>Academics</option><option>Administration</option>
                    </select>
                  </div>
                  <div className="col-md-6 form-row"><label className="form-label">Employee ID</label><input className="form-control" defaultValue="AS-LIB-0021" disabled /></div>
                </div>
                <div className="panel-savebar">
                  <button className="btn-ghost-purple">Cancel</button>
                  <button className="btn-purple" onClick={() => save('Profile')}><i className="ti ti-check"></i>Save profile</button>
                </div>
              </div>
            </div>
          )}

          {active === 'library' && (
            <div className="ec-card">
              <div className="ec-card-head"><h2><i className="ti ti-books me-1" style={{ color: 'var(--purple)' }}></i>Circulation &amp; Fine Rules</h2></div>
              <div className="ec-card-body">
                <div className="settings-section-desc">These defaults apply automatically across Issue/Return and Fines &amp; Fees.</div>
                <div className="row g-3">
                  <div className="col-md-6 form-row"><label className="form-label">Standard loan duration</label><div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue="14" /><span className="input-suffix">days</span></div></div>
                  <div className="col-md-6 form-row"><label className="form-label">Maximum books per member</label><div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue="4" /><span className="input-suffix">books</span></div></div>
                  <div className="col-md-6 form-row"><label className="form-label">Fine per day (overdue)</label><div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue="2" /><span className="input-suffix">₹ / day</span></div></div>
                  <div className="col-md-6 form-row"><label className="form-label">Reservation hold period</label><div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue="3" /><span className="input-suffix">days</span></div></div>
                  <div className="col-md-6 form-row"><label className="form-label">Renewal limit</label><div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue="2" /><span className="input-suffix">times</span></div></div>
                  <div className="col-md-6 form-row"><label className="form-label">Grace period before fine applies</label><div className="input-suffix-wrap"><input type="number" className="form-control" defaultValue="1" /><span className="input-suffix">days</span></div></div>
                </div>
                <hr className="settings-divider" />
                <div className="toggle-row">
                  <div className="toggle-row-text"><div className="t-title">Auto-suspend on unpaid fines</div><div className="t-desc">Block further borrowing once a member's fine crosses ₹50</div></div>
                  <Switch checked={rules.autoSuspend} onChange={(v) => setRules({ ...rules, autoSuspend: v })} />
                </div>
                <div className="toggle-row">
                  <div className="toggle-row-text"><div className="t-title">Allow reservations on issued books</div><div className="t-desc">Members can place a hold on a book that's currently checked out</div></div>
                  <Switch checked={rules.allowReservation} onChange={(v) => setRules({ ...rules, allowReservation: v })} />
                </div>
                <div className="panel-savebar">
                  <button className="btn-ghost-purple">Cancel</button>
                  <button className="btn-purple" onClick={() => save('Library rules')}><i className="ti ti-check"></i>Save rules</button>
                </div>
              </div>
            </div>
          )}

          {active === 'notifications' && (
            <div className="ec-card">
              <div className="ec-card-head"><h2><i className="ti ti-bell me-1" style={{ color: 'var(--purple)' }}></i>Notification Preferences</h2></div>
              <div className="ec-card-body">
                <div className="settings-section-desc">Choose what you get notified about, and how.</div>
                <div className="settings-section-title mb-2">Alerts</div>
                <div className="mb-2">
                  <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">Overdue book reminders</div><div className="t-desc">Notify me when a member's book becomes overdue</div></div><Switch checked={notif.overdue} onChange={(v) => setNotif({ ...notif, overdue: v })} /></div>
                  <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">New reservation requests</div><div className="t-desc">Notify me when a member places a hold on a book</div></div><Switch checked={notif.reservation} onChange={(v) => setNotif({ ...notif, reservation: v })} /></div>
                  <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">Upcoming calendar events</div><div className="t-desc">Reminder 1 day before book fairs, meetings and workshops</div></div><Switch checked={notif.calendar} onChange={(v) => setNotif({ ...notif, calendar: v })} /></div>
                  <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">Fine payment confirmations</div><div className="t-desc">Notify me when a member clears a pending fine</div></div><Switch checked={notif.finePaid} onChange={(v) => setNotif({ ...notif, finePaid: v })} /></div>
                </div>
                <hr className="settings-divider" />
                <div className="settings-section-title mb-2">Delivery channels</div>
                <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">Email notifications</div><div className="t-desc">Sent to meera.rao@amitschool.edu</div></div><Switch checked={notif.email} onChange={(v) => setNotif({ ...notif, email: v })} /></div>
                <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">SMS notifications</div><div className="t-desc">Sent to +91 98765 43210 for urgent alerts only</div></div><Switch checked={notif.sms} onChange={(v) => setNotif({ ...notif, sms: v })} /></div>
                <div className="toggle-row"><div className="toggle-row-text"><div className="t-title">In-app notifications</div><div className="t-desc">Show alerts in the bell menu at the top of the portal</div></div><Switch checked={notif.inApp} onChange={(v) => setNotif({ ...notif, inApp: v })} /></div>
                <div className="panel-savebar">
                  <button className="btn-ghost-purple">Cancel</button>
                  <button className="btn-purple" onClick={() => save('Notification preferences')}><i className="ti ti-check"></i>Save preferences</button>
                </div>
              </div>
            </div>
          )}

          {active === 'appearance' && (
            <div className="ec-card">
              <div className="ec-card-head"><h2><i className="ti ti-palette me-1" style={{ color: 'var(--purple)' }}></i>Appearance &amp; Locale</h2></div>
              <div className="ec-card-body">
                <div className="settings-section-title mb-2">Theme</div>
                <div className="settings-section-desc">Applies to the whole librarian portal on this device.</div>
                <div className="choice-card-group mb-2">
                  {[{ key: 'light', icon: 'ti-sun', label: 'Light' }, { key: 'dark', icon: 'ti-moon', label: 'Dark' }, { key: 'system', icon: 'ti-device-desktop', label: 'System' }].map((c) => (
                    <div key={c.key} className={`choice-card${theme === c.key ? ' selected' : ''}`} onClick={() => setTheme(c.key)}>
                      <i className={`ti ${c.icon}`}></i><span>{c.label}</span>
                    </div>
                  ))}
                </div>
                <hr className="settings-divider" />
                <div className="row g-3">
                  <div className="col-md-6 form-row"><label className="form-label">Language</label><select className="form-select" defaultValue="English"><option>English</option><option>Tamil</option><option>Hindi</option></select></div>
                  <div className="col-md-6 form-row"><label className="form-label">Date format</label><select className="form-select" defaultValue="DD/MM/YYYY"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
                  <div className="col-md-6 form-row"><label className="form-label">Time zone</label><select className="form-select" defaultValue="(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi"><option>(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi</option><option>(GMT+0:00) London</option><option>(GMT-5:00) New York</option></select></div>
                  <div className="col-md-6 form-row"><label className="form-label">Default landing page</label><select className="form-select" defaultValue="Dashboard"><option>Dashboard</option><option>Book Catalog</option><option>Issue / Return</option><option>Calendar</option></select></div>
                </div>
                <div className="panel-savebar">
                  <button className="btn-ghost-purple">Cancel</button>
                  <button className="btn-purple" onClick={() => save('Appearance')}><i className="ti ti-check"></i>Save appearance</button>
                </div>
              </div>
            </div>
          )}

          {active === 'security' && (
            <>
              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-lock me-1" style={{ color: 'var(--purple)' }}></i>Password</h2></div>
                <div className="ec-card-body">
                  <div className="row g-3">
                    <div className="col-md-4 form-row"><label className="form-label">Current password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
                    <div className="col-md-4 form-row"><label className="form-label">New password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
                    <div className="col-md-4 form-row"><label className="form-label">Confirm new password</label><input type="password" className="form-control" placeholder="••••••••" /></div>
                  </div>
                  <div className="form-hint">Use at least 8 characters with a mix of letters, numbers and symbols.</div>
                  <div className="panel-savebar">
                    <button className="btn-purple" onClick={() => save('Password')}><i className="ti ti-check"></i>Update password</button>
                  </div>
                </div>
              </div>

              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-shield-check me-1" style={{ color: 'var(--purple)' }}></i>Two-Factor Authentication</h2></div>
                <div className="ec-card-body">
                  <div className="toggle-row" style={{ borderBottom: 'none', paddingTop: 0 }}>
                    <div className="toggle-row-text"><div className="t-title">Require a verification code at login</div><div className="t-desc">Adds an extra step using an authenticator app or SMS code</div></div>
                    <Switch checked={twoFa} onChange={setTwoFa} />
                  </div>
                </div>
              </div>

              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-devices me-1" style={{ color: 'var(--purple)' }}></i>Active Sessions</h2></div>
                <div className="ec-card-body">
                  <div className="session-item">
                    <div className="session-ico"><i className="ti ti-device-laptop"></i></div>
                    <div className="flex-grow-1"><div className="session-title">Windows · Chrome</div><div className="session-meta">Nagpur, Maharashtra · Current session</div></div>
                    <span className="session-badge">Active</span>
                  </div>
                  <div className="session-item">
                    <div className="session-ico"><i className="ti ti-device-mobile"></i></div>
                    <div className="flex-grow-1"><div className="session-title">iPhone · Safari</div><div className="session-meta">Nagpur, Maharashtra · Last active 2 days ago</div></div>
                    <button className="btn-ghost-purple" style={{ padding: '5px 12px', fontSize: 11.5 }} onClick={() => showToast('Session signed out', 'ti-logout')}>Sign out</button>
                  </div>
                </div>
              </div>

              <div className="ec-card">
                <div className="ec-card-head"><h2 style={{ color: 'var(--red)' }}><i className="ti ti-alert-triangle me-1" style={{ color: 'var(--red)' }}></i>Danger Zone</h2></div>
                <div className="ec-card-body">
                  <div className="danger-box">
                    <div><div className="d-title">Sign out of all devices</div><div className="d-desc">This will end every active session except this one</div></div>
                    <button className="btn-danger-ghost" onClick={() => showToast('Signed out of all devices', 'ti-logout')}><i className="ti ti-logout"></i>Sign out everywhere</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {active === 'data' && (
            <>
              <div className="ec-card mb-3">
                <div className="ec-card-head"><h2><i className="ti ti-database-export me-1" style={{ color: 'var(--purple)' }}></i>Export Data</h2></div>
                <div className="ec-card-body">
                  <div className="settings-section-desc">Download library records as a spreadsheet for offline reporting.</div>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn-ghost-purple" onClick={() => showToast('Exporting catalog…', 'ti-file-spreadsheet')}><i className="ti ti-file-spreadsheet"></i>Export catalog (.csv)</button>
                    <button className="btn-ghost-purple" onClick={() => showToast('Exporting members…', 'ti-file-spreadsheet')}><i className="ti ti-file-spreadsheet"></i>Export members (.csv)</button>
                    <button className="btn-ghost-purple" onClick={() => showToast('Exporting circulation history…', 'ti-file-spreadsheet')}><i className="ti ti-file-spreadsheet"></i>Export circulation history (.csv)</button>
                  </div>
                </div>
              </div>

              <div className="ec-card">
                <div className="ec-card-head"><h2><i className="ti ti-cloud-upload me-1" style={{ color: 'var(--purple)' }}></i>Automatic Backup</h2></div>
                <div className="ec-card-body">
                  <div className="toggle-row" style={{ borderBottom: 'none', paddingTop: 0 }}>
                    <div className="toggle-row-text"><div className="t-title">Enable scheduled backups</div><div className="t-desc">Automatically back up library data to secure cloud storage</div></div>
                    <Switch checked={backup} onChange={setBackup} />
                  </div>
                  <div className="row g-3 mt-1">
                    <div className="col-md-6 form-row"><label className="form-label">Backup frequency</label><select className="form-select" defaultValue="Weekly"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
                    <div className="col-md-6 form-row"><label className="form-label">Last backup</label><input className="form-control" defaultValue="1 Jul 2026, 3:00 AM" disabled /></div>
                  </div>
                  <div className="panel-savebar">
                    <button className="btn-ghost-purple" onClick={() => showToast('Running backup now…', 'ti-refresh')}><i className="ti ti-refresh"></i>Run backup now</button>
                    <button className="btn-purple" onClick={() => save('Backup settings')}><i className="ti ti-check"></i>Save backup settings</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
