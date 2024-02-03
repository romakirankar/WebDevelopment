import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
// import {bufferToBase64} from '../Functions/bufferToBase64';

const ShoppingCart = (props) => {
    const product = props.productsInCart;
    console.log(product);

    {/* Convert binary image data to base64-encoded string */ }
    const bufferToBase64 = buffer => {
        const binary = Array.from(new Uint8Array(buffer));
        return btoa(binary.map(byte => String.fromCharCode(byte)).join(''));
    };

    return (
        <div className='container'>
            <h1 style={{ marginTop: '50px', color: 'blue' }}>Shopping Cart </h1>
            <p>Review your order:</p>
            <div >
                <ul style={{ padding: 0 }}>
                    {product.map(product => (
                        <li key={product._id} style={{ marginBottom: '10px', border: '1px solid gray', padding: '10px', borderRadius: '20px', listStyleType: 'none' }}>
                            {product.productImageFile && (
                                <img
                                    src={`data:image/jpeg;base64,${bufferToBase64(product.productImageFile.data)}`}
                                    alt={product.productName} height={'100px'} width={'150px'} />
                            )}
                            <p style={{ marginTop: '20px'}}><b>Item: </b>{product.productName}</p>
                            <p><b>Price:</b> ${product.productPrice}</p>
                            <p><b>Decription:</b>{product.productDescription}</p>
                        </li>
                    ))}
                </ul>
                <button style={{ marginTop: '100px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'flex-end' }}>Proceed to Payment</button>

            </div>
        </div>

    )
};
export default ShoppingCart