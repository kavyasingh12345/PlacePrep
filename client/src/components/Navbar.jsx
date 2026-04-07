import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
        Place<span className="text-gray-900">Prep</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
      {user ? (
  <>
    {/* STUDENT NAVBAR */}
    {user.role === "student" && (
      <>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/progress">My Progress</Link>
      </>
    )}

    {/* INSTRUCTOR NAVBAR */}
    {user.role === "instructor" && (
      <Link to="/instructor">Instructor Dashboard</Link>
    )}

    {/* ADMIN NAVBAR */}
    {user.role === "admin" && (
      <Link to="/admin">Admin Dashboard</Link>
    )}

    {/* Avatar + Logout */}
    <button onClick={handleLogout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </>
)}
      </div>
    </nav>
  );
}
