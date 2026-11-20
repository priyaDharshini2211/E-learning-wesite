import { useEffect, useState } from "react";
import { listCourses } from "../../api/coursesApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

export default function TrainerCoursesPage() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    listCourses().then(setCourses);
  }, []);

  if (!courses) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">Courses you're assigned to teach.</p>
        </div>
      </div>

      {courses.length === 0 && <EmptyState title="No courses assigned yet" />}

      <div className="row g-3">
        {courses.map((c) => (
          <div className="col-md-6 col-lg-4" key={c.id}>
            <div className="card p-3 h-100">
              <h6 className="mb-1">{c.name}</h6>
              <p className="text-muted small mb-2">{c.description || "No description provided."}</p>
              <div className="d-flex justify-content-between small text-muted">
                <span>{c.duration}</span>
                <span>₹{Number(c.fees).toLocaleString()}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between small">
                <span>{c.student_count} students</span>
                <span>{c.videos.length} videos · {c.materials.length} materials</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
