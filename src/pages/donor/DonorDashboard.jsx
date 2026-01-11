import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDonorStats,
  getPlatformStats,
  getDonorProfile,
  getAvailableFoods
} from "../../api/food";

const PAGE_SIZE = 5;

export default function DonorDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, delivered: 0, expired: 0 });
  const [platformStats, setPlatformStats] = useState({
    totalPosted: 0,
    totalDelivered: 0,
    totalExpired: 0
  });

  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // ⚡ Load lightweight data first
      const [p, s, ps] = await Promise.all([
        getDonorProfile(),
        getDonorStats(),
        getPlatformStats()
      ]);

      setProfile(p);
      setStats(s);
      setPlatformStats(ps);
      setLoading(false);

      // 🐢 Load heavy list after UI is visible
      setFoodsLoading(true);
      const f = await getAvailableFoods();
      setFoods(Array.isArray(f) ? f : []);
      setFoodsLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalPages = Math.max(1, Math.ceil(foods.length / PAGE_SIZE));
  const paginatedFoods = foods.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* ================= HEADER ================= */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            Donor Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Thank you for helping fight hunger 💚
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 transition"
          >
            ⬅ Back
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        {/* ================= PROFILE ================= */}
        <section className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-600">
              📞 {profile.phone || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Joined on{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-center">
            <p className="text-sm text-gray-500">Karma Points</p>
            <p className="text-5xl font-bold text-purple-600">
              ⭐ {profile.karmaPoints || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Earned when your food is delivered
            </p>
          </div>
        </section>

        {/* ================= YOUR CONTRIBUTION ================= */}
        <Section title="Your Contribution">
          <StatGrid>
            <StatCard title="Total Posted" value={stats.total} color="emerald" />
            <StatCard title="Delivered" value={stats.delivered} color="green" />
            <StatCard title="Expired" value={stats.expired} color="red" />
          </StatGrid>
        </Section>

        {/* ================= QUICK ACTIONS ================= */}
        <Section title="Quick Actions">
          <div className="grid md:grid-cols-2 gap-4">
            <ActionCard to="/donor/add-food" label="➕ Add Food / Items" />
            <ActionCard to="/donor/my-foods" label="📋 My Posted Foods" />
          </div>
        </Section>

        {/* ================= PLATFORM STATS ================= */}
        <Section title="Platform Impact">
          <StatGrid>
            <StatCard
              title="Total Items Posted"
              value={platformStats.totalPosted}
              color="emerald"
            />
            <StatCard
              title="Total Delivered"
              value={platformStats.totalDelivered}
              color="green"
            />
            <StatCard
              title="Total Expired"
              value={platformStats.totalExpired}
              color="red"
            />
          </StatGrid>
        </Section>

        {/* ================= COMMUNITY FOOD ================= */}
        <Section title="Available Community Food (Live)">
          {foodsLoading ? (
            <p className="text-gray-500">Loading community food…</p>
          ) : paginatedFoods.length === 0 ? (
            <p className="text-gray-500">No food available right now.</p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedFoods.map((food) => (
                  <div
                    key={food._id}
                    className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition"
                  >
                    <img
                      src={food.image || "/placeholder.png"}
                      alt={food.foodName}
                      loading="lazy"
                      className="w-28 h-28 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{food.foodName}</h3>
                        <StatusBadge status={food.status} />
                      </div>

                      <p className="text-sm text-gray-600">
                        Qty: {food.quantity} •{" "}
                        {food.itemCategory === "cooked"
                          ? "Cooked"
                          : "Packed"}
                      </p>

                      <p className="text-sm text-gray-500">
                        ⏰{" "}
                        {new Date(food.expiryTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        📍 {food.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-3 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-1 border rounded-lg bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-1 border rounded-lg bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </Section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-16 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Zero Hunger Platform · Built by{" "}
        <span className="font-semibold">Prograto</span>
      </footer>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatGrid({ children }) {
  return <div className="grid md:grid-cols-3 gap-4">{children}</div>;
}

function StatCard({ title, value, color }) {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800"
  };
  return (
    <div className={`p-5 rounded-xl shadow ${colors[color]}`}>
      <p className="text-sm opacity-70">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ActionCard({ to, label }) {
  return (
    <Link
      to={to}
      className="bg-emerald-200 hover:bg-emerald-300 transition p-5 rounded-xl text-center font-medium shadow"
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }) {
  const map = {
    available: "bg-blue-100 text-blue-700",
    reserved: "bg-yellow-100 text-yellow-700",
    picked: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700"
  };
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-40 bg-gray-200 rounded-xl" />
    </div>
  );
}
