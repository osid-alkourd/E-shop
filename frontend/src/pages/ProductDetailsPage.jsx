import { useEffect , useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProducts from "../components/Products/SuggestedProducts";
import { productData } from "../static/data";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
    const {name} = useParams(); // name = "iphone-13-pro"
    const [product,setProduct] = useState(null);
    const productName = name.replace(/-/g," "); // productName = "iphone 13 pro"
    useEffect(() => {
        const foundProduct = productData.find((product) => product.name === productName);
        setProduct(foundProduct);
    },[productName]);

    console.log(product);
    return(
        <div>
            <Header/>
            <ProductDetails product={product}/>
            <SuggestedProducts product={product}/>
            <Footer/>
        </div>
    )
}

export default ProductDetailsPage;
