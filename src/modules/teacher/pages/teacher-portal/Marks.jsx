import RecordManager from "../../components/teacher-portal/RecordManager";

function gradeFor(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  return "D";
}

const columns = [
  { header: "Roll No", key: "roll" },
  { header: "Student Name", key: "name" },
  { header: "Test", key: "test" },
  { header: "Subject", key: "subject" },
  { header: "Marks", key: "marks" },
  { header: "Grade", key: "grade", badge: { "A+": "active", A: "active", B: "pending", C: "pending", D: "leave" } },
];

function withComputed(row) {
  return { ...row, grade: gradeFor(row.marks) };
}

const studentDirectory = [
  { roll: "101", name: "Aarav Mehta" },
  { roll: "102", name: "Isha Kulkarni" },
  { roll: "103", name: "Rohan Deshpande" },
  { roll: "104", name: "Sneha Joshi" },
  { roll: "105", name: "Aditya Rao" },
  { roll: "106", name: "Priya Nair" },
  { roll: "107", name: "Kabir Shah" },
  { roll: "108", name: "Ananya Iyer" },
];

const studentNameByRoll = Object.fromEntries(studentDirectory.map((s) => [s.roll, s.name]));

function autoFillStudentName({ key, value }) {
  if (key !== "roll") return null;
  const name = studentNameByRoll[String(value).trim()];
  return { name: name || "" };
}

export default function Marks() {
  return (
    <RecordManager
      title="Marks Management"
      subtitle="Amit Group of Schools | Record and review student marks"
      icon="bi bi-graph-up"
      columns={columns}
      rows={[]}
      searchKey="name"
      addButtonLabel="Enter Marks"
      exportFilename="marks"
      transform={withComputed}
      apiEndpoint="/marks"
      mapResponseToRows={(response) => response.data || response}
      onFormFieldChange={autoFillStudentName}
      formFields={[
        { key: "test", label: "Test/Exam Name", required: true },
        { key: "roll", label: "Roll Number", required: true },
        { key: "name", label: "Student Name", required: true, readOnly: true },
        { key: "subject", label: "Subject", required: true },
        { key: "marks", label: "Marks (out of 100)", type: "number", required: true },
      ]}
    />
  );
}