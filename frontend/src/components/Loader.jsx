export default function Loader({ full }) {
  return (
    <div className={full ? "loader-wrap" : ""} style={full ? { minHeight: "100vh" } : undefined}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}
