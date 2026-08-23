import { useMemo, useState } from "react";
import { students } from "./directoryData";

const CLASS_OPTIONS = [
  "All Classes", "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4",
  "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
];

const normalizeClass = (value = "") => {
  const v = value.toLowerCase().trim();
  if (["nursery", "lkg", "ukg"].includes(v)) return v.charAt(0).toUpperCase() + v.slice(1);
  const match = v.match(/(?:class\s*)?(\d+)(?:st|nd|rd|th)?/);
  return match ? `Class ${match[1]}` : value;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const inr = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

function DetailSection({ title, icon, children }) {
  return (
    <section className="student-detail-section">
      <div className="student-detail-section-title"><i className={icon}></i><h6>{title}</h6></div>
      <div className="student-detail-grid">{children}</div>
    </section>
  );
}

function DetailItem({ label, value }) {
  return <div className="student-detail-item"><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export default function StudentManagement() {
  const [classFilter, setClassFilter] = useState("All Classes");
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const sectionOptions = useMemo(() => [
    "All Sections",
    ...Array.from(new Set(students.map((student) => student.section).filter(Boolean))).sort(),
  ], []);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return students.filter((student) => {
      const classMatches = classFilter === "All Classes" || normalizeClass(student.class) === classFilter;
      const sectionMatches = sectionFilter === "All Sections" || student.section === sectionFilter;
      const searchable = [
        student.name, student.roll, student.admissionNo, student.class, student.section, student.contact
      ].filter(Boolean).join(" ").toLowerCase();
      return classMatches && sectionMatches && (!query || searchable.includes(query));
    });
  }, [classFilter, sectionFilter, searchTerm]);

  return (
    <div className="students-page">
      <div className="students-page-head">
        <div>
          <h1>Students</h1>
          <p>Manage student information and details</p>
        </div>
      </div>

      <div className="student-card-filters">
        <div className="student-card-search">
          <i className="bi bi-search"></i>
          <input
            className="form-control"
            placeholder="Search by roll no., name or admission no...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="form-control" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          {CLASS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select className="form-control" value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
          {sectionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="student-cards-grid">
        {filteredStudents.map((student) => (
          <article className="student-profile-card" key={student.id}>
            <div className="student-avatar">{initials(student.name)}</div>
            <h3>{student.name}</h3>
            <div className="student-card-meta">
              <span>Roll No. : <strong>{student.roll}</strong></span>
              <span>Admission No. : <strong>{student.admissionNo}</strong></span>
            </div>
            <button type="button" className="student-card-view" onClick={() => setSelectedStudent(student)}>
              <i className="bi bi-eye"></i> View
            </button>
          </article>
        ))}

        {filteredStudents.length === 0 && (
          <div className="student-cards-empty">
            <i className="bi bi-search"></i>
            <strong>No students found</strong>
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="modal-overlay student-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-box student-modal-box" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h5><i className="bi bi-person-vcard"></i> Student Details — {selectedStudent.name}</h5>
              <button type="button" aria-label="Close" onClick={() => setSelectedStudent(null)}>×</button>
            </div>

            <div className="modal-body student-modal-body">
              <DetailSection title="Student Information" icon="bi bi-person-badge">
                <DetailItem label="Student Name" value={selectedStudent.name} />
                <DetailItem label="Roll Number" value={selectedStudent.roll} />
                <DetailItem label="Admission Number" value={selectedStudent.admissionNo} />
                <DetailItem label="Date of Birth" value={formatDate(selectedStudent.dob)} />
                <DetailItem label="Gender" value={selectedStudent.gender} />
                <DetailItem label="Class" value={`${selectedStudent.class} — Section ${selectedStudent.section}`} />
              </DetailSection>

              <DetailSection title="Parent Information" icon="bi bi-people">
                <DetailItem label="Father's Name" value={selectedStudent.father} />
                <DetailItem label="Mother's Name" value={selectedStudent.mother} />
                <DetailItem label="Parent / Guardian Contact" value={selectedStudent.contact} />
              </DetailSection>

              <DetailSection title="Admission Information" icon="bi bi-journal-check">
                <DetailItem label="Admission Date" value={formatDate(selectedStudent.admissionDate)} />
                <DetailItem label="Academic Year" value={selectedStudent.academicYear} />
              </DetailSection>

              <DetailSection title="Contact Information" icon="bi bi-geo-alt">
                <DetailItem label="Address" value={selectedStudent.address} />
                <DetailItem label="Phone Number" value={selectedStudent.contact} />
              </DetailSection>

              {selectedStudent.fee && (
                <DetailSection title="Fee Information" icon="bi bi-wallet2">
                  <DetailItem label="Fee Status" value={selectedStudent.feeStatus} />
                  <DetailItem label="Total Fee" value={inr(selectedStudent.fee.total)} />
                  <DetailItem label="Paid Amount" value={inr(selectedStudent.fee.paid)} />
                  <DetailItem label="Remaining / Due" value={inr(selectedStudent.fee.due)} />
                </DetailSection>
              )}
            </div>

            <div className="modal-foot student-modal-footer">
              <button type="button" className="btn btn-dark" onClick={() => setSelectedStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
