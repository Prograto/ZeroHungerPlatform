import { useState } from "react";
import { loginUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const data = await loginUser({ email, password });

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);

        navigate("/dashboard");
    } catch (err) {
        alert(err.response?.data?.message || "Login failed");
    }
};


  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow rounded w-96">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-green-600 text-white w-full py-2"
        >
          Login
        </button>

        <p className="mt-3 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
