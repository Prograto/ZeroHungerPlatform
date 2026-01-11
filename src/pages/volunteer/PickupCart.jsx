import { useEffect, useState } from "react";
import axios from "../../api/axios";
import BackButton from "../../components/ui/BackButton";

const PAGE_SIZE = 4;

export default function PickupCart() {
  const [foods, setFoods] = useState([]);
  const [deliveringFood, setDeliveringFood] = useState(null);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryImage, setDeliveryImage] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/food/my-cart");
      setFoods(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert("Failed to load pickup cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= ACTIONS ================= */

  const handlePick = async (foodId) => {
    try {
      await axios.post(`/api/food/pick/${foodId}`);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Pick failed");
    }
  };

  const handleRemove = async (foodId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      await axios.post(`/api/food/unreserve/${foodId}`);
      localStorage.setItem("foodUpdated", Date.now());
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Remove failed");
    }
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setDeliveryImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDeliver = async () => {
    if (!deliveryAddress || !deliveryImage) {
      alert("Delivery address and image are required");
      return;
    }

    try {
      await axios.post(`/api/food/deliver/${deliveringFood._id}`, {
        deliveryAddress,
        deliveryImage,
        deliveryNotes
      });

      alert("🎉 Delivered successfully! +10 Karma");

      localStorage.setItem("foodUpdated", Date.now());

      setDeliveringFood(null);
      setDeliveryAddress("");
      setDeliveryImage("");
      setDeliveryNotes("");

      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Delivery failed");
    }
  };

  /* ================= HELPERS ================= */

  const getMapLink = (address) => {
    if (!address?.includes("Lat")) return null;

    const lat = address.match(/Lat:\s*([0-9.-]+)/i)?.[1];
    const lng = address.match(/Lng:\s*([0-9.-]+)/i)?.[1];
    if (!lat || !lng) return null;

    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const totalPages = Math.ceil(foods.length / PAGE_SIZE);
  const paginatedFoods = foods.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 animate-fadeIn">
      {/* ================= HEADER ================= */}
      <header className="max-w-6xl mx-auto flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            🛒 Pickup Cart
          </h1>
          <p className="text-sm text-slate-500">
            Manage picked items and complete deliveries
          </p>
        </div>
        <BackButton />
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-slate-500">Loading cart…</p>
        ) : paginatedFoods.length === 0 ? (
          <p className="text-center text-slate-500">
            No items in your cart.
          </p>
        ) : (
          <>
            {paginatedFoods.map((food) => {
              const mapLink = getMapLink(food.address);

              return (
                <div
                  key={food._id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex gap-4"
                >
                  {food.image && (
                    <img
                      src={food.image}
                      alt={food.foodName}
                      className="w-28 h-28 object-cover rounded-xl"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        {food.foodName}
                      </h3>
                      <StatusBadge status={food.status} />
                    </div>

                    <p className="text-sm text-slate-600">
                      Quantity: {food.quantity}
                    </p>

                    <p className="text-sm text-slate-600">
                      📍 Pickup: {food.address}
                    </p>

                    {mapLink && (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View on Google Maps
                      </a>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-3 flex gap-2">
                      {food.status === "reserved" && (
                        <>
                          <button
                            onClick={() => handlePick(food._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                          >
                            Picked
                          </button>

                          <button
                            onClick={() => handleRemove(food._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg"
                          >
                            Remove
                          </button>
                        </>
                      )}

                      {food.status === "picked" && (
                        <button
                          onClick={() => setDeliveringFood(food)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg"
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 pt-6">
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
      </main>

      {/* ================= DELIVERY MODAL ================= */}
      {deliveringFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
            <h3 className="text-lg font-semibold mb-4">
              🚚 Delivery Details
            </h3>

            <input
              className="border rounded-lg p-2 w-full mb-2"
              placeholder="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />

            <textarea
              className="border rounded-lg p-2 w-full mb-2"
              placeholder="Delivery Notes (optional)"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="border rounded-lg p-2 w-full mb-2"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />

            {deliveryImage && (
              <img
                src={deliveryImage}
                alt="Proof"
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeliveringFood(null)}
                className="border px-4 py-1 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeliver}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-lg"
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-16 text-center text-xs text-slate-400">
        Built with ❤️ by <span className="font-semibold">Prograto</span>
      </footer>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const map = {
    reserved: "bg-yellow-100 text-yellow-700",
    picked: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700"
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}
