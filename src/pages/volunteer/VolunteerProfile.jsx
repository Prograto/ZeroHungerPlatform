import { useEffect, useState } from "react";
import {
  getVolunteerProfile,
  getVolunteerDeliveries,
  getPlatformStats
} from "../../api/food";
import BackButton from "../../components/ui/BackButton";

const PAGE_SIZE = 4;

export default function VolunteerProfile() {
  const [profile, setProfile] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, d, s] = await Promise.all([
        getVolunteerProfile(),
        getVolunteerDeliveries(),
        getPlatformStats()
      ]);
      setProfile(p);
      setDeliveries(Array.isArray(d) ? d : []);
      setStats(s);
    } catch {
      alert("Failed to load volunteer profile");
    } finally {
      setLoading(false);
    }
  };

  const filtered = deliveries.filter((d) =>
    d.foodName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* ================= HEADER ================= */}
      <header className="max-w-7xl mx-auto flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            Volunteer Profile
          </h1>
          <p className="text-sm text-slate-500">
            Your impact, contributions, and journey 🌱
          </p>
        </div>

        <BackButton />
      </header>

      <main className="max-w-7xl mx-auto space-y-10 animate-fadeIn">
        {/* ================= PROFILE CARD ================= */}
        <section className="bg-white rounded-2xl shadow-md p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-slate-600">{profile.email}</p>
            <p className="text-sm text-slate-600">
              📞 {profile.phone || "Not provided"}
            </p>
            <p className="text-sm text-slate-600 capitalize">
              Role: {profile.role}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Joined on{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-center flex flex-col justify-center">
            <p className="text-sm text-slate-500">Karma Points</p>
            <p className="text-5xl font-bold text-purple-600">
              ⭐ {profile.karmaPoints}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              Deliveries Completed
            </p>
            <p className="text-2xl font-semibold text-emerald-700">
              🚚 {profile.deliveriesCompleted}
            </p>
          </div>
        </section>

        {/* ================= PLATFORM STATS ================= */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Platform Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              title="Total Posted"
              value={stats.totalPosted}
              color="blue"
            />
            <StatCard
              title="Total Delivered"
              value={stats.totalDelivered}
              color="green"
            />
            <StatCard
              title="Total Expired"
              value={stats.totalExpired}
              color="red"
            />
          </div>
        </section>

        {/* ================= SEARCH ================= */}
        <section>
          <input
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            placeholder="Search delivered food…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </section>

        {/* ================= DELIVERIES ================= */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Your Successful Deliveries
          </h2>

          {paginated.length === 0 ? (
            <p className="text-slate-500">
              No deliveries found.
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {paginated.map((food) => (
                  <div
                    key={food._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4"
                  >
                    <h3 className="font-semibold text-lg">
                      {food.foodName}
                    </h3>

                    <p className="text-sm text-slate-600">
                      Quantity: {food.quantity}
                    </p>

                    <p className="text-sm text-slate-600">
                      Delivered To: {food.deliveryAddress}
                    </p>

                    <p className="text-sm text-slate-500">
                      📅{" "}
                      {new Date(food.deliveredAt).toLocaleString()}
                    </p>

                    {food.deliveryImage && (
                      <img
                        src={food.deliveryImage}
                        alt="Delivery Proof"
                        loading="lazy"
                        className="w-full h-36 object-cover rounded-xl mt-3"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* ================= PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-16 text-center text-xs text-slate-400">
        Built with ❤️ by <span className="font-semibold">Prograto</span>
      </footer>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800"
  };

  return (
    <div className={`p-5 rounded-xl shadow ${colors[color]}`}>
      <p className="text-sm opacity-70">{title}</p>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </div>
  );
}
