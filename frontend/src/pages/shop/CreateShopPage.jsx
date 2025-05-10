import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ShopCreate from "../../components/Shop/CreateShop";

const CreateShopPage = () => {
  const navigate = useNavigate();
  const {isSeller,shopLoading,shop } = useSelector((state) => state.shop);

  useEffect(() => {
        if (isSeller) {
          navigate(`/shop/${shop._id}`, { replace: true });
        }
      }, [isSeller, shopLoading , shop?._id]); // 👈 dependencies!

      if (shopLoading || isSeller) {
        return <div> Loading.........</div>; // Render nothing (or a loading spinner) while redirect is happening
      }
  return (
    <div>
        <ShopCreate />
    </div>
  )
    
}

export default CreateShopPage;