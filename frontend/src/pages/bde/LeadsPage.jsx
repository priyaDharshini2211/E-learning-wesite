import { useEffect, useState } from "react";
import { listAdmissions, updateLeadStatus } from "../../api/admissionsApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";

const STATUSES = ["new", "contacted", "interested", "converted", "lost"];

export default function LeadsPage() {
  const [leads, setLeads] = useState(null);
  const [editing, setEditing] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => listAdmissions().then(setLeads);

  useEffect(() => {
    refresh();
  }, []);

  const openEdit = (lead) => {
    setEditing(lead);
    setStatusValue(lead.lead_status);
    setNotes(lead.notes || "");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateLeadStatus(editing.id, { lead_status: statusValue, notes });
      setEditing(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  if (!leads) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leads</h1>
          <p className="page-subtitle">Update the follow-up status as you work each lead.</p>
        </div>
      </div>

      <div className="card p-3">
        <DataTable
          columns={[
            { key: "student_name", header: "Student" },
            { key: "course_name", header: "Course" },
            { key: "mobile", header: "Mobile" },
            { key: "email", header: "Email" },
            { key: "lead_status", header: "Status", render: (r) => <StatusBadge status={r.lead_status} /> },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(r)}>
                  Update
                </button>
              ),
            },
          ]}
          rows={leads}
          emptyLabel="No leads assigned to you yet"
        />
      </div>

      {editing && (
        <Modal
          title={`Update status — ${editing.student_name}`}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn btn-outline-secondary" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          }
        >
          <form onSubmit={handleSave} className="row g-3">
            <div className="col-12">
              <label className="form-label">Status</label>
              <select className="form-select" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
