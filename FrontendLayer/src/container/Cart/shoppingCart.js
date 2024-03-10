import React, { useState } from 'react';
import axios from 'axios';

const ShoppingCart = (props) => {

    const productsInCart = props.productsInCart || []; // Default to empty array if productsInCart is null or undefined;

    // State variable to hold the success message text
    const [smessage, setSuccessMessage] = useState('');

    // State variable to hold the failed message text
    const [fmessage, setFailMessage] = useState('');

    //Function to display a successful message
    const showSuccessMessage = (text) => {
        setSuccessMessage(text);
    };
    //Function to display a failed message
    const showFailMessage = (text) => {
        setFailMessage(text);
    };

    const bufferToBase64 = buffer => {
        const binary = Array.from(new Uint8Array(buffer));
        return btoa(binary.map(byte => String.fromCharCode(byte)).join(''));
    };

    const handleOnDelete = async (event) => {
        try {
            props.setProductsInCart([]); //clear the CART
            props.onCart([])
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleOnSubmit = async (event) => {
        try {
            const response = await axios.put(`http://localhost:9000/api/updateProduct/`, productsInCart);

            props.setProductsInCart([]); //clear the CART
            props.onCart([])

            //To update the latest List of products from db into local storage
            // Convert binary image data to base64-encoded string for each product
            const updatedProducts = response.data.products.map(product => ({
                ...product,
                productImageFile: product.productImageFile ? `data:image/jpeg;base64,${bufferToBase64(product.productImageFile.data)}` : null
            }));

            props.onUpdateProductList(updatedProducts);

            if (response.data.failedProducts.length > 0) {
                let failedProductsMessage = "The items listed below have insufficient stock or are out of stock. We have removed them from your cart. Sorry for the inconvenience!\n\n";

                response.data.failedProducts.forEach(fProduct => {
                    let recordForQty = updatedProducts.find(uProduct => uProduct._id === fProduct._id);
                    failedProductsMessage += `${fProduct.productName} \nYour Selected Quantity: ${fProduct.selectedQuantity} -  Quantity available in Stock: ${recordForQty.productQuantity}\n\n `;
                });
                //Set new lines in the message
                showFailMessage(failedProductsMessage.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br /></span>
                }));
            }

            if (response.data.successProducts.length > 0) {
                let successMessage = "\nOrder successful for the below items!\n\n";

                response.data.successProducts.forEach(product => {
                    successMessage += `${product.productName} \nYour Selected Quantity: ${product.selectedQuantity}\n\n`;
                });
                successMessage += "\nThank you for shopping with Sumazon!";

                showSuccessMessage(successMessage.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br /></span>
                }));
            }

        } catch (error) {
            showFailMessage('Error in processing payment');
        }
    };

    return (
        <div className='container'>

            <h1 style={{ marginTop: '10px', color: 'blue' }}>Shopping Cart </h1>
            <div> {fmessage && <label style={{ color: "red", marginTop: '20px' }}>{fmessage}</label>} </div>
            <div>{smessage && <label style={{ color: "green", marginTop: '20px' }}>{smessage}</label>}</div>

            {(productsInCart && productsInCart.length > 0 ?

                (<div >
                    <p>Review your order:</p>
                    <ul style={{ padding: 0 }}>
                        {Array.isArray(productsInCart) && productsInCart.map(product => (
                            <li key={product._id} style={{ marginBottom: '10px', border: '1px solid gray', padding: '10px', borderRadius: '20px', listStyleType: 'none' }}>
                                {product.productImageFile && (
                                    <img src={product.productImageFile}
                                        alt={product.productName} height={'100px'} width={'150px'} />
                                )}
                                <p style={{ marginTop: '20px' }}><b>Item: </b>{product.productName}</p>
                                <p><b>Price:</b> ${product.productPrice}</p>
                                <p><b>Quantity:</b> {product.selectedQuantity}</p>
                            </li>
                        ))}
                    </ul>

                    <button onClick={handleOnSubmit} style={{
                        marginTop: '20px', fontSize: '20px', padding: '10px 20px',
                        borderRadius: '5px', backgroundColor: 'blue', color: 'white'
                    }}>Proceed to Payment</button>

                    {/* Delete all Cart items functionality */}
                    <button onClick={handleOnDelete}
                        style={{
                            fontSize: '20px', padding: '10px 20px', marginLeft: '20px',
                            borderRadius: '5px', backgroundColor: 'blue', color: 'white'
                        }}>Delete Cart</button>
                </div>)

                :
                (<p style={{ marginTop: '50px', color: 'blue' }} >'Cart is empty! Click on HOME to continue shopping'</p>)

            )}

        </div>
    )
};
export default ShoppingCart