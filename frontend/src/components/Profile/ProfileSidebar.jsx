
import React from "react";
import { AiOutlineCreditCard, AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
    MdOutlineAdminPanelSettings,
    MdOutlinePassword,
    MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const ProfileSidebar = ({ setActive, active }) => {

    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${server}/user/logout`, {}, { withCredentials: true });
            toast.success(res.data.message);
            navigate('/login');
            window.location.reload(true);


        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(1)}
            >
                <RxPerson size={20} color={active === 1 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 1 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Profile
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(2)}
            >
                <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 2 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Orders
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(3)}
            >
                <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 3 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Refunds
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(4)}
            >
                <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 4 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Inbox
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(5)}
            >
                <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 5 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Track Order
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(6)}
            >
                <AiOutlineCreditCard size={20} color={active === 6 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 6 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Payment Method
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => setActive(7)}
            >
                <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 7 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Address
                </span>
            </div>
            <div
                className="flex items-center cursor-pointer w-full mb-8"
                onClick={() => {
                    setActive(8);
                    logoutHandler()
                }}
            >
                <AiOutlineLogin size={20} color={active === 8 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 8 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Logout
                </span>
            </div>
        </div>
    )

}

export default ProfileSidebar;