import PayrollDashboard from "./PayrollDashboard";
import { teacherSalaryRows } from "./salaryData";

export default function TeacherSalary() {
  const rows = teacherSalaryRows.map((r) => ({
    id: r.id,
    name: r.name,
    designation: r.designation,
    meta: r.meta,
    total: r.salary,
    paid: r.paid,
  }));

  return (
    <PayrollDashboard
      title="Teacher Salary Management"
      subtitle="Amit Group of Schools | Teaching staff payroll"
      rows={rows}
      idLabel="ID"
      nameLabel="Teacher Name"
      metaLabel="Subject / Class"
      paidCountLabel="Paid Teachers"
      showDesignationColumn
      designationLabel="Designation"
    />
  );
}
