import { useEffect, useState } from "react";
import {
  deleteMaterial,
  deleteVideo,
  listCourses,
  uploadMaterial,
  uploadVideo,
} from "../../api/coursesApi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

export default function MaterialsPage() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialFile, setMaterialFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const refresh = () =>
    listCourses().then((data) => {
      setCourses(data);
      if (!courseId && data.length) setCourseId(String(data[0].id));
    });

  useEffect(() => {
    refresh();
  }, []);

  const course = courses.find((c) => String(c.id) === courseId);

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoFile) return;
    setUploading(true);
    try {
      await uploadVideo({ course: Number(courseId), title: videoTitle, file: videoFile });
      setVideoTitle("");
      setVideoFile(null);
      e.target.reset();
      refresh();
    } finally {
      setUploading(false);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!materialFile) return;
    setUploading(true);
    try {
      await uploadMaterial({ course: Number(courseId), title: materialTitle, file: materialFile });
      setMaterialTitle("");
      setMaterialFile(null);
      e.target.reset();
      refresh();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Materials</h1>
          <p className="page-subtitle">Upload videos and study material for your courses.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="card p-3 mb-3">
            <label className="form-label">Course</label>
            <select className="form-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="card p-3 h-100">
                <h6>Videos</h6>
                <form onSubmit={handleUploadVideo} className="d-flex flex-column gap-2 mb-3">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Video title"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control form-control-sm"
                    required
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                  <button className="btn btn-sm btn-primary" disabled={uploading}>
                    {uploading ? "Uploading…" : "Upload video"}
                  </button>
                </form>
                {course?.videos.length ? (
                  <ul className="list-group list-group-flush">
                    {course.videos.map((v) => (
                      <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <span className="small">{v.title}</span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteVideo(v.id).then(refresh)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="No videos uploaded" />
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card p-3 h-100">
                <h6>Study material</h6>
                <form onSubmit={handleUploadMaterial} className="d-flex flex-column gap-2 mb-3">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Material title"
                    required
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                  />
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    required
                    onChange={(e) => setMaterialFile(e.target.files[0])}
                  />
                  <button className="btn btn-sm btn-primary" disabled={uploading}>
                    {uploading ? "Uploading…" : "Upload material"}
                  </button>
                </form>
                {course?.materials.length ? (
                  <ul className="list-group list-group-flush">
                    {course.materials.map((m) => (
                      <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <span className="small">{m.title}</span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteMaterial(m.id).then(refresh)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="No study material uploaded" />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
