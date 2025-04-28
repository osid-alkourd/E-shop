import axios from "axios";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";

// load user
export const loadUser = () => async (dispatch) => {
    try {
      dispatch({
        type: "LoadUserRequest",
      });
      const { data } = await axios.get(`${server}/user/getuser`, {
        withCredentials: true, // Keep this!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch({
        type: "LoadUserSuccess",
        payload: data.user,
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({
        type: "LoadUserFail",
        payload: message,
      });
      console.log('get user error')
    }
  };
  