import { useState, useEffect } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor",
    address: "",
    lat: "",
    lng: ""
  });

  const [locationStatus, setLocationStatus] = useState("Detecting location...");

  // 📍 AUTO DETECT LOCATION
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("❌ Geolocation not supported by this browser");
      return;
    }

    setLocationStatus("📍 Detecting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));

        setLocationStatus(
          `✅ Location detected (±${Math.round(
            position.coords.accuracy
          )}m accuracy)`
        );
      },
      (error) => {
        console.error(error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus("❌ Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus("❌ Location information unavailable");
            break;
          case error.TIMEOUT:
            setLocationStatus("⏱ Location request timed out");
            break;
          default:
            setLocationStatus("❌ Unable to fetch location");
        }
      },
      {
        enableHighAccuracy: true, // ⭐ CRITICAL
        timeout: 10000,
        maximumAge: 0             // Do not use cached Wi-Fi location
      }
    );
  }, []);


  const handleRegister = async () => {
    const { name, email, password, phone, address, lat, lng } = form;

    // 🔒 Frontend Mandatory Validation
    if (!name || !email || !password || !phone || !address || !lat || !lng) {
      alert("All fields are mandatory");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
        phone,
        role: form.role,
        address,
        location: {
          lat,
          lng
        }
      });

      alert("Registration successful. Please login.");
      navigate("/login"); // 🔁 Redirect to Login
    } catch (err) {
        const message =
            err.response?.data?.message || "Registration failed";
            alert(message);
        }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="p-6 bg-white shadow rounded w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Register
        </h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="password"
          className="border p-2 w-full mb-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="donor">Donor</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* Latitude */}
        <input
          className="border p-2 w-full mb-2 bg-gray-100"
          placeholder="Latitude"
          value={form.lat}
          readOnly
        />

        {/* Longitude */}
        <input
          className="border p-2 w-full mb-2 bg-gray-100"
          placeholder="Longitude"
          value={form.lng}
          readOnly
        />

        <p className="text-sm text-gray-600 mb-3 text-center">
          {locationStatus}
        </p>

        <button
          onClick={handleRegister}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >
          Register
        </button>
        <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <span
                className="text-green-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
            >
                Login
            </span>
        </p>

      </div>
    </div>
  );
}
