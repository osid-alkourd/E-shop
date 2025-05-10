import { Navigate } from "react-router-dom";

export const AuthProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const SellerProtectedRoute = ({ isSeller, children }) => {
  if (!isSeller) {
    return <Navigate to="/shop-login" />;
  }
  return children;
};


