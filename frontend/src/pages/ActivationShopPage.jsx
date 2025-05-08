import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const ActivationShopPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setError(false);
        setIsLoading(true);
        if (!activation_token) {
            setError(true)  ;
            setIsLoading(false);
            return;
        }

        const activateShopAccount = async () => {
            try {
                await axios.post(
                    `${server}/shops/activation`,
                    { activation_token },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        activateShopAccount();
    }, [activation_token]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <p className="text-lg text-gray-600">Activating your shop account...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
            {error ? (
                <>
                    <p className="text-lg text-red-500 font-medium">Your token is expired or invalid!</p>
                    <p className="text-gray-600">Please request a new activation link.</p>
                </>
            ) : (
                <>
                    <p className="text-lg text-green-500 font-medium">Your shop account has been created successfully!</p>
                    <p className="text-gray-600">You can now log in to your seller dashboard.</p>
                </>
            )}
        </div>
    );
};

export default ActivationShopPage;