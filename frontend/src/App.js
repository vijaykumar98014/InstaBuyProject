import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Home = lazy(() => import("./pages/Home/Home"));
const Inventory = lazy(() => import("./pages/Inventory/Inventory"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Orders = lazy(() => import("./pages/Orders/Orders"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

function App() {
  const theme = useSelector((state) => state.theme.mode);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (hasMountedRef.current) {
      document.body.classList.add("theme-transition");
      const timer = setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, 320);

      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
      return () => clearTimeout(timer);
    }

    hasMountedRef.current = true;
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="top-right" 
        autoClose={1000}      
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable
        theme={theme === "light" ? "light" : "dark"}
      />
    </>
  );
}

export default App;