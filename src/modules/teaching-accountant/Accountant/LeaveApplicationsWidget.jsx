import { useEffect, useRef, useState } from "react";
import { leaveApplications } from "./directoryData";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

function formatDateLabel(iso) {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function calcLeaveDays(fromISO, toISO) {
  const start = new Date(`${fromISO}T00:00:00`);
  const end = new Date(`${toISO}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "-";
  const diff = Math.round((end - start) / 86400000) + 1;
  return diff > 0 ? diff : 1;
}

function statusClass(status) {
  if (status === "Approved") return "approved";
  if (status === "Rejected") return "rejected";
  return "pending";
}

// Leave Applications section — Teaching staff only.
// Reused on both the Dashboard and the Events page (directly below the events list),
// so the upload/view/download/replace behaviour and file-to-application association
// stay identical wherever this section appears.
export default function LeaveApplicationsWidget({
  title = "Leave Applications",
  icon = "bi bi-file-earmark-text-fill",
  className = "",
  showToast,
}) {
  // Keyed by application id, so each uploaded document stays correctly
  // associated with the correct Teaching staff leave application.
  const [uploads, setUploads] = useState({});
  const objectUrls = useRef(new Set());

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    };
  }, []);

  const handleUpload = (applicationId, file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast?.("Only PDF, JPG, JPEG or PNG files are supported", "ti-alert-triangle");
      return;
    }

    // Replacing an existing file: release the previous object URL first.
    const oldUrl = uploads[applicationId]?.url;
    if (oldUrl) {
      URL.revokeObjectURL(oldUrl);
      objectUrls.current.delete(oldUrl);
    }

    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    setUploads((current) => ({
      ...current,
      [applicationId]: { name: file.name, url },
    }));
    showToast?.(oldUrl ? "Document replaced" : "Document uploaded", "ti-check");
  };

  return (
    <div className={`widget-card dashboard-full-card leave-applications-widget ${className}`}>
      <h4><i className={icon}></i>{title}</h4>

      <div className="table-wrap" style={{ marginTop: 4 }}>
        <table className="table table-hover leave-apps-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Leave Reason</th>
              <th>Leave Start Date</th>
              <th>Leave End Date</th>
              <th>Total Leave Days</th>
              <th>Leave Status</th>
              <th>Upload</th>
            </tr>
          </thead>

          <tbody>
            {leaveApplications.map((l) => {
              const upload = uploads[l.id];

              return (
                <tr key={l.id}>
                  <td>{l.employeeId}</td>
                  <td>{l.employeeName}</td>
                  <td>
                    <span className="leave-apps-reason" title={l.reason}>{l.reason}</span>
                  </td>
                  <td>{formatDateLabel(l.from)}</td>
                  <td>{formatDateLabel(l.to)}</td>
                  <td>{calcLeaveDays(l.from, l.to)}</td>
                  <td>
                    <span className={`status-badge ${statusClass(l.status)}`}>{l.status}</span>
                  </td>
                  <td>
                    <div className="leave-upload-actions">
                      <label className="btn btn-outline leave-upload-btn">
                        <i className="bi bi-upload"></i> {upload ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept={ACCEPT_ATTR}
                          onChange={(e) => {
                            handleUpload(l.id, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                          hidden
                        />
                      </label>

                      {upload && (
                        <>
                          <a
                            className="btn btn-outline"
                            href={upload.url}
                            target="_blank"
                            rel="noreferrer"
                            title={upload.name}
                          >
                            <i className="bi bi-eye"></i> View
                          </a>
                          <a
                            className="btn btn-dark"
                            href={upload.url}
                            download={upload.name}
                            title={`Download ${upload.name}`}
                          >
                            <i className="bi bi-download"></i> Download
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {leaveApplications.length === 0 && (
              <tr>
                <td colSpan={8} className="widget-empty">No leave applications submitted yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
