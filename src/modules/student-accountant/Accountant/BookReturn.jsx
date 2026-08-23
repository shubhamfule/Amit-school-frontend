import LibraryShell, { LibAvatar } from "./LibraryShell";
import { bookReturns } from "./libraryData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function conditionClass(cond) {
  if (cond === "Good") return "cleared";
  if (cond === "Damaged") return "pending";
  return "issued";
}

export default function BookReturn() {
  return (
    <LibraryShell icon="bi bi-journal-check" title="Book return records" count={bookReturns.length}>
      <div className="lib-table-wrap">
        <table className="lib-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="tc">User Type</th>
              <th className="tc">Book ID</th>
              <th className="tc">Book Name</th>
              <th className="tc">Return Date</th>
              <th className="tc">Condition</th>
              <th className="tc">Fine</th>
            </tr>
          </thead>
          <tbody>
            {bookReturns.map((r) => (
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
                <td className="tc">{r.returnDate}</td>
                <td className="tc">
                  <span className={`lib-status ${conditionClass(r.condition)}`}>{r.condition}</span>
                </td>
                <td className="tc">{r.fine ? inr(r.fine) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LibraryShell>
  );
}
