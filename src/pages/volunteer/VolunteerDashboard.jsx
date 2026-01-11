import { useEffect, useState } from "react";
import { getAvailableFoods, reserveFood } from "../../api/food";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";

const PAGE_SIZE = 6;

export default function VolunteerDashboard() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await getAvailableFoods();
      setFoods(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load available food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();

    const sync = () => fetchFoods();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* ================= ACTIONS ================= */
  const handlePickup = async (id) => {
    try {
      await reserveFood(id);
      localStorage.setItem("foodUpdated", Date.now());
      alert("✅ Added to pickup cart");
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || "Pickup failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= FILTERING ================= */
  const filteredFoods = foods.filter((food) => {
    if (
      search &&
      !food.foodName.toLowerCase().includes(search.toLowerCase())
    )
      return false;

    if (filter !== "all" && food.itemCategory !== filter) return false;

    return true;
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredFoods.length / PAGE_SIZE);
  const paginatedFoods = filteredFoods.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= MAP LINK ================= */
  const getMapLink = (address) => {
    if (!address?.includes("Lat")) return null;

    const lat = address.match(/Lat:\s*([0-9.-]+)/i)?.[1];
    const lng = address.match(/Lng:\s*([0-9.-]+)/i)?.[1];

    if (!lat || !lng) return null;

    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* ================= HEADER ================= */}
      <header className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            Volunteer Dashboard
          </h1>
          <p className="text-sm text-slate-500 max-w-md">
            Choose available food, reserve it, and deliver hope to someone in
            need.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <BackButton />
          <Link
            to="/volunteer/profile"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            👤 Profile
          </Link>
          <Link
            to="/volunteer/cart"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            🛒 Pickup Cart
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= FILTER BAR ================= */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
          placeholder="Search food items…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Items</option>
          <option value="cooked">Cooked Food</option>
          <option value="packed">Packed Items</option>
        </select>
      </div>

      {/* ================= FOOD GRID ================= */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-slate-500">
            Loading available food…
          </p>
        ) : paginatedFoods.length === 0 ? (
          <p className="text-center text-slate-500">
            No food available right now.
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
              {paginatedFoods.map((food) => {
                const mapLink = getMapLink(food.address);

                return (
                  <div
                    key={food._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
                  >
                    {food.image && (
                      <img
                        src={food.image}
                        alt={food.foodName}
                        loading="lazy"
                        className="w-full h-44 object-cover rounded-xl mb-3"
                      />
                    )}

                    <h3 className="font-semibold text-lg">
                      {food.foodName}
                    </h3>

                    <p className="text-sm text-slate-600">
                      Quantity: {food.quantity}
                    </p>

                    <p className="text-sm text-slate-600 capitalize">
                      Category: {food.itemCategory}
                    </p>

                    <p className="text-sm text-slate-600">
                      ⏰{" "}
                      {new Date(food.expiryTime).toLocaleString()}
                    </p>

                    <p className="text-sm text-slate-600">
                      📍 {food.address}
                    </p>

                    {mapLink && (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        View on Google Maps
                      </a>
                    )}

                    <button
                      onClick={() => handlePickup(food._id)}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-semibold transition"
                    >
                      🚚 Pickup This Food
                    </button>
                  </div>
                );
              })}
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
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-16 text-center text-xs text-slate-400">
        Built with ❤️ by <span className="font-semibold">Prograto</span>
      </footer>
    </div>
  );
}
