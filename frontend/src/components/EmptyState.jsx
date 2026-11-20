export default function EmptyState({ icon = "bi-inbox", title = "Nothing here yet", subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h6 className="mb-1">{title}</h6>
      {subtitle && <p className="mb-0 small">{subtitle}</p>}
    </div>
  );
}
