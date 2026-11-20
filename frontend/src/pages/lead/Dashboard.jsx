import { useEffect, useState } from "react";
import { listAdmissions } from "../../api/admissionsApi";
import StatCard from "../../components/StatCard";
import WelcomeBanner from "../../components/WelcomeBanner";
import Loader from "../../components/Loader";

export default function LeadDashboard() {
  const [admissions, setAdmissions] = useState(null);

  useEffect(() => {
    listAdmissions().then(setAdmissions);
  }, []);

  if (!admissions) return <Loader />;

  return (
    <div>
      <WelcomeBanner
        subtitle="Register new student admissions and track the ones you've submitted."
        action={{ to: "/lead/new-admission", label: "New admission" }}
      />

      <div className="row g-3">
        <div className="col-md-4">
          <StatCard icon="bi-journal-text" tone="primary" label="Total Submitted" value={admissions.length} />
        </div>
        <div className="col-md-4">
          <StatCard
            icon="bi-check2-circle"
            tone="success"
            label="Converted"
            value={admissions.filter((a) => a.lead_status === "converted").length}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            icon="bi-hourglass-split"
            tone="warning"
            label="In progress"
            value={admissions.filter((a) => !["converted", "lost"].includes(a.lead_status)).length}
          />
        </div>
      </div>
    </div>
  );
}
