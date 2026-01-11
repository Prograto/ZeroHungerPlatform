import { useNavigate } from "react-router-dom";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button
      onClick={logout}
      className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm ${className}`}
    >
      Logout
    </button>
  );
}
