import RecordManager from "../../components/teacher-portal/RecordManager";

const columns = [
  { header: "Student Name", key: "studentName" },
  { header: "Start Date", key: "startDate" },
  { header: "End Date", key: "endDate" },
  { header: "Reason", key: "reason" },
  { header: "Status", key: "status", badge: { Approved: "active", Pending: "pending", Rejected: "leave" } },
];

function withPeriod(row) {
  const start = new Date(row.startDate);
  const end = new Date(row.endDate);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
  return { ...row, days };
}

export default function LeaveApplications() {
  return (
    <RecordManager
      title="Leave Applications"
      subtitle="Amit Group of Schools | Apply and track leave requests"
      icon="bi bi-envelope-plus"
      columns={columns}
      rows={[]}
      searchKey="studentName"
      filterField={{ key: "status", label: "Status", options: ["Approved", "Pending", "Rejected"] }}
      addButtonLabel="Apply Leave"
      exportFilename="leave-applications"
      transform={withPeriod}
      apiEndpoint="/leave"
      mapResponseToRows={(response) => response.data || response}
      formFields={[
        { key: "studentName", label: "Student Name", required: true },
        { key: "startDate", label: "Start Date", type: "date", required: true },
        { key: "endDate", label: "End Date", type: "date", required: true },
        { key: "reason", label: "Reason for Leave", type: "textarea", required: true },
        { key: "status", label: "Status", type: "select", options: ["Approved", "Pending", "Rejected"], required: true },
      ]}
    />
  );
}
