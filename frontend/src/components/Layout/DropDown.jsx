import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const DropDown = ({ categoriesData, setDropDown }) => {
    const navigate = useNavigate();
        const submitHandle = (category) => {
            navigate(`/products?category=${category.title}`);
            setDropDown(false);
            window.location.reload();
        };

    return (
        <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
            {categoriesData && categoriesData.length > 0 ? (
                categoriesData.map((category, index) => (
                    <div
                        key={index}
                        className={`${styles.noramlFlex}`} // Assuming normalFlex is correct now
                        onClick={() => submitHandle(category)}
                    >
                        <img
                            src={category.image_Url}
                            style={{
                                width: "25px",
                                height: "25px",
                                objectFit: "contain",
                                marginLeft: "10px",
                                userSelect: "none",
                            }}
                            alt=""
                        />
                        <h3 className="m-3 cursor-pointer select-none">{category.title}</h3>

                    </div>
                ))
            ) : (
                <p>No categories available</p> // Fallback message if no categories are found
            )}
        </div>
    );


}

export default DropDown;