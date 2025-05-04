import { useState } from "react";
import {
    AiOutlineArrowRight,
    AiOutlineCamera,
    AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
// import { DataGrid } from "@material-ui/data-grid";
// import { Button } from "@material-ui/core";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { MdOutlineTrackChanges } from "react-icons/md";

import { RxCross1 } from "react-icons/rx";
const ProfileContent = ({ active }) => {
    const { user } = useSelector((state) => state.user);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [phoneNumber, setPhoneNumber] = useState();
    const [zipCode, setZipCode] = useState();
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        console.log('update profile page')
    }
    return (
        <div className="w-full  h-auto">
            {/* profile page */}
            {
                active === 1 && (
                    <>
                        <div className="flex justify-center w-full">
                            <div className="relative">
                                <img
                                    src={`${user?.avatar?.url}`}
                                    className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                                    alt=""
                                />
                                <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                                    <AiOutlineCamera />
                                </div>
                            </div>
                            <br /><br />
                        </div>
                        <div className="w-full px-5 mt-8">
                            <form onSubmit={handleProfileUpdate}>
                                <div className="w-full 800px:flex block pb-3">

                                    <div className="w-full 800px:w-[50%]">
                                        <label className="block pb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full 800px:w-[50%]">
                                        <label className="block pb-2">Email</label>
                                        <input
                                            type="text"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-full 800px:flex block pb-3">
                                    <div className="w-full 800px:w-[50%]">
                                        <label className="block pb-2">Phone Number</label>
                                        <input
                                            type="number"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full 800px:w-[50%]">
                                        <label className="block pb-2">Zip Code</label>
                                        <input
                                            type="number"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-full 800px:flex block pb-3">
                                    <div className="w-full 800px:w-[50%]">
                                        <label className="block pb-2">Address 1</label>
                                        <input
                                            type="number"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={address1}
                                            onChange={(e) => setAddress1(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full 800px:w-[50%]">
                                        <label className="block pb-2">Address 2</label>
                                        <input
                                            type="number"
                                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                            required
                                            value={address2}
                                            onChange={(e) => setAddress2(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <input
                                    className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                                    required
                                    value="Update"
                                    type="submit"
                                />
                            </form>
                        </div>
                    </>
                )
            }
            {/* orders page */}
            {
                active === 2 && (
                    <div>
                        <AllOrders />
                    </div>
                )
            }

            {/* All Refunded Orders */}
            {
                active === 3 && (
                    <div>
                        <AllRefundOrders />
                    </div>
                )
            }

            {/* Track Order */}
            {
                active === 5 && (
                    <div>
                        <TrackOrder />
                    </div>
                )
            }

            {/* Payment Method */}
            {
                active === 6 && (
                    <div>
                        <PaymentMethod />
                    </div>
                )
            }

            {/* User Address */}
            {
                active === 7 && (
                    <div>
                        <Address />
                    </div>
                )
            }

        </div>
    )


}

const AllOrders = () => {
    const orders = [
        {
            _id: '12948705748392',
            orderItems: [
                {
                    name: 'Iphone 16 pro max'
                }
            ],
            totalPrice: 120,
            status: "processing"
        }
    ];
    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "greenColor" : "redColor";

            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];
    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.orderItems.length,
                total: "US$ " + item.totalPrice,
                status: item.status,
            });
        });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
            />
        </div>
    );
}

const AllRefundOrders = () => {
    const orders = [
        {
            _id: '12948705748392',
            orderItems: [
                {
                    name: 'Iphone 16 pro max'
                }
            ],
            totalPrice: 120,
            status: "processing"
        }
    ];
    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "greenColor" : "redColor";

            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];
    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.orderItems.length,
                total: "US$ " + item.totalPrice,
                status: item.status,
            });
        });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
            />
        </div>
    );
}


const TrackOrder = () => {
    const orders = [
        {
            _id: '12948705748392',
            orderItems: [
                {
                    name: 'Iphone 16 pro max'
                }
            ],
            totalPrice: 120,
            status: "processing"
        }
    ];
    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "greenColor" : "redColor";

            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <MdOutlineTrackChanges size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];
    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.orderItems.length,
                total: "US$ " + item.totalPrice,
                status: item.status,
            });
        });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
            />
        </div>
    );
}

const PaymentMethod = () => {
    return (
        <div className="w-full px-5">
            <div className="flex  w-full items-center justify-between">
                <h1 className="text-[25px] font-[600] text-[#000000] pb-2">
                    Payment Method
                </h1>
                <div className={`${styles.button} !rounded-md`}>
                    <span className="text-[#fff]">Add New</span>
                </div>
            </div>
            <br />
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center 
              px-3 shadow justify-between pr-10">
                <div className="flex items-center">
                    <img
                        className="w-8 h-8 object-contain"
                        src="https://download.logo.wine/logo/Visa_Inc./Visa_Inc.-Logo.wine.png"
                        alt="" />
                    <h5 className="pl-5 font-[600]"> Osid Alkourd</h5>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>1234 **** *** ****</h6>
                    <h5 className="pl-6">2025</h5>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8">
                    <AiOutlineDelete size={25} className="cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

const Address = () => {
    return (
        <div className="w-full px-5">
            <div className="flex  w-full items-center justify-between">
                <h1 className="text-[25px] font-[600] text-[#000000] pb-2">
                    My Addresses
                </h1>
                <div className={`${styles.button} !rounded-md`}>
                    <span className="text-[#fff]">Add New</span>
                </div>
            </div>
            <br />
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center 
              px-3 shadow justify-between pr-10">
                <div className="flex items-center">
                    <h5 className="pl-5 font-[600]"> Default</h5>
                </div>
                <div className="pl-8 flex items-center">
                    <h6> 564 Dier Al Balah</h6>
                </div>
                <div className="pl-8 flex items-center">
                    <h6> (+970) 599608424</h6>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8">
                    <AiOutlineDelete size={25} className="cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

export default ProfileContent;