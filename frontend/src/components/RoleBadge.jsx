const LABELS = {
  admin: "Admin",
  bde: "BDE",
  lead: "Lead",
  trainer: "Trainer",
  student: "Student",
};

export default function RoleBadge({ role }) {
  return <span className={`badge role-badge-${role}`}>{LABELS[role] || role}</span>;
}
