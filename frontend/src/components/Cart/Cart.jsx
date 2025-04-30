import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link if needed

const Cart = ({ setOpenCart }) => {
    const cartData = [
        {
            name: "Apple iPhone 13",
            price: 799.99,
            description: "Latest iPhone with A15 Bionic chip, 6.1-inch display, and improved cameras."
        },
        {
            name: "Samsung Galaxy S21",
            price: 699.99,
            description: "Flagship Android phone with 5G support, 120Hz AMOLED display, and powerful cameras."
        }
    ]

    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
            <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
                <div>
                    <div className="flex w-full justify-end pt-5 pr-5 ">
                        <RxCross1
                            size={25}
                            className="cursor-pointer"
                            onClick={() => setOpenCart(false)}
                        />
                    </div>
                    {/* items length */}
                    <div className={`${styles.noramlFlex} p-4`}>
                        <IoBagHandleOutline size={25} />
                        <h5 className="pl-2 text-[20px] font-[500]">
                            3 items
                        </h5>
                    </div>
                    {/* cart single item  */}
                    <br />
                    <div className="w-full border-t">
                        {
                            cartData && cartData.map((item, index) => (
                                <CartSingle key={index} data={item} />
                            ))
                        }
                    </div>
                </div>
                <div className="px-4 py-3 border-t">
                    <Link to="/checkout"> {/* Replace with your checkout route */}
                        <button className="w-full bg-[#e44343] text-white py-3 rounded-md font-[600] hover:bg-[#d02222] transition">
                            Checkout Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

const CartSingle = ({ data }) => {
    const [value, setValue] = useState(1);
    const totalPrice = data.price * value;
    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                <div>
                    <div
                        className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
                        onClick={() => setValue(value + 1)}
                    >
                        <HiPlus size={18} color="fff" />
                    </div>
                    <span className="pl-[10px]">{value}</span>
                    <div
                        className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
                        onClick={() => setValue(value === 1 ? 1 : value - 1)}
                    >
                        <HiOutlineMinus size={16} color="#7d879c" />
                    </div>
                </div>
                <img
                    src="https://isto.pt/cdn/shop/files/Heavyweight_Black_ef459afb-ff7a-4f9a-b278-9e9621335444.webp?v=1744369639"
                    alt=""
                    className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
                />
                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    <h4 className="font-[400] text-[15px] text-[#00000082]">
                        ${data.discountPrice} * {value}
                    </h4>
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
                        US${totalPrice}
                    </h4>
                </div>
                <RxCross1 className="cursor-pointer" />

            </div>
        </div>
    )
}

export default Cart;