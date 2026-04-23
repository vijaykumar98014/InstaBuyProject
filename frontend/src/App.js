import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";

// 🔥 Toastify import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages (lazy loaded)
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Home = lazy(() => import("./pages/Home/Home"));
const Inventory = lazy(() => import("./pages/Inventory/Inventory"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Orders = lazy(() => import("./pages/Orders/Orders"));

function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
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
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* 🔥 GLOBAL TOAST (IMPORTANT) */}
      <ToastContainer
        position="top-right" 
        autoClose={1000}      
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="dark"
      />
    </>
  );
}

export default App;