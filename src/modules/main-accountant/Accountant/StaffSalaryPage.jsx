import { useEffect, useState } from "react";
import PayrollDashboard from "./PayrollDashboard";
import { apiGet } from "../../teacher/utils/api";

export default function StaffSalaryPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiGet("/non-teaching-salary")
      .then((res) => {
        if (cancelled) return;
        setRows(
          (res.data ?? []).map((r) => ({
            id: r.staffId || r._id,
            key: `${r.roleKey}-${r.staffId}`,
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
