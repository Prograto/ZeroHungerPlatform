import DonorDashboard from "./donor/DonorDashboard";
import VolunteerDashboard from "./volunteer/VolunteerDashboard";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  if (role === "donor") return <DonorDashboard />;
  if (role === "volunteer") return <VolunteerDashboard />;

  return <h1>Unauthorized</h1>;
}
