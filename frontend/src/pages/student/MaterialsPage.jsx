import { useEffect, useState } from "react";
import { listCourses } from "../../api/coursesApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

export default function StudentMaterialsPage() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    listCourses().then(setCourses);
  }, []);

  if (!courses) return <Loader />;

  const hasAny = courses.some((c) => c.videos.length || c.materials.length);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Materials</h1>
          <p className="page-subtitle">Videos and study material from your enrolled courses.</p>
        </div>
      </div>

      {!hasAny && <EmptyState title="No materials available yet" />}

      <div className="d-flex flex-column gap-3">
        {courses
          .filter((c) => c.videos.length || c.materials.length)
          .map((c) => (
            <div className="card p-3" key={c.id}>
              <h6 className="mb-3">{c.name}</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="small fw-semibold mb-1">Videos</div>
                  <ul className="list-unstyled small mb-0">
                    {c.videos.map((v) => (
                      <li key={v.id}>
                        <a href={v.file} target="_blank" rel="noreferrer">
                          ▶ {v.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <div className="small fw-semibold mb-1">Study material</div>
                  <ul className="list-unstyled small mb-0">
                    {c.materials.map((m) => (
                      <li key={m.id}>
                        <a href={m.file} target="_blank" rel="noreferrer">
                          📄 {m.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
