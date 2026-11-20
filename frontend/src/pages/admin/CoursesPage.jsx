import { useEffect, useState } from "react";
import { createCourse, createEnrollment, deleteCourse, listCourses, updateCourse } from "../../api/coursesApi";
import { listUsers } from "../../api/usersApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

const EMPTY_FORM = { name: "", duration: "", fees: "", description: "", trainers: [] };

export default function CoursesPage() {
  const [courses, setCourses] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [enrollStudent, setEnrollStudent] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const refresh = () => listCourses().then(setCourses);

  useEffect(() => {
    refresh();
    listUsers({ role: "trainer" }).then(setTrainers);
    listUsers({ role: "student" }).then(setStudents);
  }, []);

  const openEnroll = (course) => {
    setEnrollingCourse(course);
    setEnrollStudent("");
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!enrollStudent) return;
    setEnrolling(true);
    try {
      await createEnrollment({ student: Number(enrollStudent), course: enrollingCourse.id });
      setEnrollingCourse(null);
      refresh();
    } finally {
      setEnrolling(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEdit = (course) => {
    setEditingId(course.id);
    setForm({
      name: course.name,
      duration: course.duration,
      fees: course.fees,
      description: course.description,
      trainers: course.trainers,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateCourse(editingId, form);
      } else {
        await createCourse(form);
      }
      setShowForm(false);
      refresh();
    } catch {
      setError("Could not save the course. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = (course) => {
    if (confirm(`Delete course "${course.name}"?`)) deleteCourse(course.id).then(refresh);
  };

  const toggleTrainer = (id) => {
    setForm((f) => ({
      ...f,
      trainers: f.trainers.includes(id) ? f.trainers.filter((t) => t !== id) : [...f.trainers, id],
    }));
  };

  if (!courses) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Create courses and assign trainers to them.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New Course
        </button>
      </div>

      <div className="card p-3">
        <DataTable
          columns={[
            { key: "name", header: "Course" },
            { key: "duration", header: "Duration" },
            { key: "fees", header: "Fees", render: (r) => `₹${Number(r.fees).toLocaleString()}` },
            {
              key: "trainers",
              header: "Trainers",
              render: (r) =>
                r.trainer_details.length
                  ? r.trainer_details.map((t) => t.username).join(", ")
                  : "Unassigned",
            },
            { key: "student_count", header: "Students" },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(r)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openEnroll(r)}>
                    Enroll student
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={courses}
          emptyLabel="No courses yet"
        />
      </div>

      {showForm && (
        <Modal
          title={editingId ? "Edit course" : "Create course"}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save changes" : "Create"}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label">Course name</label>
              <input
                className="form-control"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Duration</label>
              <input
                className="form-control"
                placeholder="e.g. 6 months"
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div className="col-6">
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
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Trainers</label>
              <div className="d-flex flex-wrap gap-2">
                {trainers.length === 0 && <span className="text-muted small">No trainer accounts yet.</span>}
                {trainers.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    className={`btn btn-sm ${form.trainers.includes(t.id) ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => toggleTrainer(t.id)}
                  >
                    {t.username}
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="col-12">
                <div className="alert alert-danger py-2 small mb-0">{error}</div>
              </div>
            )}
          </form>
        </Modal>
      )}

      {enrollingCourse && (
        <Modal
          title={`Enroll student — ${enrollingCourse.name}`}
          onClose={() => setEnrollingCourse(null)}
          footer={
            <>
              <button className="btn btn-outline-secondary" onClick={() => setEnrollingCourse(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? "Enrolling…" : "Enroll"}
              </button>
            </>
          }
        >
          <form onSubmit={handleEnroll}>
            <label className="form-label">Student</label>
            <select
              className="form-select"
              value={enrollStudent}
              onChange={(e) => setEnrollStudent(e.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.username} ({s.email})
                </option>
              ))}
            </select>
            {students.length === 0 && <p className="text-muted small mt-2 mb-0">No student accounts yet.</p>}
          </form>
        </Modal>
      )}
    </div>
  );
}
