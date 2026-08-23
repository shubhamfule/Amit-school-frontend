import RecordManager from "../../components/teacher-portal/RecordManager";

const columns = [
  { header: "Title", key: "title" },
  { header: "Subject", key: "subject" },
  { header: "Class", key: "class" },
  { header: "Due Date", key: "dueDate" },
  { header: "Status", key: "status", badge: { Active: "pending", Completed: "active", Archived: "leave" } },
];

export default function Assignments() {
  return (
    <RecordManager
      title="Assignment Management"
      subtitle="Amit Group of Schools | Create and track class assignments"
      icon="bi bi-journal-plus"
      columns={columns}
      rows={[]}
      searchKey="title"
      filterField={{ key: "status", label: "Status", options: ["Active", "Completed", "Archived"] }}
      addButtonLabel="Create Assignment"
      exportFilename="assignments"
      apiEndpoint="/assignments"
      mapResponseToRows={(response) => response.data || response}
      formFields={[
        { key: "title", label: "Assignment Title", required: true },
        { key: "subject", label: "Subject", required: true },
        {
          key: "class",
          label: "Class",
          type: "select",
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          required: true,
        },
        { key: "dueDate", label: "Due Date", type: "date", required: true },
        { key: "description", label: "Assignment Description", type: "textarea" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Completed", "Archived"] },
      ]}
    />
  );
}