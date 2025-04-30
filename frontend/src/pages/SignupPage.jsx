// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import Signup from "../components/Signup/Signup";
import { useSelector } from "react-redux";
import  { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user); // Add loading state
  const [loading, setLoading] = useState(true);  // Track page loading

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }else{
      setLoading(false);
    }
  }, [isAuthenticated, navigate]); //
  
  if (loading) {
    return null; // Render nothing (or a loading spinner) while redirect is happening
  }
  return (
    <div>
        <Signup />
    </div>
  )
}

export default SignupPage