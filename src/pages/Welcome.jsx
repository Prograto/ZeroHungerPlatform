import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icon from "./icon.png";
import {
  getPublicStats,
  getPublicDonors,
  getPublicVolunteers,
  getPublicDeliveries
} from "../api/food";

export default function Welcome() {
  const [stats, setStats] = useState({});
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setStats(await getPublicStats());
    setDonors(await getPublicDonors());
    setVolunteers(await getPublicVolunteers());
    setDeliveries(await getPublicDeliveries());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={icon} alt="Zero Hunger" className="h-8 w-8" />
          <h1 className="text-lg font-semibold text-green-700">
            Zero Hunger Platform
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded border border-green-600 text-green-700 hover:bg-green-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          A Plate of Food Can Change a Life
        </h2>
        <p className="max-w-3xl mx-auto text-green-100 text-lg">
          Zero Hunger connects surplus food from donors with volunteers who
          ensure it reaches people in need — safely, quickly, and with dignity.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
          >
            Become a Donor
          </Link>
          <Link
            to="/register"
            className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-700 transition"
          >
            Become a Volunteer
          </Link>
        </div>
      </section>

      {/* ================= PLATFORM STATS ================= */}
      <section className="px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat title="Food Posted" value={stats.totalPosted} />
          <Stat title="Delivered" value={stats.totalDelivered} />
          <Stat title="Expired" value={stats.totalExpired} />
          <Stat title="Donors" value={stats.donors} />
          <Stat title="Volunteers" value={stats.volunteers} />
        </div>
      </section>

      {/* ================= ROLES SECTION ================= */}
      <section className="px-6 py-12 bg-white">
        <h3 className="text-2xl font-semibold text-center mb-10">
          How You Can Make an Impact
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* DONOR CARD */}
          <RoleCard
            title="Food Donors"
            subtitle="You reduce waste. You feed lives."
            points={[
              "Post surplus food or near-expiry items",
              "Ensure food safety and quality",
              "Support your local community",
              "Track how many meals you helped deliver"
            ]}
            quote="“Donating surplus food isn’t charity — it’s responsibility.”"
          />

          {/* VOLUNTEER CARD */}
          <RoleCard
            title="Volunteers"
            subtitle="You are the bridge between food and hope."
            points={[
              "Pick up food before it expires",
              "Deliver to shelters or needy locations",
              "Upload delivery proof for transparency",
              "Earn Karma Points for every delivery"
            ]}
            quote="“No act of kindness, no matter how small, is ever wasted.”"
          />
        </div>
      </section>

      {/* ================= DONORS & VOLUNTEERS SCROLL ================= */}
      <section className="px-6 py-12 bg-slate-50">
        <h3 className="text-xl font-semibold text-center mb-8">
          Our Community
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* DONORS LIST */}
          <ScrollBox title="Our Donors 🙌" items={donors} />

          {/* VOLUNTEERS LIST */}
          <ScrollBox title="Our Volunteers 🚚" items={volunteers} />
        </div>
      </section>

      {/* ================= KARMA POINTS ================= */}
      <section className="px-6 py-12 bg-white text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Karma Points – More Than Just Numbers ⭐
        </h3>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          Karma Points recognize the effort of volunteers who successfully
          deliver food. Each delivery increases your Karma — building trust,
          credibility, and a portfolio of social impact.
        </p>
        <p className="mt-4 text-green-700 font-medium">
          Deliver food. Earn trust. Create impact.
        </p>
      </section>

      {/* ================= SUCCESSFUL DELIVERIES ================= */}
      <section className="px-6 py-12 bg-slate-50">
        <h3 className="text-xl font-semibold mb-6">
          Recent Successful Deliveries
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {deliveries.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              {d.deliveryImage && (
                <img
                  src={d.deliveryImage}
                  alt="Delivery proof"
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="p-4">
                <p className="font-semibold">{d.foodName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(d.deliveredAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto bg-white border-t px-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Zero Hunger Platform
        <div className="text-xs opacity-60 mt-1">prograto</div>
      </footer>

      {/* WATERMARK */}
      <span className="fixed bottom-2 right-3 text-xs text-gray-300 select-none">
        prograto
      </span>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow text-center hover:scale-105 transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-green-700 mt-1">
        {value ?? 0}
      </p>
    </div>
  );
}

function RoleCard({ title, subtitle, points, quote }) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl shadow">
      <h4 className="text-xl font-semibold text-green-700 mb-1">
        {title}
      </h4>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

      <ul className="list-disc list-inside text-gray-700 mb-4">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <p className="italic text-gray-500 text-sm">{quote}</p>
    </div>
  );
}

function ScrollBox({ title, items }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 h-56 overflow-hidden">
      <h4 className="font-semibold mb-3 text-center">{title}</h4>
      <div className="space-y-3 animate-vertical-scroll">
        {items.map((u) => (
          <div key={u._id} className="text-gray-700 text-sm">
            • {u.name}
          </div>
        ))}
      </div>
    </div>
  );
}
