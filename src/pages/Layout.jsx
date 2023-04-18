import { Routes, Route, Navigate } from "react-router-dom";
import { Header, Navigator, Sidebar } from "../components";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
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
        <div className="md:h-[94vh] h-[86vh] w-full overflow-y-auto rounded">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
        <Navigator />
      </div>
    </div>
  );
};

export default Layout;
