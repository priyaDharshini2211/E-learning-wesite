import { useEffect, useState } from "react";
import { assignBDE, listAdmissions } from "../../api/admissionsApi";
import { listUsers } from "../../api/usersApi";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState(null);
  const [bdes, setBdes] = useState([]);

  const refresh = () => listAdmissions().then(setAdmissions);

  useEffect(() => {
    refresh();
    listUsers({ role: "bde" }).then(setBdes);
  }, []);

  const handleAssign = (admission, bdeId) => {
    if (!bdeId) return;
    assignBDE(admission.id, Number(bdeId)).then(refresh);
  };

  if (!admissions) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admissions</h1>
          <p className="page-subtitle">Every admission submitted by the Lead team. Assign each to a BDE for follow-up.</p>
        </div>
      </div>

      <div className="card p-3">
        <DataTable
          columns={[
            { key: "student_name", header: "Student" },
            { key: "course_name", header: "Course" },
            { key: "mobile", header: "Mobile" },
            { key: "fees", header: "Fees", render: (r) => `₹${Number(r.fees).toLocaleString()}` },
            { key: "lead_status", header: "Status", render: (r) => <StatusBadge status={r.lead_status} /> },
            {
              key: "assigned_bde",
              header: "Assigned BDE",
              render: (r) => (
                <select
                  className="form-select form-select-sm"
                  style={{ minWidth: 140 }}
                  defaultValue={r.assigned_bde || ""}
                  onChange={(e) => handleAssign(r, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {bdes.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.username}
                    </option>
                  ))}
                </select>
              ),
            },
            { key: "created_by_name", header: "Submitted by" },
          ]}
          rows={admissions}
          emptyLabel="No admissions submitted yet"
        />
      </div>
    </div>
  );
}
