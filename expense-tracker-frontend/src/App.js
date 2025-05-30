import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from "./pages/CreateTripPage";
import TripPage from "./pages/TripPage";
import SpendingReportPage from "./pages/SpendingReportPage";
import DemoLoginPage from "./pages/DemoLoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<CreateTripPage />} />
        <Route path="/trip/:id" element={<TripPage />} />
        <Route path="/trip/:id/report" element={<SpendingReportPage />} />
        <Route path="/demo-login" element={<DemoLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
