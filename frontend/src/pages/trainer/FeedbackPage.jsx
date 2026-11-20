import { useEffect, useState } from "react";
import { listFeedback, respondFeedback } from "../../api/coursesApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const refresh = () => listFeedback().then(setFeedback);

  useEffect(() => {
    refresh();
  }, []);

  const handleRespond = async (item) => {
    setSavingId(item.id);
    try {
      await respondFeedback(item.id, drafts[item.id] ?? item.trainer_response);
      refresh();
    } finally {
      setSavingId(null);
    }
  };

  if (!feedback) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Feedback</h1>
          <p className="page-subtitle">Student feedback on your courses.</p>
        </div>
      </div>

      {feedback.length === 0 && <EmptyState title="No feedback submitted yet" />}

      <div className="d-flex flex-column gap-3">
        {feedback.map((f) => (
          <div className="card p-3" key={f.id}>
            <div className="d-flex justify-content-between">
              <div>
                <strong>{f.student_name}</strong>
                <span className="text-muted"> · {f.course_name}</span>
              </div>
              <div>{"⭐".repeat(f.rating)}</div>
            </div>
            <p className="mb-2 mt-2">{f.message}</p>
            <textarea
              className="form-control form-control-sm mb-2"
              rows="2"
              placeholder="Write a response…"
              value={drafts[f.id] ?? f.trainer_response ?? ""}
              onChange={(e) => setDrafts({ ...drafts, [f.id]: e.target.value })}
            />
            <button
              className="btn btn-sm btn-primary align-self-start"
              onClick={() => handleRespond(f)}
              disabled={savingId === f.id}
            >
              {savingId === f.id ? "Saving…" : "Save response"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
