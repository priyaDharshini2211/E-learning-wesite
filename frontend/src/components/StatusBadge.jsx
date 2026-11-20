const LABELS = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  converted: "Converted",
  lost: "Lost",
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  present: "Present",
  absent: "Absent",
  active: "Active",
  inactive: "Inactive",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge status-badge-${status}`}>
      {LABELS[status] || status}
    </span>
  );
}
