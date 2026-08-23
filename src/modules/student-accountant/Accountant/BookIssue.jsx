import LibraryShell, { LibAvatar } from "./LibraryShell";
import { bookIssues } from "./libraryData";

function statusClass(status) {
  if (status === "Returned") return "cleared";
  if (status === "Overdue") return "pending";
  return "issued";
}

export default function BookIssue() {
  return (
    <LibraryShell icon="bi bi-journal-plus" title="Book issue records" count={bookIssues.length}>
      <div className="lib-table-wrap">
        <table className="lib-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="tc">User Type</th>
              <th className="tc">Book ID</th>
              <th className="tc">Book Name</th>
              <th className="tc">Issue Date</th>
              <th className="tc">Due Date</th>
              <th className="tc">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookIssues.map((r) => (
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
                <td className="tc">{r.issueDate}</td>
                <td className="tc">{r.dueDate}</td>
                <td className="tc">
                  <span className={`lib-status ${statusClass(r.status)}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LibraryShell>
  );
}
