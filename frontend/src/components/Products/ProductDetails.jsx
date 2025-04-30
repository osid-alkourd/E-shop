import { Profiler, useEffect, useState } from "react";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineMessage,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const ProductDetails = ({ product }) => {
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(0);
    const navigate = useNavigate();

    const incrementCount = () => {
        setCount(count + 1);
    };

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };
    const handleMessageSubmit = () => {

    }

    return (
        <div className="bg-white">
            {product ? (
                <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
                    <div className="w-full py-5">
                        <div className="block w-full 800px:flex">
                            <div className="w-full 800px:w-[50%]">
                                <img
                                    src={product.image_Url[select]?.url}
                                    alt=""
                                    className="w-[80%]"
                                />
                                <div className="w-full flex">
                                    <div
                                        className={`${select === 0 ? "border" : "null"
                                            } cursor-pointer`}
                                    >
                                        <img
                                            src={product?.image_Url[0].url}
                                            alt=""
                                            className="h-[200px]"
                                            onClick={() => setSelect(0)}
                                        />
                                    </div>
                                    <div
                                        className={`${select === 0 ? "border" : "null"
                                            } cursor-pointer`}
                                    >
                                        <img
                                            src={product?.image_Url[0].url}
                                            alt=""
                                            className="h-[200px]"
                                            onClick={() => setSelect(0)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full 800px:w-[50%]">
                                <h1 className={`${styles.productTitle}`}>{product.name}</h1>
                                <p>{product.description}</p>
                                <div className="flex pt-3">
                                    <h4 className={`${styles.productDiscountPrice}`}>
                                        {product.discount_price}$
                                    </h4>
                                    <h3 className={`${styles.price}`}>
                                        {product.price ? product.price + "$" : null}
                                    </h3>
                                </div>
                                <div className="flex items-center mt-12 justify-between pr-3">
                                    <div>
                                        <button
                                            onClick={decrementCount}
                                            className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                                        >
                                            -
                                        </button>
                                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                                            {count}
                                        </span>
                                        <button
                                            onClick={incrementCount}
                                            className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        {click ? (
                                            <AiFillHeart
                                                size={30}
                                                className="cursor-pointer"
                                                onClick={() => setClick(!click)}
                                                color={click ? "red" : "#333"}
                                                title="Remove from wishlist"
                                            />
                                        ) : (
                                            <AiOutlineHeart
                                                size={30}
                                                className="cursor-pointer"
                                                onClick={() => setClick(!click)}
                                                title="Add to wishlist"
                                                color={click ? "red" : "#333"}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                                >
                                    <span className="text-white flex items-center">
                                        Add to cart <AiOutlineShoppingCart className="ml-1" />
                                    </span>
                                </div>

                                <div className="flex items-center pt-8">
                                    <Link to={`/shop/preview/${product?.shop?._id}`}>
                                        <img
                                            src={product.shop.shop_avatar.url}
                                            alt=""
                                            className="w-[50px] h-[50px] rounded-full mr-2"
                                        />
                                    </Link>
                                    <div className="pr-8">
                                        <Link to={`/shop/preview/${product?.shop?._id}`}>
                                            <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                                                {product?.shop?.name}
                                            </h3>
                                        </Link>
                                        <h5 className="pb-3 text-[15px]">({product.shop.ratings}) Ratings</h5>
                                    </div>
                                    <div
                                        className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                                        onClick={handleMessageSubmit}
                                    >
                                        <span className="text-white flex items-center">
                                            Send Message <AiOutlineMessage className="ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* here */}
                    <ProductDetailsInfo product={product} />
                    <br />
                    <br />
                </div>
            ) : null}
        </div>
    );
};

const ProductDetailsInfo = ({ product }) => {
    const [active, setActive] = useState(1);
    return (
        <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
            <div className="w-full flex justify-between border-b pt-10 pb-2">
                <div className="relative">
                    <h5
                        className={
                            "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
                        }
                        onClick={() => setActive(1)}
                    >
                        Product Details
                    </h5>
                    {active === 1 ? (
                        <div className={`${styles.active_indicator}`} />
                    ) : null}
                </div>
                <div className="relative">
                    <h5
                        className={
                            "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
                        }
                        onClick={() => setActive(2)}
                    >
                        Product Reviews
                    </h5>
                    {active === 2 ? (
                        <div className={`${styles.active_indicator}`} />
                    ) : null}
                </div>
                <div className="relative">
                    <h5
                        className={
                            "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
                        }
                        onClick={() => setActive(3)}
                    >
                        Seller Information
                    </h5>
                    {active === 3 ? (
                        <div className={`${styles.active_indicator}`} />
                    ) : null}
                </div>
            </div>
            {active === 1 ? (
                <>
                    <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
                        {product.description}
                    </p>
                </>
            ) : null}

            {active === 2 ? (
                <div className="w-full justify-center min-h-[40vh] flex flex-col items-center">
                    <p>
                        no reviews yet !!
                    </p>
                </div>
            ) : null}

            {active === 3 ? (
                <div className="w-full block 800px:flex p-5">
                    <div className="w-full 800px:w-[50%]">
                        <div className="flex items-center">
                            <img
                                src={`${product?.shop?.shop_avatar?.url}`}
                                className="w-[50px] h-[50px] rounded-full"
                                alt=""
                            />
                            <div className="pl-3">
                                <h3 className={`${styles.shop_name}`}>
                                    {product.shop.name}
                                </h3>
                                <h5 className="pb-3 text-[15px]">({product.shop.ratings}) Ratings</h5>
                            </div>
                        </div>
                        <p className="pt-2">{product.description}</p>

                    </div>
                    {/*  */}
                    <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
                        <div className="text-left">
                            <h5 className="font-[600]">
                                Joined on:
                                <span className="font-[500]">
                                    30 April
                                </span>
                            </h5>
                            <h5 className="font-[600]">
                                Total Product:
                                <span className="font-[500]">
                                    1202
                                </span>
                            </h5>
                            <h5 className="font-[600]">
                                Total Reviews:
                                <span className="font-[500]">
                                    400
                                </span>
                            </h5>
                            <Link to="/">
                                <div
                                    className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                                >
                                    <h4 className="text-white">Visit Shop</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>


            ) : null}

        </div>
    );
    // return (
    //     <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
    //         <div className="w-full flex justify-between border-b pt-10 pb-2">
    //             <div className="relative">
    //                 <h5
    //                     className={
    //                         "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
    //                     }
    //                     onClick={() => setActive(1)}
    //                 >
    //                     Product Details
    //                 </h5>
    //                 {active === 1 ? (
    //                     <div className={`${styles.active_indicator}`} />
    //                 ) : null}
    //             </div>
    //             <div className="relative">
    //                 <h5
    //                     className={
    //                         "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
    //                     }
    //                     onClick={() => setActive(2)}
    //                 >
    //                     Product Reviews
    //                 </h5>
    //                 {active === 2 ? (
    //                     <div className={`${styles.active_indicator}`} />
    //                 ) : null}
    //             </div>
    //             <div className="relative">
    //                 <h5
    //                     className={
    //                         "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
    //                     }
    //                     onClick={() => setActive(3)}
    //                 >
    //                     Seller Information
    //                 </h5>
    //                 {active === 3 ? (
    //                     <div className={`${styles.active_indicator}`} />
    //                 ) : null}
    //             </div>
    //         </div>
    //         {active === 1 ? (
    //             <>
    //                 <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
    //                     {product.description}
    //                 </p>
    //             </>
    //         ) : null}

    //         {active === 2 ? (
    //             <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
    //                 {product &&
    //                     product.reviews.map((item, index) => (
    //                         <div className="w-full flex my-2">
    //                             <img
    //                                 src={`${item.user.avatar?.url}`}
    //                                 alt=""
    //                                 className="w-[50px] h-[50px] rounded-full"
    //                             />
    //                             <div className="pl-2 ">
    //                                 <div className="w-full flex items-center">
    //                                     <h1 className="font-[500] mr-3">{item.user.name}</h1>
    //                                     {/* <Ratings rating={data?.ratings} /> */}
    //                                 </div>
    //                                 <p>{item.comment}</p>
    //                             </div>
    //                         </div>
    //                     ))}

    //                 <div className="w-full flex justify-center">
    //                     {product && product.reviews.length === 0 && (
    //                         <h5>No Reviews have for this product!</h5>
    //                     )}
    //                 </div>
    //             </div>
    //         ) : null}

    //         {active === 3 && (
    //             <div className="w-full block 800px:flex p-5">
    //                 <div className="w-full 800px:w-[50%]">
    //                     <Link to={`/shop/preview/${product.shop._id}`}>
    //                         <div className="flex items-center">
    //                             <img
    //                                 src={`${product?.shop?.avatar?.url}`}
    //                                 className="w-[50px] h-[50px] rounded-full"
    //                                 alt=""
    //                             />
    //                             <div className="pl-3">
    //                                 <h3 className={`${styles.shop_name}`}>{product.shop.name}</h3>
    //                                 <h5 className="pb-2 text-[15px]">
    //                                     (averageRating/5) Ratings
    //                                 </h5>
    //                             </div>
    //                         </div>
    //                     </Link>
    //                     <p className="pt-2">{product.shop.description}</p>
    //                 </div>
    //                 <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
    //                     <div className="text-left">
    //                         <h5 className="font-[600]">
    //                             Joined on:{" "}
    //                             <span className="font-[500]">
    //                                 {product.shop?.createdAt?.slice(0, 10)}
    //                             </span>
    //                         </h5>
    //                         <h5 className="font-[600] pt-3">
    //                             Total Products:{" "}
    //                             <span className="font-[500]">
    //                                 product
    //                             </span>
    //                         </h5>
    //                         <h5 className="font-[600] pt-3">
    //                             Total Reviews:{" "}
    //                             <span className="font-[500]">totalReviewsLength</span>
    //                         </h5>
    //                         <Link to="/">
    //                             <div
    //                                 className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
    //                             >
    //                                 <h4 className="text-white">Visit Shop</h4>
    //                             </div>
    //                         </Link>
    //                     </div>
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // );
};



export default ProductDetails;
