import { useEffect, useState } from "react";
import { listCourses, listEnrollments, submitFeedback } from "../../api/coursesApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState(null);
  const [enrollments, setEnrollments] = useState(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [sent, setSent] = useState({});

  useEffect(() => {
    listCourses().then(setCourses);
    listEnrollments().then(setEnrollments);
  }, []);

  if (!courses || !enrollments) return <Loader />;

  const statusFor = (courseId) =>
    enrollments.find((e) => e.course === courseId)?.completion_status || "not_started";

  const handleFeedback = async (courseId) => {
    const draft = feedbackDrafts[courseId];
    if (!draft?.message) return;
    setSubmitting(courseId);
    try {
      await submitFeedback({ course: courseId, message: draft.message, rating: draft.rating || 5 });
      setSent({ ...sent, [courseId]: true });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">Courses you're enrolled in, with materials and videos.</p>
        </div>
      </div>

      {courses.length === 0 && <EmptyState title="You're not enrolled in any course yet" />}

      <div className="d-flex flex-column gap-3">
        {courses.map((c) => (
          <div className="card p-3" key={c.id}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{c.name}</h6>
                <p className="text-muted small mb-0">{c.description}</p>
              </div>
              <StatusBadge status={statusFor(c.id)} />
            </div>

            <div className="row mt-3 g-3">
              <div className="col-md-6">
                <div className="small fw-semibold mb-1">Videos</div>
                {c.videos.length ? (
                  <ul className="list-unstyled small mb-0">
                    {c.videos.map((v) => (
                      <li key={v.id}>
                        <a href={v.file} target="_blank" rel="noreferrer">
                          ▶ {v.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted small">No videos yet</span>
                )}
              </div>
              <div className="col-md-6">
                <div className="small fw-semibold mb-1">Study material</div>
                {c.materials.length ? (
                  <ul className="list-unstyled small mb-0">
                    {c.materials.map((m) => (
                      <li key={m.id}>
                        <a href={m.file} target="_blank" rel="noreferrer">
                          📄 {m.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted small">No materials yet</span>
                )}
              </div>
            </div>

            <hr />
            <div className="small fw-semibold mb-2">Leave feedback</div>
            {sent[c.id] ? (
              <div className="alert alert-success py-2 small mb-0">Thanks for your feedback!</div>
            ) : (
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  style={{ maxWidth: 90 }}
                  value={feedbackDrafts[c.id]?.rating || 5}
                  onChange={(e) =>
                    setFeedbackDrafts({
                      ...feedbackDrafts,
                      [c.id]: { ...feedbackDrafts[c.id], rating: Number(e.target.value) },
                    })
                  }
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ⭐
                    </option>
                  ))}
                </select>
                <input
                  className="form-control form-control-sm"
                  placeholder="Share your thoughts…"
                  value={feedbackDrafts[c.id]?.message || ""}
                  onChange={(e) =>
                    setFeedbackDrafts({
                      ...feedbackDrafts,
                      [c.id]: { ...feedbackDrafts[c.id], message: e.target.value },
                    })
                  }
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleFeedback(c.id)}
                  disabled={submitting === c.id}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
