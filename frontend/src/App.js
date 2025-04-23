import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
} from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "./server";
import { loadUser } from "./redux/actions/userAction";
import store from "./redux/store";
import "./App.css";
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  // useEffect(() => {
  //   axios.get(`${server}/user/getuser`,{withCredential: true}).then((res) => {

  //   })
  // })
  return (
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
  );
};
export default App;
