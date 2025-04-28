import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart, } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from './DropDown';
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
const Header = ({ activeHeading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState(null);
    const [active, setActive] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filterdProduct = productData && productData.filter((product) => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        setSearchData(filterdProduct);
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 70) {
            setActive(true);
        } else {
            setActive(false);
        }
    });

    return (
        <>
            {/* Top Bar */}
            <div className={`${styles.section}`}>
                <div className="hidden 800px:flex items-center justify-between w-full h-[50px] my-[20px]">
                    {/* Logo */}
                    <div>
                        <Link to="/">
                            <img
                                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="w-[50%] relative">
                        <input
                            type="text"
                            placeholder="Search Product..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                        />
                        <AiOutlineSearch
                            size={30}
                            className="absolute right-2 top-1.5 cursor-pointer"
                        />
                        {/* Search Data Dropdown */}
                        {searchData && searchData.length !== 0 && (
                            <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                                {searchData.map((product, index) => (
                                    <Link key={index} to={`/product/${product.id}`}>
                                        <div className="w-full flex items-center py-3">
                                            <img
                                                src={product.image_Url[0]?.url}
                                                alt={product.name}
                                                className="w-[40px] h-[40px] mr-[10px]"
                                            />
                                            <h1>{product.name}</h1>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Seller Button */}
                    <div className={`${styles.button}`}>
                        <h1 className="text-[#fff] flex items-center">
                            Become a seller <IoIosArrowForward className="ml-1" />
                        </h1>
                    </div>
                </div>
            </div>

            {/* second bar */}

            <div className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
                } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
            >
                <div
                    className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
                >
                    {/* categories */}
                    <div>
                        <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                            <button
                                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
                            >
                                All Categories
                            </button>
                            <IoIosArrowDown
                                size={20}
                                className="absolute right-2 top-4 cursor-pointer"
                                onClick={() => setDropDown(!dropDown)}
                            />
                            {dropDown ? (
                                <DropDown categoriesData={categoriesData}
                                    setDropDown={setDropDown} />
                            ) : null}

                        </div>
                    </div>
                    {/* navItems */}
                    <div className={`${styles.noramlFlex}`}>
                        <Navbar active={activeHeading} />
                    </div>

                    {/* Icon */}
                    <div className="flex">
                        <div className={`${styles.noramlFlex}`}>
                            <div
                                className="relative cursor-pointer mr-[15px]"
                            >
                                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                    0
                                </span>
                            </div>
                        </div>

                        <div className={`${styles.noramlFlex}`}>
                            <div className="relative cursor-pointer w-fit mr-[15px]">
                                <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
                                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                    2
                                </span>
                            </div>
                        </div>

                        <div className={`${styles.noramlFlex}`}>
                            <div className="relative cursor-pointer w-fit mr-[15px]">
                                {isAuthenticated ? (
                                    <Link to="/profile">
                                        <img
                                            src={`${user?.avatar?.url}`}
                                            className="w-[35px] h-[35px] rounded-full"
                                            alt=""
                                        />
                                    </Link>) :(
                                    <Link to="/login">
                                        <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                                    </Link>
                                )
                                }
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>


    )

}
export default Header;