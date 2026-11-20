import { useEffect, useState } from "react";
import { listAttendance } from "../../api/coursesApi";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";

export default function StudentAttendancePage() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    listAttendance().then(setRecords);
  }, []);

  if (!records) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Your attendance history across all courses.</p>
        </div>
      </div>

      <div className="card p-3">
        <DataTable
          columns={[
            { key: "date", header: "Date" },
            { key: "course", header: "Course", render: (r) => r.course_name || r.course },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={records}
          emptyLabel="No attendance recorded yet"
        />
      </div>
    </div>
  );
}
