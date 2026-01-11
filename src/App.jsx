import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import AddFood from "./pages/donor/AddFood";
import MyFoods from "./pages/donor/MyFoods";

import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import PickupCart from "./pages/volunteer/PickupCart";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";

import Welcome from "./pages/Welcome";


function App() {
  return (
    <Routes>
      {/* Welcome Page */}
      <Route path="/" element={<Welcome />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Donor */}
      <Route path="/donor/add-food" element={<AddFood />} />
      <Route path="/donor/my-foods" element={<MyFoods />} />

      
      {/* Volunteer */}
      <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      <Route path="/volunteer/cart" element={<PickupCart />} />
      <Route path="/volunteer/profile" element={<VolunteerProfile />} />
      


    </Routes>
  );
}

export default App;
