import Login from "../components/Login/Login.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  // const { isAuthenticated , loading } = useSelector((state) => state.user);
  const { isAuthenticated,loading } = useSelector((state) => state.user);
  // const [loading, setLoading] = useState(true);  // Track page loading

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading , navigate]); // 👈 dependencies!

  if (loading || isAuthenticated) {
    return <div> Loading.........</div>; // Render nothing (or a loading spinner) while redirect is happening
  }
  return (
    <div>
      <Login />
    </div>
  )
}

export default LoginPage;