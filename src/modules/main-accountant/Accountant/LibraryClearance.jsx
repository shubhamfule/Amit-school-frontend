import LibraryShell, { LibAvatar } from "./LibraryShell";
import { clearanceRecords } from "./libraryData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function LibraryClearance() {
  return (
    <LibraryShell icon="bi bi-journal-check" title="Clearance records" count={clearanceRecords.length}>
      <div className="lib-table-wrap">
        <table className="lib-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="tc">User Type</th>
              <th className="tc">Book ID</th>
              <th className="tc">Book Name</th>
              <th className="tc">Overdue Fine</th>
              <th className="tc">Damage Fine</th>
              <th className="tc">Total Fine</th>
              <th className="tc">Status</th>
            </tr>
          </thead>
          <tbody>
            {clearanceRecords.map((r) => (
              <tr key={r.id}>
                <td className="lib-id">{r.id}</td>
                <td>
                  <div className="lib-name-cell">
                    <LibAvatar initials={r.initials} avatar={r.avatar} />
                    <span>{r.name}</span>
                  </div>
                </td>
                <td className="tc">{r.userType}</td>
                <td className="tc">{r.bookId}</td>
                <td className="tc">{r.bookName}</td>
                <td className="tc">{inr(r.overdueFine)}</td>
                <td className="tc">{inr(r.damageFine)}</td>
                <td className="tc">{inr(r.overdueFine + r.damageFine)}</td>
                <td className="tc">
                  <span className={`lib-status ${r.status === "Cleared" ? "cleared" : "pending"}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LibraryShell>
  );
}
