import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bannerArt from "../assets/images/banner-art.svg";

export default function WelcomeBanner({ subtitle, action }) {
  const { user } = useAuth();
  const name = user.first_name || user.username;

  return (
    <div className="welcome-banner">
      <div>
        <div className="welcome-eyebrow">Welcome back</div>
        <h1 className="welcome-title">Hello, {name}</h1>
        <p className="welcome-sub">{subtitle}</p>
        {action && (
          <Link to={action.to} className="btn btn-light btn-sm fw-semibold mt-1">
            {action.label}
          </Link>
        )}
      </div>
      <img src={bannerArt} alt="" className="welcome-art" />
    </div>
  );
}
