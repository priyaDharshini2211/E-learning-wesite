import { useEffect, useState } from "react";
import { listAttendance, listCourses, listEnrollments, markAttendance, updateAttendance } from "../../api/coursesApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const today = () => new Date().toISOString().slice(0, 10);

export default function AttendancePage() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(today());
  const [students, setStudents] = useState(null);
  const [existingIds, setExistingIds] = useState({});
  const [existing, setExisting] = useState({});
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listCourses().then((data) => {
      setCourses(data);
      if (data.length) setCourseId(String(data[0].id));
    });
  }, []);

  useEffect(() => {
    if (!courseId) return;
    setStudents(null);
    setMessage("");
    Promise.all([
      listEnrollments({ course: courseId }),
      listAttendance({ course: courseId }),
    ]).then(([enrollments, attendance]) => {
      setStudents(enrollments);
      const forDate = {};
      const idsForDate = {};
      attendance
        .filter((a) => a.date === date)
        .forEach((a) => {
          forDate[a.student] = a.status;
          idsForDate[a.student] = a.id;
        });
      setExisting(forDate);
      setExistingIds(idsForDate);
      setMarks(forDate);
    });
  }, [courseId, date]);

  const setMark = (studentId, status) => setMarks((m) => ({ ...m, [studentId]: status }));

  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");
    try {
      const toSave = students.filter((s) => marks[s.student] && marks[s.student] !== existing[s.student]);
      await Promise.all(
        toSave.map((s) =>
          existingIds[s.student]
            ? updateAttendance(existingIds[s.student], { status: marks[s.student] })
            : markAttendance({ student: s.student, course: Number(courseId), date, status: marks[s.student] }),
        ),
      );
      setExisting({ ...marks });
      setMessage("Attendance saved.");
    } catch {
      setMessage("Could not save attendance. Some rows may already be marked for this date.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Mark daily attendance for your course.</p>
        </div>
      </div>

      <div className="card p-3 mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Course</label>
            <select className="form-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleSubmit} disabled={saving || !students?.length}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-info py-2 small">{message}</div>}

      <div className="card p-3">
        {students === null ? (
          <Loader />
        ) : students.length === 0 ? (
          <EmptyState title="No students enrolled in this course yet" />
        ) : (
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.student}>
                  <td>{s.student_name}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className={`btn ${marks[s.student] === "present" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setMark(s.student, "present")}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        className={`btn ${marks[s.student] === "absent" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setMark(s.student, "absent")}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
