import RecordManager from "../../components/teacher-portal/RecordManager";

const columns = [
  { header: "Roll No", key: "roll" },
  { header: "Name", key: "name" },
  { header: "Class", key: "class" },
  { header: "Section", key: "section" },
  { header: "Gender", key: "gender" },
  { header: "Mobile Number", key: "mobile" },
  { header: "Status", key: "status", badge: { Active: "active", Inactive: "pending" } },
];

const classOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const sectionOptions = ["A", "B", "C"];
const genderOptions = ["Male", "Female", "Other"];
const statusOptions = ["Active", "Inactive"];

export default function StudentPortal() {
  return (
    <RecordManager
      title="Student Management"
      subtitle="Amit Group of Schools | Student registration and class roster"
      icon="bi bi-person-plus"
      columns={columns}
      rows={[]}
      searchKey="name"
      filterField={{ key: "class", label: "Class", options: classOptions }}
      addButtonLabel="Add Student"
      exportFilename="students"
      apiEndpoint="/students"
      formFields={[
        { key: "name", label: "Student Name", required: true },
        { key: "roll", label: "Roll Number", required: true },
        { key: "class", label: "Select Class", type: "select", options: classOptions, required: true },
        { key: "section", label: "Select Section", type: "select", options: sectionOptions, required: true },
        { key: "gender", label: "Select Gender", type: "select", options: genderOptions, required: true },
        { key: "dob", label: "Date of Birth", type: "date", required: true },
        { key: "mobile", label: "Mobile Number", type: "tel", required: true },
        { key: "admissionDate", label: "Admission Date", type: "date", required: true },
        { key: "status", label: "Status", type: "select", options: statusOptions, required: true },
      ]}
    />
  );
}