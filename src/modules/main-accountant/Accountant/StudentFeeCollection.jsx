import PayrollDashboard from "./PayrollDashboard";
import { studentFeeRows } from "./salaryData";

export default function StudentFeeCollection() {
  const rows = studentFeeRows.map((r) => ({ id: r.roll, name: r.name, meta: r.cls, total: r.total, paid: r.paid }));
  const classes = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

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
