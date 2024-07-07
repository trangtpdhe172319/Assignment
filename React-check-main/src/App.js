import "./App.css";
import Login from "./components/account/Login";
import Footer from "./components/Layouts/footer/Footer";
import FullHeader from "./components/Layouts/header/FullHeader";
import Home from "./components/main/home/Home";
import ProductBox from "./components/main/ProductBox/ProductBox";
import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Cart from "./components/cart/Cart";
import SortProduct from "./components/main/SortProduct/SortProduct";
import FavoriteProduct from "./components/FavoriteProduct/FavoriteProduct";
import PersonalProfile from "./components/Profile/UserProfile";
import AddProduct from "./components/admin/AddProduct";
import ProductDetails from "./components/admin/ProductEdit";
import ProductsList from "./components/admin/ProductList";

export const AppContext = createContext();
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState({ account: {} });
  const [goLogin, setGoLogin] = useState(false);
  const [menuResponsiveAppear, setMenuResponsiveAppear] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setIsLoggedIn({ account: currentUser });
    }
  }, []);
  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        setGoLogin,
        goLogin,
        setMenuResponsiveAppear,
        menuResponsiveAppear,
      }}
    >
      <FullHeader />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductBox />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/sortProduct/:id" element={<SortProduct />} />
          <Route path="/favorite" element={<FavoriteProduct />} />
          <Route path="/profile" element={<PersonalProfile />} />
          <Route path="/admin/product/add" element={<AddProduct/>} />
          <Route path="/admin/product/:id" element={<ProductDetails/>} />
          <Route path="/admin/product" element={<ProductsList/>} />
        </Routes>
      </div>
      <Footer />
      {goLogin && (
        <div className="login">
          <Login />
        </div>
      )}
      <ToastContainer />
    </AppContext.Provider>
  );
}

export default App;
