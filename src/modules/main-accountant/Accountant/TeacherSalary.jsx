import { useEffect, useState } from "react";
import PayrollDashboard from "./PayrollDashboard";
import { apiGet } from "../../teacher/utils/api";

export default function TeacherSalary() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiGet("/teacher-salary")
      .then((res) => {
        if (cancelled) return;
        setRows(
          (res.data ?? []).map((r) => ({
            id: r.staffId || r._id,
            name: r.name,
            designation: r.designation,
            meta: r.meta,
            total: r.salary,
            paid: r.paid,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
