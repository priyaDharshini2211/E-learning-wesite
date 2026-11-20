import { useEffect, useState } from "react";
import { listAdmissions } from "../../api/admissionsApi";
import StatCard from "../../components/StatCard";
import WelcomeBanner from "../../components/WelcomeBanner";
import Loader from "../../components/Loader";

export default function BdeDashboard() {
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    listAdmissions().then(setLeads);
  }, []);

  if (!leads) return <Loader />;

  const count = (status) => leads.filter((l) => l.lead_status === status).length;

  return (
    <div>
      <WelcomeBanner
        subtitle="Follow up on the admissions assigned to you and keep their status current."
        action={{ to: "/bde/leads", label: "Open my leads" }}
      />

      <div className="row g-3">
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-collection" tone="primary" label="Total" value={leads.length} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-stars" tone="info" label="New" value={count("new")} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-telephone" tone="primary" label="Contacted" value={count("contacted")} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-star" tone="warning" label="Interested" value={count("interested")} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-check2-circle" tone="success" label="Converted" value={count("converted")} />
        </div>
        <div className="col-6 col-lg-4 col-xl-2">
          <StatCard icon="bi-x-circle" tone="danger" label="Lost" value={count("lost")} />
        </div>
      </div>
    </div>
  );
}
