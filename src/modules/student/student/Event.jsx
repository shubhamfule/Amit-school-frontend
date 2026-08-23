import React, { useMemo, useState } from "react";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className="cert-modal-overlay open"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="cert-modal">
        <button
          className="cert-modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>
        <div className="cert-modal-body">
          <h3>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

const BANNER_COLORS = [
  "#620018",
  "#D14F7C",
  "#2F7FD3",
  "#13765F",
  "#C27A12",
  "#36740E",
];

const INITIAL_EVENTS = [
  {
    id: 1,
    icon: "🏆",
    title: "Annual Sports Day",
    date: "15 Jul 2026",
    venue: "School Ground",
    status: "scheduled",
    desc: "A full day of athletics, relays and team sports for all age groups.",
  },
  {
    id: 2,
    icon: "🎨",
    title: "Art & Craft Exhibition",
    date: "18 Jul 2026",
    venue: "Main Hall",
    status: "upcoming",
    desc: "Student artwork on display, judged by the art faculty.",
  },
  {
    id: 3,
    icon: "📚",
    title: "Science Exhibition",
    date: "22 Jul 2026",
    venue: "Science Block",
    status: "planning",
    desc: "Student science projects and live demonstrations.",
  },
  {
    id: 4,
    icon: "🎭",
    title: "Cultural Fest",
    date: "28 Jul 2026",
    venue: "Auditorium",
    status: "upcoming",
    desc: "Dance, music and drama performances by students.",
  },
  {
    id: 5,
    icon: "🎤",
    title: "Parent-Teacher Meeting",
    date: "2 Aug 2026",
    venue: "Classrooms",
    status: "scheduled",
    desc: "Termly progress discussion with parents.",
  },
  {
    id: 6,
    icon: "🎓",
    title: "Annual Day Ceremony",
    date: "20 Aug 2026",
    venue: "School Auditorium",
    status: "planning",
    desc: "Prize distribution and year-end celebration.",
  },
];

export default function Events() {
  const [events] = useState(INITIAL_EVENTS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? events
        : events.filter((e) => e.status === statusFilter),
    [events, statusFilter],
  );

  return (
    <div className="events-page">
      <style>{`
        .events-page { font-family: inherit; }

        .events-page .page-title h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary, #1f2430);
          margin: 0;
        }
        .events-page .page-title p {
          font-size: 13px;
          color: var(--text-muted, #8a8f98);
          margin: 4px 0 0;
        }

        .events-page .events-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .events-page .tab-row {
          display: flex;
          gap: 4px;
          background: var(--surface-2, #f1f2f6);
          padding: 4px;
          border-radius: 999px;
        }
        .events-page .tab-btn {
          border: none;
          background: transparent;
          color: var(--text-muted, #6b7280);
          font-size: 13px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: var(--transition, all .2s ease);
        }
        .events-page .tab-btn:hover { color: var(--text-primary, #1f2430); }
        .events-page .tab-btn.active {
          background: var(--purple, #6d1b3d);
          color: #fff;
        }

        .events-page .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 16px;
        }

        .events-page .event-card {
          background: var(--surface, #fff);
          border: 1px solid var(--border, #ececec);
          border-radius: var(--radius-lg, 14px);
          overflow: hidden;
          box-shadow: var(--shadow-card, 0 2px 10px rgba(0,0,0,0.06));
          cursor: pointer;
          transition: var(--transition, all .2s ease);
        }
        .events-page .event-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 22px rgba(77, 0, 17, 0.16);
        }

        .events-page .event-banner {
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
        }

        .events-page .event-body { padding: 16px; }
        .events-page .event-body h5 {
          font-size: 14.5px;
          font-weight: 600;
          margin: 0 0 6px;
          color: var(--text-primary, #1f2430);
        }
        .events-page .event-meta {
          font-size: 12px;
          color: var(--text-muted, #8a8f98);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .events-page .event-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .events-page .evt-badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }
        .events-page .evt-badge.upcoming { background: var(--blue-light, #e7f1fd); color: var(--blue, #1c7ed6); }
        .events-page .evt-badge.scheduled { background: var(--green-light, #e6f6ea); color: var(--green, #2f9e44); }
        .events-page .evt-badge.planning { background: var(--amber-light, #fdf1e0); color: var(--amber, #d9822b); }

        .events-page .text-muted { color: var(--text-muted, #8a8f98); }

        .events-page .cert-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(20, 15, 20, 0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .events-page .cert-modal {
          background: var(--surface, #fff);
          border-radius: var(--radius-lg, 14px);
          width: min(420px, 92vw);
          max-height: 88vh;
          overflow-y: auto;
          padding: 24px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .events-page .cert-modal-close {
          position: absolute; top: 14px; right: 14px;
          border: none; background: transparent;
          font-size: 22px; line-height: 1; cursor: pointer;
          color: var(--text-muted, #8a8f98);
        }
        .events-page .cert-modal-body h3 {
          margin: 0 0 14px; font-size: 18px; font-weight: 700;
          color: var(--text-primary, #1f2430);
        }
        .events-page .mb-3 { margin-bottom: 12px; }
        .events-page .d-flex { display: flex; }
        .events-page .justify-between { justify-content: space-between; }
        .events-page .align-center { align-items: center; }
      `}</style>

      <div className="events-toolbar">
        <div className="page-title">
          <h1>Events</h1>
          <p>School events, ceremonies and activities</p>
        </div>
        <div
          className="d-flex gap-2 flex-wrap"
          style={{ alignItems: "center" }}
        >
          <div className="tab-row">
            {["all", "upcoming", "scheduled", "planning"].map((s) => (
              <button
                key={s}
                className={`tab-btn ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
                style={{ textTransform: "capitalize" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 50,
            color: "var(--text-muted)",
          }}
        >
          <i
            className="ti ti-calendar-x mb-2"
            style={{ fontSize: 26, display: "block" }}
          ></i>
          No events found.
        </div>
      ) : (
        <div className="event-grid">
          {filtered.map((e, i) => (
            <div
              className="event-card"
              key={e.id}
              onClick={() => setViewing(e)}
            >
              <div
                className="event-banner"
                style={{ background: BANNER_COLORS[i % BANNER_COLORS.length] }}
              >
                {e.icon}
              </div>
              <div className="event-body">
                <h5>{e.title}</h5>
                <div className="event-meta">
                  <i className="ti ti-calendar"></i>
                  {e.date}
                </div>
                <div className="event-footer">
                  <span className={`evt-badge ${e.status}`}>{e.status}</span>
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    <i className="ti ti-map-pin" style={{ marginRight: 4 }}></i>
                    {e.venue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title || ""}
      >
        {viewing && (
          <div>
            <div
              className="event-banner"
              style={{ borderRadius: 10, marginBottom: 14 }}
            >
              {viewing.icon}
            </div>
            <div className="event-meta mb-3">
              <i className="ti ti-calendar"></i>
              {viewing.date}
            </div>
            <p className="text-muted mb-3">{viewing.desc}</p>
            <div className="d-flex justify-between align-center">
              <span className={`evt-badge ${viewing.status}`}>
                {viewing.status}
              </span>
              <span className="text-muted" style={{ fontSize: 13 }}>
                <i className="ti ti-map-pin" style={{ marginRight: 4 }}></i>
                {viewing.venue}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
