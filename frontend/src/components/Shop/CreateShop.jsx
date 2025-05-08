import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server"
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { set } from "mongoose";

const CreateShop = () => {
    // const [email, setEmail] = useState("");
    // const [name, setName] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState();
    // const [address, setAddress] = useState("");
    // const [zipCode, setZipCode] = useState();
    // const [avatar, setAvatar] = useState();
    // const [password, setPassword] = useState("");
    // const [confirmedPassword, setConfirmedPassword] = useState("");
    const [visible, setVisible] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        phoneNumber: "",
        address: "",
        zipCode: "",
        avatar: null,
        password: "",
        confirmedPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleShopSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false)
        try {
            const formDataToSend = prepareFormData(formData);
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            // create new shop
            const response = await axios.post(`${server}/shops`, formDataToSend, config);
            const { success, message, errors } = response.data;
            if (success) {
                setSuccess(true);
                setSuccessMessage(message);
                toast.success(message || 'Registration successful! Check your email for activation.')
                return;
            }
            // handle response errors
            // handleErrorResponse(errors, message);

        } catch (err) {
            handleRequestError(err);
            console.log(err)
        } finally {
            setLoading(false);

        }

    }

    // Helper: Prepare FormData
    const prepareFormData = (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        return formData;
    };

    // // Helper: Handle API error responses
    // const handleErrorResponse = (errors, fallbackMessage) => {
    //     if (errors?.length) {
    //         const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join('\n');
    //         setError(errorMessages);
    //     } else {
    //         setError(fallbackMessage || 'Registration failed. Please try again.');
    //     }
    // };

    // Helper: Handle network/request errors
    const handleRequestError = (err) => {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (err.response) {
            if (err.response.data?.errors?.length) {
                errorMessage = err.response.data.errors.map(err => `${err.field}: ${err.message}`).join('\n');
            } else {
                errorMessage = err.response.data?.message || errorMessage;
            }
        } else if (err.request) {
            errorMessage = 'Network error. Please check your connection.';
        }else{
          setError('An unexpected error occurred. Please try again.');
        }
        setError(errorMessage);
        toast.error(errorMessage); 
    };


    const handleFileInputChange = (e) => {
        // const file = e.target.files[0];
        // setFormData({ ...formData, avatar: file });
        setFormData(prev => ({ ...prev, avatar: e.target.files[0] }));

    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register as a seller
                </h2>
            </div>
            {/* Error display area - shows all validation errors */}
            {error && (
                <div className="error-message" style={{
                    color: 'red',
                    backgroundColor: '#ffeeee',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    whiteSpace: 'pre-line' // Preserves line breaks from error messages
                }}>
                    {error}
                </div>
            )}

            {/* Success message */}
            {success && (
                <div className="success-message" style={{
                    color: 'green',
                    backgroundColor: '#eeffee',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px'
                }}>
                   {successMessage}
                </div>
            )}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleShopSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Shop Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                   type="tel"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

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
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="address"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Zip Code
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="zipcode"
                                    required
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="confirmedPassword"
                                    autoComplete="current-password"
                                    required
                                    value={formData.confirmedPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmedPassword: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700"
                            ></label>
                            <div className="mt-2 flex items-center">
                                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                                    {formData.avatar ? (
                                        <img
                                            src={URL.createObjectURL(formData.avatar)}
                                            alt="avatar"
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <RxAvatar className="h-8 w-8" />
                                    )}
                                </span>
                                <label
                                    htmlFor="file-input"
                                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        type="file"
                                        name="avatar"
                                        id="file-input"
                                        onChange={handleFileInputChange}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                        <div className={`${styles.noramlFlex} w-full`}>
                            <h4>Already have an account?</h4>
                            <Link to="/shop-login" className="text-blue-600 pl-2">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateShop;