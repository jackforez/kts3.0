import { Routes, Route, Navigate } from "react-router-dom";
import { Header, Navigator, Sidebar } from "../components";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
import {
  Account,
  Cost,
  Customers,
  Partners,
  Tracking,
  Bills,
  NewCustomer,
  Accounts,
  NewPartner,
  NewBill,
  NewCost,
  Config,
  Databases,
  EditPartner,
  Viettel,
} from ".";
const Layout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const ProtectedRoute = ({ children }) => {
    if (!import.meta.env.VITE_KTS_LV2.includes(currentUser.role)) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };
  const ProtectedRouteLv2 = ({ children }) => {
    if (!import.meta.env.VITE_KTS_LV1.includes(currentUser.role)) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };
  const ProtectedRouteLv3 = ({ children }) => {
    if (!import.meta.env.VITE_KTS_LV0.includes(currentUser.role)) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };
  return (
    <div className="relative flex h-screen w-full flex-1">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="md:h-[92vh] h-[84vh] w-full overflow-y-auto rounded">
          <Routes path="/">
            <Route index element={<Dashboard />} />
            <Route path="bills" element={<Bills />} />
            <Route path="bills/new" element={<NewBill />} />
            {/* <Route path="warehouses" element={<Warehouse />} /> */}
            <Route path="setting" element={<Account />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<NewCustomer />} />
            <Route path="tracking" element={<Tracking />} />
            <Route
              path="accounts"
              element={
                <ProtectedRouteLv2>
                  <Accounts />
                </ProtectedRouteLv2>
              }
            />
            <Route
              path="cost"
              element={
                <ProtectedRoute>
                  <Cost />
                </ProtectedRoute>
              }
            />
            <Route
              path="cost/new"
              element={
                <ProtectedRoute>
                  <NewCost />
                </ProtectedRoute>
              }
            />
            <Route
              path="config"
              element={
                <ProtectedRouteLv2>
                  <Config />
                </ProtectedRouteLv2>
              }
            />
            <Route
              path="viettel"
              element={
                <ProtectedRouteLv3>
                  <Viettel />
                </ProtectedRouteLv3>
              }
            />
            <Route
              path="partners"
              element={
                <ProtectedRoute>
                  <Partners />
                </ProtectedRoute>
              }
            />
            <Route
              path="partners/new"
              element={
                <ProtectedRoute>
                  <NewPartner />
                </ProtectedRoute>
              }
            />
            <Route
              path="partners/:id"
              element={
                <ProtectedRoute>
                  <EditPartner />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Navigator />
      </div>
    </div>
  );
};

export default Layout;
