import RecordManager from "../../components/teacher-portal/RecordManager";

const columns = [
  { header: "Book ID", key: "bookId" },
  { header: "Book Name", key: "title" },
  { header: "Author", key: "author" },
  { header: "Category", key: "category" },
  { header: "Status", key: "status", badge: { Available: "active", Issued: "pending" } },
];

export default function Library() {
  return (
    <RecordManager
      title="Library Management"
      subtitle="Amit Group of Schools | Track books and issue status"
      icon="bi bi-journal-bookmark-fill"
      columns={columns}
      rows={[]}
      searchKey="title"
      filterField={{ key: "status", label: "Status", options: ["Available", "Issued"] }}
      addButtonLabel="Add Book"
      exportFilename="library"
      apiEndpoint="/library"
      mapResponseToRows={(response) => response.data || response}
      formFields={[
        { key: "title", label: "Book Title", required: true },
        { key: "author", label: "Author Name", required: true },
        { key: "isbn", label: "ISBN Number" },
        { key: "category", label: "Category", required: true },
        { key: "quantity", label: "Quantity", type: "number" },
        { key: "description", label: "Book Description", type: "textarea" },
        { key: "status", label: "Status", type: "select", options: ["Available", "Issued"] },
      ]}
    />
  );
}