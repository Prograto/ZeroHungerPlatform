import { useEffect, useState } from "react";
import { getMyFoods, deleteFood, updateFood } from "../../api/food";
import BackButton from "../../components/ui/BackButton";

const PAGE_SIZE = 5;

export default function MyFoods() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [editingFood, setEditingFood] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const data = await getMyFoods();
      setFoods(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load foods");
    }
  };

  /* ================= STATUS CONFIG ================= */
  const STATUS_STYLE = {
    available: "bg-emerald-100 text-emerald-700",
    reserved: "bg-yellow-100 text-yellow-700",
    picked: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700"
  };

  /* ================= EXPIRY TAG ================= */
  const getExpiryTag = (expiryTime) => {
    const diff = new Date(expiryTime) - new Date();
    if (diff <= 0) return { text: "Expired", color: "bg-red-200 text-red-800" };

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return { text: `${days} day(s) left`, color: "bg-green-100 text-green-800" };
    if (hrs > 0) return { text: `${hrs} hour(s) left`, color: "bg-yellow-100 text-yellow-800" };
    return { text: `${mins} min left`, color: "bg-orange-100 text-orange-800" };
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteFood(id);
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await updateFood(editingFood._id, {
        foodName,
        quantity,
        expiryTime: expiry,
        address
      });
      setEditingFood(null);
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= FILTERING ================= */
  const filteredFoods = foods.filter((f) => {
    if (search && !f.foodName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredFoods.length / PAGE_SIZE);
  const paginatedFoods = filteredFoods.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-emerald-700">
              My Food Listings
            </h2>
            <p className="text-sm text-slate-500">
              Manage, edit, and track your donated items
            </p>
          </div>

          <BackButton />
        </div>

        
        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">
          <input
            className="border p-2 rounded w-full md:w-1/2"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* FOOD LIST */}
        {paginatedFoods.length === 0 ? (
          <p className="text-slate-500">No food items found.</p>
        ) : (
          paginatedFoods.map((food) => {
            const expiryTag = getExpiryTag(food.expiryTime);

            return (
              <div
                key={food._id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition"
              >
                {/* IMAGE */}
                <img
                  src={food.image || "/placeholder.png"}
                  alt={food.foodName}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{food.foodName}</h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${STATUS_STYLE[food.status]}`}
                    >
                      {food.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    Qty: {food.quantity} •{" "}
                    {food.itemCategory === "cooked" ? "Cooked" : "Packed"}
                  </p>

                  <p className="text-sm text-slate-500">
                    ⏰ {new Date(food.expiryTime).toLocaleString()}
                  </p>

                  <p className="text-sm text-slate-500">
                    📍 {food.address}
                  </p>

                  {["available", "expired"].includes(food.status) && (
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${expiryTag.color}`}>
                      {expiryTag.text}
                    </span>
                  )}

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-2">
                    {food.status === "available" && (
                      <button
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => {
                          setEditingFood(food);
                          setFoodName(food.foodName);
                          setQuantity(food.quantity);
                          setExpiry(food.expiryTime.slice(0, 16));
                          setAddress(food.address);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {["available", "expired"].includes(food.status) && (
                      <button
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDelete(food._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-3 shadow-lg">
            <h3 className="text-lg font-semibold">Edit Food</h3>

            <input className="border p-2 w-full rounded" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
            <input className="border p-2 w-full rounded" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input type="datetime-local" className="border p-2 w-full rounded" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            <input className="border p-2 w-full rounded" value={address} onChange={(e) => setAddress(e.target.value)} />

            <div className="flex justify-end gap-2 pt-2">
              <button className="px-4 py-1 border rounded" onClick={() => setEditingFood(null)}>Cancel</button>
              <button className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
