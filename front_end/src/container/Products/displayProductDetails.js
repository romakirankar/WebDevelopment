import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const DisplayProductDetails = (props) => {
    const productList = props.productList;
    const { productIdUrl } = useParams();
    const [product, setProduct] = useState(null); 
    const navigation = useNavigate();
    useEffect(() => {

        const fetchProductDetails = async () => {
            try {
                const productSelected = productList.find(product => product._id === productIdUrl);
                setProduct(productSelected)
            } catch (error) {
                console.error('Error in fetching product details');
            }
        };
        fetchProductDetails();
    }, [productIdUrl]);

    if (!product) {
        return <div>Page is loading. Kindly wait.</div>;
    }

    const { productName, productPrice, productDescription, productImageFile } = product;

    // Convert binary image data to base64-encoded string
    const bufferToBase64 = buffer => {
        const binary = Array.from(new Uint8Array(buffer));
        return btoa(binary.map(byte => String.fromCharCode(byte)).join(''));
    };

    //on click of Add to cart
    const handleSubmitAddToCart = async (event) => {

        event.preventDefault();
        let productCartList = props.productsInCart;
        productCartList.push(product);
        props.setProductsInCart(productCartList);
        
        alert("Item added to cart successfully!");
    };

    const handleSubmitGoToCart = async (event) => {
        navigation("/viewCart");
    };
    

    return (
        <div className="container" >
            <h1 style={{ marginTop: '50px', color: 'blue' }}>{productName}</h1>

            <img
                src={`data:image/jpeg;base64,${bufferToBase64(productImageFile.data)}`}
                alt={productName} height={'400px'} width={'400px'}
                style={{ marginBottom: '10px', border: '1px solid gray', padding: '10px', borderRadius: '20px' }}
            />
            <p><b>Price:</b> ${productPrice}</p>
            <p><b>Decription:</b>  {productDescription}</p>
            <Button type="submit" onClick={handleSubmitAddToCart} style={{ marginTop: '100px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Add to cart</Button>
            <Button type="submit" onClick={handleSubmitGoToCart} style={{ marginTop: '100px', marginLeft: '50px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Go to cart?</Button>
        
        </div>
    );
};
export default DisplayProductDetails;
