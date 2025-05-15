import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from '../components/Layout/Loader';
export const AuthProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const SellerProtectedRoute = ({children }) => {
  const { shopLoading, isSeller } = useSelector((state) => state.shop);
     if (shopLoading) {
    return <Loader />;
  }

  if (!isSeller) {
    return <Navigate to="/shop-login" />;
  }
  return children;
};


