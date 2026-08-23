import PayrollDashboard from "./PayrollDashboard";
import { teacherRows } from "./salaryData";

export default function StaffSalaryPage() {
  const rows = teacherRows.map((r) => ({
    id: r.id,
    key: r.key,
    name: r.name,
    designation: r.designation,
    meta: r.meta,
    total: r.salary,
    paid: r.paid,
  }));

  return (
    <PayrollDashboard
      title="Teaching Staff Salary Management"
      subtitle="Amit Group of Schools | Teaching staff payroll"
      rows={rows}
      idLabel="ID"
      nameLabel="Name"
      metaLabel="Department / Area"
      paidCountLabel="Paid Staff"
      showDesignationColumn
      designationLabel="Designation"
    />
  );
}
