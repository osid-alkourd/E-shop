import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
    const navigate = useNavigate();
    const handleCategoryClick = (categoryTitle) => {
        navigate(`/products?category=${categoryTitle}`);
    };
    return (
        <>
            <div className={`${styles.section} hidden sm:block`}>
                <div
                    className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
                >
                    {brandingData &&
                        brandingData.map((brand, index) => (
                            <div className="flex items-start" key={index}>
                                {brand.icon}
                                <div className="px-3">
                                    <h3 className="font-bold text-sm md:text-base">{brand.title}</h3>
                                    <p className="text-xs md:text-sm">{brand.Description}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div
                className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
                id="categories"
            >
                <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-6">
                        {categoriesData &&
                            categoriesData.map((category) => (
                                <div
                                    key={category.id}
                                    className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden hover:bg-gray-50 px-4 rounded-md transition"
                                    onClick={() => handleCategoryClick(category.title)}
                                >
                                    <h5 className="text-[18px] font-medium leading-[1.3]">{category.title}</h5>
                                    <img
                                        src={category.image_Url}
                                        alt={category.title}
                                        className="w-[120px] object-cover"
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Categories;