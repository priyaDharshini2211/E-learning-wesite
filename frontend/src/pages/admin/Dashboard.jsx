import { useEffect, useState } from "react";
import { listUsers } from "../../api/usersApi";
import { listCourses } from "../../api/coursesApi";
import { listAdmissions } from "../../api/admissionsApi";
import StatCard from "../../components/StatCard";
import WelcomeBanner from "../../components/WelcomeBanner";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([listUsers(), listCourses(), listAdmissions()]).then(([users, courses, admissions]) => {
      setStats({
        users: users.length,
        trainers: users.filter((u) => u.role === "trainer").length,
        students: users.filter((u) => u.role === "student").length,
        courses: courses.length,
        admissions: admissions.length,
        converted: admissions.filter((a) => a.lead_status === "converted").length,
      });
    });
  }, []);

  if (!stats) return <Loader />;

  return (
    <div>
      <WelcomeBanner
        subtitle="Manage users, courses and admissions across the institution."
        action={{ to: "/admin/users", label: "Manage users" }}
      />

      <div className="row g-3">
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-people" tone="primary" label="Total Users" value={stats.users} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-person-video3" tone="info" label="Trainers" value={stats.trainers} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-backpack" tone="success" label="Students" value={stats.students} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-mortarboard" tone="warning" label="Courses" value={stats.courses} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-journal-text" tone="primary" label="Admissions" value={stats.admissions} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-check2-circle" tone="success" label="Converted" value={stats.converted} />
        </div>
      </div>
    </div>
  );
}
