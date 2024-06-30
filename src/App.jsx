import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Home, Layout, Login, Register } from "./pages";
import { NotFound } from "./components";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [status, setStatus] = useState(navigator.onLine ? true : false);
  useEffect(() => {
    window.ononline = (e) => {
      setStatus(true);
    };
    window.onoffline = (e) => {
      setStatus(false);
    };
  }, [status]);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      toast.warn("Vui lòng đăng nhập!");
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <div className="relative">
      <BrowserRouter>
        <div
          className={`text-center w-full text-white py-5 absolute top-0 duration-500 z-40 ${
            status
              ? "-translate-y-full bg-green-500"
              : "-translate-y-0 bg-red-500"
          }`}
        >
          {status ? "Bạn đã online!" : "Mất kết nối mạng!"}
        </div>
        <ToastContainer />
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="dashboard/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
