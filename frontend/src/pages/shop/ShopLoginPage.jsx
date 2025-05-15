import ShopLogin from "../../components/Shop/ShopLogin";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ShopLoginPage = () => {
    const navigate = useNavigate();
    const {isSeller,shopLoading,shop } = useSelector((state) => state.shop);
    // const [loading, setLoading] = useState(true);  // Track page loading
  
    useEffect(() => {
      if (isSeller) {
        // navigate(`/shop/${shop._id}`, { replace: true });
        navigate(`/shop/dashboard`, { replace: true });
      }
    }, [isSeller, shopLoading , shop?._id]); // 👈 dependencies!
  
    if (shopLoading || isSeller) {
      return <div> Loading.........</div>; // Render nothing (or a loading spinner) while redirect is happening
    }
    return (
        <div>
           <ShopLogin/>
        </div>
    )
}

export default ShopLoginPage;