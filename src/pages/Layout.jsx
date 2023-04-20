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
} from ".";
const Layout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isShop = currentUser?.role === "shop";
  const ProtectedRoute = ({ children }) => {
    if (isShop) {
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
            <Route path="accounts" element={<Accounts />} />
            <Route path="cost" element={<Cost />} />
            <Route path="cost/new" element={<NewCost />} />
            <Route
              path="config"
              element={
                <ProtectedRoute>
                  <Config />
                </ProtectedRoute>
              }
            />
            <Route path="databases" element={<Databases />} />
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
          </Routes>
        </div>
        <Navigator />
      </div>
    </div>
  );
};

export default Layout;
