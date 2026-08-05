import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import CarbonAccounting from './pages/CarbonAccounting';
import RouteNetwork from './pages/RouteNetwork';
import SAFTrends from './pages/SAFTrends';
import DataDescription from './pages/DataDescription';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<CarbonAccounting />} />
        <Route path="emissions" element={<CarbonAccounting />} />
        <Route path="routes" element={<RouteNetwork />} />
        <Route path="saf" element={<SAFTrends />} />
        <Route path="data" element={<DataDescription />} />
      </Route>
    </Routes>
  );
}
