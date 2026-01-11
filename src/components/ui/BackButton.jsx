import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Back", className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 transition text-sm ${className}`}
    >
      ⬅ {label}
    </button>
  );
}
