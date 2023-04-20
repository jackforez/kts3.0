import { Routes, Route, Navigate } from "react-router-dom";
import { Header, Navigator, Sidebar } from "../components";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
import { Account, Cost, Customers, Partners, Tracking, Bills } from ".";
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
            <Route path="setting" element={<Account />} />
            <Route path="customers" element={<Customers />} />
            <Route path="cost" element={<Cost />} />
            <Route path="partners" element={<Partners />} />
            <Route path="tracking" element={<Tracking />} />
          </Routes>
        </div>
        <Navigator />
      </div>
    </div>
  );
};

export default Layout;
