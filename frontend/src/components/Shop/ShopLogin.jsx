import { React, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ import icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ShopLogin = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false); // 👈 toggle state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // For validation errors

    const handleLoginShopSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${server}/shops/login`,
                { email, password },
                { withCredentials: true }
            );
            if (data.success && data.message && data.message.includes("Activation link resent")) {
                toast.info(data.message);
                toast.info("Please check your email to activate your account before logging in.");
                return;
            }
            // Case 2: Successful login
            toast.success("Login successful!");
            // navigate("/dashboard"); // Or wherever you want to redirect

        } catch (error) {
            if (error.response?.status === 401) {
                toast.error(error.response.data?.message || "Invalid email or password");
                return;
            }
            if ((error.response?.status >= 400 && error.response?.status < 500)) {
                const backendErrors = error.response.data?.errors;
                const formattedErrors = {};

                if (Array.isArray(backendErrors)) {
                    backendErrors.forEach(err => {
                        formattedErrors[err.field] = err.message;
                    });
                }

                setErrors(formattedErrors);
                toast.error("Please fix the form errors");
                return;
            }
            // server erros
            toast.error(error.response?.data?.message || "Login failed. Please try again later.");


        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Login to your Shop
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {errors.general && (
                        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                            {errors.general}
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleLoginShopSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`appearance-none block w-full px-3 py-2 border ${
                                        errors.email ? "border-red-300" : "border-gray-300"
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`appearance-none block w-full px-3 py-2 border ${
                                        errors.password ? "border-red-300" : "border-gray-300"
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />

                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>
                        <div className={`${styles.noramlFlex} justify-between`}>
                            <div className={`${styles.noramlFlex}`}>
                                <input
                                    type="checkbox"
                                    name="remember-me"
                                    id="remember-me"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a
                                    href=".forgot-password"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
                                    loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                        <div className={`${styles.noramlFlex} w-full`}>
                            <h4>Not have any account?</h4>
                            <Link to="/sign-up" className="text-blue-600 pl-2">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    //         <div className="sm:mx-auto sm:w-full sm:max-w-md">
    //             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    //                 Login to your Shop
    //             </h2>
    //         </div>
    //         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    //             <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
    //                 <form className="space-y-6" onSubmit={handleLoginShopSubmit}>
    //                     <div>
    //                         <label
    //                             htmlFor="email"
    //                             className="block text-sm font-medium text-gray-700"
    //                         >
    //                             Email address
    //                         </label>
    //                         <div className="mt-1">
    //                             <input
    //                                 type="email"
    //                                 name="email"
    //                                 autoComplete="email"
    //                                 required
    //                                 value={email}
    //                                 onChange={(e) => setEmail(e.target.value)}
    //                                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //                             />
    //                         </div>
    //                     </div>
    //                     <div>
    //                         <label
    //                             htmlFor="password"
    //                             className="block text-sm font-medium text-gray-700"
    //                         >
    //                             Password
    //                         </label>
    //                         <div className="mt-1 relative">
    //                             <input
    //                                 type={visible ? "text" : "password"} // 👈 switch type
    //                                 name="password"
    //                                 autoComplete="current-password"
    //                                 required
    //                                 value={password}
    //                                 onChange={(e) => setPassword(e.target.value)}
    //                                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //                             />

    //                             {visible ? (
    //                                 <AiOutlineEye
    //                                     className="absolute right-2 top-2 cursor-pointer"
    //                                     size={25}
    //                                     onClick={() => setVisible(false)}
    //                                 />
    //                             ) : (
    //                                 <AiOutlineEyeInvisible
    //                                     className="absolute right-2 top-2 cursor-pointer"
    //                                     size={25}
    //                                     onClick={() => setVisible(true)}
    //                                 />
    //                             )}

    //                         </div>
    //                     </div>
    //                     <div className={`${styles.noramlFlex} justify-between`}>
    //                         <div className={`${styles.noramlFlex}`}>
    //                             <input
    //                                 type="checkbox"
    //                                 name="remember-me"
    //                                 id="remember-me"
    //                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    //                             />
    //                             <label
    //                                 htmlFor="remember-me"
    //                                 className="ml-2 block text-sm text-gray-900"
    //                             >
    //                                 Remember me
    //                             </label>
    //                         </div>
    //                         <div className="text-sm">
    //                             <a
    //                                 href=".forgot-password"
    //                                 className="font-medium text-blue-600 hover:text-blue-500"
    //                             >
    //                                 Forgot your password?
    //                             </a>
    //                         </div>
    //                     </div>
    //                     <div>
    //                         <button
    //                             type="submit"
    //                             className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    //                         >
    //                             Submit
    //                         </button>
    //                     </div>
    //                     <div className={`${styles.noramlFlex} w-full`}>
    //                         <h4>Not have any account?</h4>
    //                         <Link to="/sign-up" className="text-blue-600 pl-2">
    //                             Sign Up
    //                         </Link>
    //                     </div>
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    // );
};



export default ShopLogin;
