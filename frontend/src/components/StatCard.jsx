export default function StatCard({ label, value, icon, tone = "primary" }) {
  return (
    <div className="stat-card d-flex align-items-center gap-3">
      <div className={`stat-card-icon tone-${tone}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}
