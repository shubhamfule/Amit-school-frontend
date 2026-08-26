import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import { eventThemes, eventStatuses } from "./eventsData";
import { apiGet, apiPost } from "../../teacher/utils/api";

const tabs = ["All", "Upcoming", "Scheduled", "Planning"];

function formatDateLabel(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function themeForIcon(icon) {
  return eventThemes.find((t) => t.emoji === icon) || eventThemes[0];
}

export default function Events() {
  const { showToast } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    let cancelled = false;
    apiGet("/events")
      .then((res) => {
        if (cancelled) return;
        setEvents(
          (res.data ?? []).map((e) => ({
            id: e._id,
            title: e.title,
            date: e.date ? new Date(e.date).toISOString().slice(0, 10) : "",
            dateLabel: formatDateLabel(e.date ? new Date(e.date).toISOString().slice(0, 10) : ""),
            status: e.status,
            location: e.venue,
            theme: themeForIcon(e.icon),
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    status: "Planning",
    themeKey: eventThemes[0].key,
  });

  const filtered = useMemo(
    () => (tab === "All" ? events : events.filter((e) => e.status === tab)),
    [events, tab]
  );

  const resetForm = () =>
    setForm({ title: "", date: "", location: "", status: "Planning", themeKey: eventThemes[0].key });

  const addEvent = async () => {
    if (!form.title.trim() || !form.date || !form.location.trim()) {
      showToast("Please fill in title, date and location", "ti-alert-triangle");
      return;
    }
    const theme = eventThemes.find((t) => t.key === form.themeKey) || eventThemes[0];
    try {
      const res = await apiPost("/events", {
        title: form.title.trim(),
        date: form.date,
        venue: form.location.trim(),
        status: form.status,
        icon: theme.emoji,
      });
      setEvents((list) => [
        {
          id: res.data._id,
          title: res.data.title,
          date: form.date,
          dateLabel: formatDateLabel(form.date),
          status: res.data.status,
          location: res.data.venue,
          theme: themeForIcon(res.data.icon),
        },
        ...list,
      ]);
      resetForm();
      setModalOpen(false);
      showToast("Event created", "ti-check");
    } catch (err) {
      showToast(err.message || "Could not create event", "ti-alert-triangle");
    }
  };

  return (
    <div>
      <div className="toolbar-row">
        <PageHeader title="Events" subtitle="School events, ceremonies and activities" />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="tab-row" style={{ marginBottom: 0 }}>
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="btn btn-dark" onClick={() => setModalOpen(true)}>
            <i className="bi bi-plus-lg"></i> New event
          </button>
        </div>
      </div>

      <div className="event-grid">
        {filtered.length === 0 && (
          <div className="coming-soon" style={{ gridColumn: "1 / -1" }}>
            <i className="bi bi-calendar-x"></i>
            <p>No events in this category yet.</p>
          </div>
        )}

        {filtered.map((e) => (
          <div className="event-card" key={e.id}>
            <div className="event-banner" style={{ background: e.theme.bg }}>
              <span className="event-emoji">{e.theme.emoji}</span>
            </div>
            <div className="event-body">
              <h4 className="event-title">{e.title}</h4>
              <div className="event-date">
                <i className="bi bi-calendar3"></i> {e.dateLabel}
              </div>
              <div className="event-footer">
                <span className={`status-badge status-${e.status.toLowerCase()}`}>{e.status}</span>
                <span className="event-location">
                  <i className="bi bi-geo-alt"></i> {e.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h5 style={{ display: "flex", alignItems: "center", gap: 8 }}><i className="bi bi-calendar-plus"></i> New Event</h5>
              <button onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="event-form-group">
                <label>Event name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Annual Sports Day"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div className="event-form-row">
                <div className="event-form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="event-form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. School Auditorium"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="event-form-row">
                <div className="event-form-group">
                  <label>Icon</label>
                  <select
                    className="form-control"
                    value={form.themeKey}
                    onChange={(e) => setForm((f) => ({ ...f, themeKey: e.target.value }))}
                  >
                    {eventThemes.map((t) => (
                      <option key={t.key} value={t.key}>{t.emoji} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="event-form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    {eventStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={addEvent}>Save event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
