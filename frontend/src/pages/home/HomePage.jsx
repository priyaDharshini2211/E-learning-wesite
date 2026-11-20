import { Link } from "react-router-dom";
import { ROLE_HOME, useAuth } from "../../context/AuthContext";
import BrandMark from "../../components/BrandMark";
import { BRAND_NAME } from "../../config/brand";
import heroImg from "../../assets/images/hero.svg";
import aboutImg from "../../assets/images/about.svg";
import webImg from "../../assets/images/course-web.svg";
import dataImg from "../../assets/images/course-data.svg";
import designImg from "../../assets/images/course-design.svg";
import marketingImg from "../../assets/images/course-marketing.svg";

const PROGRAMS = [
  { title: "Full Stack Web Development", duration: "6 months", level: "Beginner friendly", img: webImg },
  { title: "Data Science & Analytics", duration: "5 months", level: "Intermediate", img: dataImg },
  { title: "UI / UX Design", duration: "4 months", level: "Beginner friendly", img: designImg },
  { title: "Digital Marketing", duration: "3 months", level: "Beginner friendly", img: marketingImg },
];

const STATS = [
  { value: "1,200+", label: "Learners guided" },
  { value: "40+", label: "Expert trainers" },
  { value: "25+", label: "Career programs" },
  { value: "95%", label: "Attendance tracked" },
];

const FEATURES = [
  { icon: "bi-person-video3", title: "Expert trainers", text: "Learn from practitioners who mentor every batch." },
  { icon: "bi-play-circle", title: "Recorded lessons", text: "Watch course videos anytime, at your own pace." },
  { icon: "bi-journal-bookmark", title: "Study material", text: "Notes and resources shared by your trainer in one place." },
  { icon: "bi-calendar-check", title: "Attendance tracking", text: "Follow your attendance and course progress live." },
];

const STEPS = [
  { icon: "bi-chat-dots", title: "Enquire", text: "Talk to our admissions team about the right program." },
  { icon: "bi-person-check", title: "Get admitted", text: "Complete the admission form and receive your portal login." },
  { icon: "bi-rocket-takeoff", title: "Start learning", text: "Access courses, materials and attendance from your dashboard." },
];

export default function HomePage() {
  const { user } = useAuth();
  const portalLink = user ? ROLE_HOME[user.role] : "/login";

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="container d-flex align-items-center justify-content-between">
          <BrandMark />
          <div className="home-nav-links d-none d-md-flex">
            <a href="#programs">Programs</a>
            <a href="#about">About</a>
            <a href="#how">How it works</a>
          </div>
          <Link to={portalLink} className="btn btn-primary btn-pill">
            {user ? "Go to dashboard" : "Portal login"}
          </Link>
        </div>
      </nav>

      <header className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow">Admissions open</span>
              <h1 className="hero-title">
                Build skills that <span className="text-gradient">shape your career</span>
              </h1>
              <p className="hero-sub">
                {BRAND_NAME} brings expert-led programs, recorded lessons and a simple learning portal together, so
                you can focus on growing.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to={portalLink} className="btn btn-primary btn-lg btn-pill">
                  {user ? "Go to dashboard" : "Student login"}
                </Link>
                <a href="#programs" className="btn btn-outline-primary btn-lg btn-pill">
                  Explore programs
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <img src={heroImg} alt="Learning platform illustration" className="hero-img" />
            </div>
          </div>
        </div>
      </header>

      <section className="home-stats">
        <div className="container">
          <div className="row g-3">
            {STATS.map((s) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="home-stat">
                  <div className="home-stat-value">{s.value}</div>
                  <div className="home-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" id="programs">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Programs</span>
            <h2>Popular programs to get you job ready</h2>
          </div>
          <div className="row g-4">
            {PROGRAMS.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p.title}>
                <div className="program-card">
                  <img src={p.img} alt={p.title} />
                  <div className="program-body">
                    <h6>{p.title}</h6>
                    <div className="program-meta">
                      <span>
                        <i className="bi bi-clock me-1"></i>
                        {p.duration}
                      </span>
                      <span>{p.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section bg-white" id="about">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <img src={aboutImg} alt="Srinav campus illustration" className="about-img" />
            </div>
            <div className="col-lg-7">
              <span className="eyebrow">Why {BRAND_NAME}</span>
              <h2 className="mb-4">Everything you need to learn, in one portal</h2>
              <div className="row g-3">
                {FEATURES.map((f) => (
                  <div className="col-sm-6" key={f.title}>
                    <div className="feature">
                      <div className="feature-icon">
                        <i className={`bi ${f.icon}`}></i>
                      </div>
                      <div>
                        <h6>{f.title}</h6>
                        <p>{f.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>From enquiry to classroom in three steps</h2>
          </div>
          <div className="row g-4">
            {STEPS.map((s, i) => (
              <div className="col-md-4" key={s.title}>
                <div className="step-card">
                  <div className="step-number">{i + 1}</div>
                  <div className="feature-icon mb-3">
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <h6>{s.title}</h6>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container">
          <div className="cta-box">
            <div>
              <h2>Ready to start learning?</h2>
              <p>Sign in to your portal to access courses, materials and attendance.</p>
            </div>
            <Link to={portalLink} className="btn btn-light btn-lg btn-pill fw-semibold">
              {user ? "Go to dashboard" : "Portal login"}
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <BrandMark light />
          <div className="small">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
