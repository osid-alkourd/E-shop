import axios from "axios";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";
import {
  LoadShopRequest,
  LoadShopSuccess,
  LoadShopFail,
  ClearError
} from "../reducers/shopReducer";
// load Shop
export const loadShop = () => async (dispatch) => {
    try {
      dispatch({
        type: LoadShopRequest,
      });
      const { data } = await axios.get(`${server}/shops/me`, {
        withCredentials: true, // Keep this!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch({
        type: LoadShopSuccess,
        payload: data.shop,
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({
        type: LoadShopFail,
        payload: message,
      });
      console.log('get Shop error')
    }
  };
  