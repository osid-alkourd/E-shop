import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import ShopCreate from "../components/Shop/CreateShop";

const CreateShopPage = () => {
    
  return (
    <div>
        <ShopCreate />
    </div>
  )
    
}

export default CreateShopPage;