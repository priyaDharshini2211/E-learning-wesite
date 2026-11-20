import { useEffect, useState } from "react";
import { listCourses, listFeedback } from "../../api/coursesApi";
import StatCard from "../../components/StatCard";
import WelcomeBanner from "../../components/WelcomeBanner";
import Loader from "../../components/Loader";

export default function TrainerDashboard() {
  const [courses, setCourses] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    listCourses().then(setCourses);
    listFeedback().then(setFeedback);
  }, []);

  if (!courses || !feedback) return <Loader />;

  const totalStudents = courses.reduce((sum, c) => sum + c.student_count, 0);
  const pending = feedback.filter((f) => !f.trainer_response).length;

  return (
    <div>
      <WelcomeBanner
        subtitle="Mark attendance, share materials and respond to student feedback."
        action={{ to: "/trainer/attendance", label: "Mark attendance" }}
      />

      <div className="row g-3">
        <div className="col-md-4">
          <StatCard icon="bi-mortarboard" tone="primary" label="My Courses" value={courses.length} />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-backpack" tone="success" label="Students" value={totalStudents} />
        </div>
        <div className="col-md-4">
          <StatCard icon="bi-chat-square-heart" tone="warning" label="Pending Feedback" value={pending} />
        </div>
      </div>
    </div>
  );
}
