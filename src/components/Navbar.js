import { useNavigate } from "react-router-dom";
import { logout, getProfile } from "../api";
import "../style.css";

export default function Navbar() {
  const navigate = useNavigate();
  const profile = getProfile();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="brand">
        <span className="seal">IE</span>
        Exam Review Portal
      </div>
      <div className="nav-right">
        <span>{profile.name} &middot; Student</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
