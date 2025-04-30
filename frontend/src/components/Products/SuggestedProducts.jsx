import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { productData } from "../../static/data";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProducts = ({ product }) => {
    const [products, setProducts] = useState(null);
    useEffect(() => {
        if (!product || !product.category) return;

        const suggestedProducts = productData?.filter((item) => item.category === product.category);
        setProducts(suggestedProducts || []);
    }, [product]);
    return (
        <div>
            {product ? (
                <div className={`p-4 ${styles.section}`}>
                    <h2
                        className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
                    >
                        Related Product
                    </h2>
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                        {
                            products && products.map((product, index) => (
                                <ProductCard data={product} key={index} />
                            ))
                        }
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default SuggestedProducts;