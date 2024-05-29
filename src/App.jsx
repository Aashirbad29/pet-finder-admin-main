import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/dashboard";
import ProtectedRoute from "./pages/protected-route";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Pet from "./pages/pet/pet";
import AdoptionRequest from "./pages/adoption-request/adoption-request";
import RescueRequest from "./pages/rescue-request/rescue-request";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/pet" element={<Pet />} />
                <Route path="/adoption-request" element={<AdoptionRequest />} />
                <Route path="/rescue-request" element={<RescueRequest />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
