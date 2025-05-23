import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { productData } from '../../../static/data'


const BestDeals = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const products = productData && productData.sort((a, b) => b.total_sell - a.total_sell);
        const firstFiveProduct = products.slice(0, 5);
        setData(firstFiveProduct);
    }, [])

    return (
        <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading}`}>
                    <h1>Best Deals</h1>
                </div>
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
                    {
                        data && data.length > 0 && (
                            <>
                                {data && data.map((product, index) => <ProductCard data={product} key={index} />)}
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );

}
export default BestDeals;