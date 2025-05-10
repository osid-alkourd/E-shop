import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  CheckoutPage,
  PaymentPage,
  CreateShopPage,
  ActivationShopPage,
  ShopLoginPage,
  ShopHomePage,
} from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "./server";
import { loadUser } from "./redux/actions/userAction";
import { loadShop } from "./redux/actions/shopAction";

import store from "./redux/store";
import "./App.css";
import Events from "./components/Events/Events";
import { useSelector } from "react-redux";
import { AuthProtectedRoute, SellerProtectedRoute } from "./ProtectedRoute";
const App = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { shopLoading, isSeller } = useSelector((state) => state.shop);

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadShop());
  }, []);
  // useEffect(() => {
  //   axios.get(`${server}/user/getuser`,{withCredential: true}).then((res) => {

  //   })
  // })

  if (loading || shopLoading) return <div>Loading...</div>;

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/sign-up" element={<SignupPage />}></Route>
            <Route
              path="/activation/:activation_token"
              element={<ActivationPage />}
            ></Route>
            <Route
              path="/activation-shop/:activation_token"
              element={<ActivationShopPage />}
            ></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/products" element={<ProductsPage />}></Route>
            <Route path="/product/:name" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />}></Route>
            <Route path="/events" element={<EventsPage />}></Route>
            <Route path="/faq" element={<FAQPage />}></Route>
            <Route
              path="/profile"
              element={
                <AuthProtectedRoute isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </AuthProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <AuthProtectedRoute isAuthenticated={isAuthenticated}>
                  <CheckoutPage />
                </AuthProtectedRoute>
              }
            />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/shop-create" element={<CreateShopPage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route
              path="/shop/:id"
              element={
                <SellerProtectedRoute isSeller={isSeller}>
                  <ShopHomePage />
                </SellerProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </div>
    </>
  );
};
export default App;
