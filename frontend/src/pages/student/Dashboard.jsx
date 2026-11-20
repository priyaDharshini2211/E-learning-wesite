import { useEffect, useState } from "react";
import { listAttendance, listEnrollments } from "../../api/coursesApi";
import StatCard from "../../components/StatCard";
import WelcomeBanner from "../../components/WelcomeBanner";
import Loader from "../../components/Loader";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState(null);
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    listEnrollments().then(setEnrollments);
    listAttendance().then(setAttendance);
  }, []);

  if (!enrollments || !attendance) return <Loader />;

  const present = attendance.filter((a) => a.status === "present").length;
  const attendancePct = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const completed = enrollments.filter((e) => e.completion_status === "completed").length;

  return (
    <div>
      <WelcomeBanner
        subtitle="Pick up where you left off with your courses, materials and attendance."
        action={{ to: "/student/courses", label: "Go to my courses" }}
      />

      <div className="row g-3">
        <div className="col-md-4">
          <StatCard icon="bi-mortarboard" tone="primary" label="Enrolled Courses" value={enrollments.length} />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-check2-circle" tone="success" label="Completed" value={completed} />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-calendar-check" tone="info" label="Attendance" value={`${attendancePct}%`} />
        </div>
      </div>
    </div>
  );
}
