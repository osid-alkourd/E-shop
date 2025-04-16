import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import{LoginPage, SignupPage} from './routes/Routes'
import "./App.css"
const App = () => {
  return(
    <div>
       <BrowserRouter>
            <Routes>
              <Route path='/login' element={<LoginPage/>}></Route>
              <Route path='/sign-up' element={<SignupPage/>}></Route>
            </Routes>
       </BrowserRouter>
    </div>
  )
} 
export default App;
