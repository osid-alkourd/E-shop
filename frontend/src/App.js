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
} from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "./server";
import { loadUser } from "./redux/actions/userAction";
import store from "./redux/store";
import "./App.css";
import Events from "./components/Events/Events";
import { useSelector } from "react-redux";

const App = () => {
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  // useEffect(() => {
  //   axios.get(`${server}/user/getuser`,{withCredential: true}).then((res) => {

  //   })
  // })
  return (
    <>
      {loading ? null : (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/sign-up" element={<SignupPage />}></Route>
              <Route
                path="/activation/:activation_token"
                element={<ActivationPage />}
              ></Route>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/products" element={<ProductsPage />}></Route>
              <Route path="/best-selling" element={<BestSellingPage />}></Route>
              <Route path="/events" element={<EventsPage />}></Route>
              <Route path="/faq" element={<FAQPage />}></Route>
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
      )}
    </>
  );
};
export default App;
