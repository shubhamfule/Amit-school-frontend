import PageHeader from "./PageHeader";

export default function ComingSoon({ title }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="coming-soon">
        <i className="bi bi-cone-striped"></i>
        <p>This module is coming soon.</p>
      </div>
    </div>
  );
}
