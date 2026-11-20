import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../../context/AuthContext";
import BrandMark from "../../components/BrandMark";
import { BRAND_NAME } from "../../config/brand";
import heroImg from "../../assets/images/hero.svg";

export default function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
    } catch {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual d-none d-lg-flex">
        <BrandMark light />
        <div className="login-visual-body">
          <img src={heroImg} alt="" className="login-visual-img" />
          <h2>Learn. Grow. Succeed.</h2>
          <p>Your courses, materials and attendance in one simple portal.</p>
        </div>
        <div className="small text-white-50">© {new Date().getFullYear()} {BRAND_NAME}</div>
      </div>

      <div className="login-form-wrap">
        <div className="login-form">
          <div className="d-lg-none mb-4">
            <BrandMark />
          </div>
          <h3 className="mb-1">Welcome back</h3>
          <p className="text-muted mb-4">Sign in with the account provided by your administrator.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-icon">
                <i className="bi bi-person"></i>
                <input
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-icon">
                <i className="bi bi-lock"></i>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <button className="btn btn-primary w-100 mt-2" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="small">
              <i className="bi bi-arrow-left me-1"></i>Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
