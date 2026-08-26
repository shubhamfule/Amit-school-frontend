import { useEffect, useState } from "react";
import LibraryShell, { LibAvatar } from "./LibraryShell";
import { avatarPalette, initials } from "./libraryData";
import { apiGet } from "../../teacher/utils/api";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function LibraryClearance() {
  const [clearanceRecords, setClearanceRecords] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiGet("/library-clearances")
      .then((res) => {
        if (cancelled) return;
        setClearanceRecords(
          (res.data ?? []).map((r, i) => ({
            id: r.clearanceId || r._id,
            name: r.name,
            initials: initials(r.name),
            avatar: avatarPalette[i % avatarPalette.length],
            userType: r.userType,
            bookId: r.bookId || "—",
            bookName: r.bookName || "—",
            overdueFine: r.overdueFine ?? 0,
            damageFine: r.damageFine ?? 0,
            status: r.status,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
