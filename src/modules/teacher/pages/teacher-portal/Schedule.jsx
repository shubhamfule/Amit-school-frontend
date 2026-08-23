import { useRef, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import RecordManager from "../../components/teacher-portal/RecordManager";
import { apiGet, apiPost } from "../../utils/api";

const columns = [
  { header: "Time", key: "time" },
  { header: "Subject", key: "subject" },
  { header: "Class", key: "class" },
  { header: "Room", key: "room" },
  { header: "Status", key: "status", badge: { Upcoming: "pending", Ongoing: "active", Completed: "active" } },
];

function parseTimetableCSV(text, startId) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const splitLine = (line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""));

  const headerCells = splitLine(lines[0]).map((h) => h.toLowerCase());
  const keyForHeader = { time: "time", subject: "subject", class: "class", room: "room", status: "status" };

  const colIndexByKey = {};
  headerCells.forEach((h, i) => {
    const key = keyForHeader[h];
    if (key) colIndexByKey[key] = i;
  });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    const row = { id: startId + rows.length };
    columns.forEach((c) => {
      const idx = colIndexByKey[c.key];
      row[c.key] = idx !== undefined ? cells[idx] || "" : "";
    });
    if (!row.status || !["Upcoming", "Ongoing", "Completed"].includes(row.status)) {
      row.status = "Upcoming";
    }
    rows.push(row);
  }
  return rows;
}

export default function Schedule() {
  const { showToast } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [uploadedTimetableImage, setUploadedTimetableImage] = useState(null);
  const fileInputRef = useRef(null);

  const ADD_BUTTON_LABEL = "Add Class";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isCsv = file.type === "text/csv" || lowerName.endsWith(".csv");
    const isImage = file.type.startsWith("image/");

    if (isImage) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedTimetableImage((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url);
        return { name: file.name, url: imageUrl };
      });
      showToast("Timetable image uploaded", "ti-photo");
      e.target.value = "";
      return;
    }

    if (!isCsv) {
      showToast("Please upload a CSV or image file", "ti-alert-triangle");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const nextId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
        const parsedRows = parseTimetableCSV(String(reader.result), nextId);
        if (parsedRows.length === 0) {
          showToast("No valid rows found in the file", "ti-alert-triangle");
          return;
        }
        
        // Remove id field for API submission
        const entriesToSubmit = parsedRows.map(({ id, ...rest }) => rest);
        
        try {
          await apiPost("/schedule/bulk", { entries: entriesToSubmit });
          setRows((prev) => [...prev, ...parsedRows]);
          showToast(
            `Imported ${parsedRows.length} class${parsedRows.length === 1 ? "" : "es"} from timetable`,
            "ti-check"
          );
        } catch (apiError) {
          showToast(`Failed to import timetable: ${apiError.message}`, "ti-alert-triangle");
        }
      } catch (err) {
        showToast("Could not read the timetable file", "ti-alert-triangle");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const uploadButton = (
    <button className="btn btn-outline schedule-upload-btn" onClick={handleUploadClick} type="button">
      <i className="bi bi-upload"></i> Upload Timetable
    </button>
  );

  return (
    <div className="schedule-page">
      <RecordManager
        title="Teacher Schedule"
        subtitle="Amit Group of Schools | Your weekly class timetable"
        icon="bi bi-calendar2-plus"
        columns={columns}
        rows={rows}
        searchKey="subject"
        filterField={{ key: "status", label: "Status", options: ["Upcoming", "Ongoing", "Completed"] }}
        addButtonLabel={ADD_BUTTON_LABEL}
        actionsRightOfAdd={uploadButton}
        exportFilename="schedule"
        apiEndpoint="/schedule"
        mapResponseToRows={(response) => response.data || response}
        formFields={[
          { key: "time", label: "Start Time - End Time (e.g. 09:00 - 09:45)", required: true },
          { key: "subject", label: "Subject", required: true },
          { key: "class", label: "Class", required: true },
          { key: "room", label: "Room", required: true },
          { key: "status", label: "Status", type: "select", options: ["Upcoming", "Ongoing", "Completed"], required: true },
        ]}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {uploadedTimetableImage && (
        <div className="widget-card schedule-upload-preview">
          <h4>
            <i className="bi bi-image"></i> Uploaded Timetable Image
          </h4>
          <img src={uploadedTimetableImage.url} alt="Uploaded timetable" className="schedule-upload-image" />
          <div className="w-sub">{uploadedTimetableImage.name}</div>
        </div>
      )}
    </div>
  );
}