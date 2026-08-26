import { useEffect, useState } from "react";
import PayrollDashboard from "./PayrollDashboard";
import { apiGet } from "../../teacher/utils/api";

export default function StudentFeeCollection() {
  const [rows, setRows] = useState([]);
  const classes = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

  useEffect(() => {
    let cancelled = false;
    apiGet("/student-fees")
      .then((res) => {
        if (cancelled) return;
        setRows((res.data ?? []).map((r) => ({ id: r.roll, name: r.name, meta: r.class, total: r.total, paid: r.paid })));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PayrollDashboard
      title="Student Fee Collection"
      subtitle="Amit Group of Schools | Fee collection overview"
      rows={rows}
      idLabel="Roll No."
      nameLabel="Name"
      metaLabel="Class"
      paidCountLabel="Paid Payment"
      classFilterOptions={classes}
      getClass={(r) => r.meta}
      extraColumn={{ label: "Send Msg", actionLabel: "Notify" }}
    />
  );
}
