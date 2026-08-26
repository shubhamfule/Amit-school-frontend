import { useEffect, useState } from "react";
import LibraryShell, { LibAvatar } from "./LibraryShell";
import { avatarPalette, initials } from "./libraryData";
import { apiGet } from "../../teacher/utils/api";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function FineCollection() {
  const [fineCollections, setFineCollections] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiGet("/library-fines")
      .then((res) => {
        if (cancelled) return;
        setFineCollections(
          (res.data ?? []).map((r, i) => ({
            id: r.fineId || r._id,
            name: r.name,
            initials: initials(r.name),
            avatar: avatarPalette[i % avatarPalette.length],
            userType: r.userType,
            bookId: r.bookId,
            type: r.type || (r.fineAmount != null ? "Overdue" : ""),
            amount: r.amount ?? r.fineAmount ?? 0,
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
    <LibraryShell icon="bi bi-cash" title="Fine collection records" count={fineCollections.length}>
      <div className="lib-table-wrap">
        <table className="lib-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="tc">User Type</th>
              <th className="tc">Book ID</th>
              <th className="tc">Fine Type</th>
              <th className="tc">Amount</th>
              <th className="tc">Status</th>
            </tr>
          </thead>
          <tbody>
            {fineCollections.map((r) => (
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
                <td className="tc">{r.type}</td>
                <td className="tc">{inr(r.amount)}</td>
                <td className="tc">
                  <span className={`lib-status ${r.status === "Paid" ? "cleared" : "pending"}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LibraryShell>
  );
}
