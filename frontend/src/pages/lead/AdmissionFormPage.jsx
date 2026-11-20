import { useEffect, useState } from "react";
import { createAdmission, listAdmissions } from "../../api/admissionsApi";
import { listCourses } from "../../api/coursesApi";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";

const EMPTY_FORM = { student_name: "", mobile: "", email: "", degree: "", course: "", fees: "", duration: "" };

export default function AdmissionFormPage() {
  const [courses, setCourses] = useState([]);
  const [admissions, setAdmissions] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const refresh = () => listAdmissions().then(setAdmissions);

  useEffect(() => {
    listCourses().then(setCourses);
    refresh();
  }, []);

  const handleCourseChange = (courseId) => {
    const course = courses.find((c) => String(c.id) === courseId);
    setForm({ ...form, course: courseId, fees: course?.fees || "", duration: course?.duration || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await createAdmission(form);
      setForm(EMPTY_FORM);
      setSuccess("Admission submitted successfully.");
      refresh();
    } catch {
      setError("Could not submit the admission. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">New Admission</h1>
          <p className="page-subtitle">Fill in the student's admission details.</p>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Student name</label>
            <input
              className="form-control"
              required
              value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              required
              value={form.course}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Mobile</label>
            <input
              className="form-control"
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Degree</label>
            <input
              className="form-control"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fees</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              required
              value={form.fees}
              onChange={(e) => setForm({ ...form, fees: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Duration</label>
            <input
              className="form-control"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>

          {error && (
            <div className="col-12">
              <div className="alert alert-danger py-2 small mb-0">{error}</div>
            </div>
          )}
          {success && (
            <div className="col-12">
              <div className="alert alert-success py-2 small mb-0">{success}</div>
            </div>
          )}

          <div className="col-12">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Submitting…" : "Submit Admission"}
            </button>
          </div>
        </form>
      </div>

      <h6 className="mb-3">Recent submissions</h6>
      <div className="card p-3">
        {admissions === null ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { key: "student_name", header: "Student" },
              { key: "course_name", header: "Course" },
              { key: "lead_status", header: "Status", render: (r) => <StatusBadge status={r.lead_status} /> },
            ]}
            rows={admissions}
            emptyLabel="No admissions submitted yet"
          />
        )}
      </div>
    </div>
  );
}
