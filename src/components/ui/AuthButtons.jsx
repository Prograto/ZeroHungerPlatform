import { Link } from "react-router-dom";

export default function AuthButtons({
  showRegister = true,
  showLogin = true,
  align = "center"
}) {
  const alignment =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div className={`flex gap-4 ${alignment}`}>
      {showLogin && (
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
        >
          Login
        </Link>
      )}

      {showRegister && (
        <Link
          to="/register"
          className="px-5 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition font-medium"
        >
          Register
        </Link>
      )}
    </div>
  );
}
