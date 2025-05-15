import Lottie from "lottie-react";
import LoadingAnimation from '../../Assets/Animation-1747225306506.json'

const Loader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: LoadingAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Lottie
                animationData={LoadingAnimation}
                loop
                autoplay
                style={{ width: 300, height: 300 }}
            />        </div>
    );
}
export default Loader;