import { useState, useEffect } from "react";
import { addFood } from "../../api/food";
import BackButton from "../../components/ui//BackButton";

export default function AddFood() {
  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    foodType: "Veg",
    itemCategory: "cooked",

    expiryDateTime: "",
    expiryDateOnly: "",

    isSameAsLocation: true,
    address: "",
    lat: "",
    lng: "",

    image: ""
  });

  /* 📍 AUTO LOCATION */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: prev.isSameAsLocation
            ? `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`
            : prev.address
        }));
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch precise location. Please enter address manually.");
      },
      {
        enableHighAccuracy: true,   // ⭐ IMPORTANT
        timeout: 10000,
        maximumAge: 0              // No cached location
      }
    );
  }, []);


  /* 🖼 IMAGE → BASE64 */
  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  /* 🚀 SUBMIT */
  const handleSubmit = async () => {
    const {
      foodName,
      quantity,
      foodType,
      itemCategory,
      expiryDateTime,
      expiryDateOnly,
      isSameAsLocation,
      address,
      lat,
      lng,
      image
    } = form;

    if (!foodName || !quantity || !lat || !lng)
      return alert("All required fields must be filled");

    if (!isSameAsLocation && !address)
      return alert("Pickup address is required");

    if (!image) return alert("Please upload an image");

    let expiryTime;

    if (itemCategory === "cooked") {
      if (!expiryDateTime)
        return alert("Expiry date & time required for cooked food");
      expiryTime = expiryDateTime;
    } else {
      if (!expiryDateOnly)
        return alert("Expiry date required for packed items");
      expiryTime = `${expiryDateOnly}T23:59`;
    }

    try {
      await addFood({
        foodName,
        quantity,
        foodType,
        itemCategory,
        expiryTime,
        location: { lat, lng },
        address,
        isSameAsLocation,
        image
      });

      alert("🎉 Item added successfully!");

      setForm((prev) => ({
        ...prev,
        foodName: "",
        quantity: "",
        expiryDateTime: "",
        expiryDateOnly: "",
        image: ""
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* HEADER */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-emerald-700">
              Add Food / Item
            </h2>
            <BackButton />
          </div>
          <p className="text-sm text-gray-500">
            Help reduce food waste by sharing surplus responsibly
          </p>
        </div>

        {/* ITEM DETAILS */}
        <Section title="Item Details">
          <Input
            label="Food / Item Name"
            placeholder="Eg: Rice Meals, Bread Packets"
            value={form.foodName}
            onChange={(v) => setForm({ ...form, foodName: v })}
          />

          <Input
            label="Quantity"
            placeholder="Eg: 10 plates / 5 kg"
            value={form.quantity}
            onChange={(v) => setForm({ ...form, quantity: v })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.itemCategory}
              onChange={(v) =>
                setForm({ ...form, itemCategory: v })
              }
              options={[
                { value: "cooked", label: "Cooked Food" },
                { value: "packed", label: "Packed Items" }
              ]}
            />

            <Select
              label="Food Type"
              value={form.foodType}
              onChange={(v) =>
                setForm({ ...form, foodType: v })
              }
              options={[
                { value: "Veg", label: "Veg" },
                { value: "Non-Veg", label: "Non-Veg" }
              ]}
            />
          </div>
        </Section>

        {/* EXPIRY */}
        <Section title="Expiry Information">
          {form.itemCategory === "cooked" ? (
            <Input
              type="datetime-local"
              label="Expiry Date & Time"
              value={form.expiryDateTime}
              onChange={(v) =>
                setForm({ ...form, expiryDateTime: v })
              }
            />
          ) : (
            <Input
              type="date"
              label="Expiry Date"
              value={form.expiryDateOnly}
              onChange={(v) =>
                setForm({ ...form, expiryDateOnly: v })
              }
            />
          )}
        </Section>

        {/* IMAGE */}
        <Section title="Item Image">
          <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e.target.files[0])
              }
            />
            <p className="text-sm text-gray-500">
              Click to upload image
            </p>
          </label>

          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl mt-3"
            />
          )}
        </Section>

        {/* LOCATION */}
        <Section title="Pickup Location">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isSameAsLocation}
              onChange={(e) =>
                setForm({
                  ...form,
                  isSameAsLocation: e.target.checked,
                  address: e.target.checked
                    ? `Lat: ${form.lat}, Lng: ${form.lng}`
                    : ""
                })
              }
            />
            Pickup address same as my current location
          </label>

          <Input
            placeholder="Pickup Address"
            value={form.address}
            disabled={form.isSameAsLocation}
            onChange={(v) =>
              setForm({ ...form, address: v })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <ReadOnly value={form.lat} />
            <ReadOnly value={form.lng} />
          </div>
        </Section>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
        >
          🚀 Submit Item
        </button>

        <p className="text-xs text-center text-gray-400">
          Built with ❤️ by <span className="font-semibold">Prograto</span>
        </p>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-gray-600">
          {label}
        </label>
      )}
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReadOnly({ value }) {
  return (
    <input
      value={value}
      readOnly
      className="border bg-gray-100 px-3 py-2 rounded-lg text-sm"
    />
  );
}
