import PayrollDashboard from "./PayrollDashboard";
import { nonTeachingRows } from "./salaryData";

export default function StaffSalaryPage() {
  const rows = nonTeachingRows.map((r) => ({
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
      title="Non-Teaching Staff Salary Management"
      subtitle="Amit Group of Schools | Non-teaching staff payroll"
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
