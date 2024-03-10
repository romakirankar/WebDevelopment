import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FetchProducts = (props) => {// { onUpdateProductList, setProdList }
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let productList = localStorage.getItem('productList');
                if (!productList) {
                    const response = await axios.get('http://localhost:9000/api/getProducts');
                    // Convert binary image data to base64-encoded string for each product
                    const updatedProducts = response.data.map(product => ({
                        ...product,
                        productImageFile: product.productImageFile ? `data:image/jpeg;base64,${bufferToBase64(product.productImageFile.data)}` : null
                    }));

                    setProducts(updatedProducts);
                    props.onUpdateProductList(updatedProducts);
                    props.setProdList(updatedProducts);

                } else {
                    setProducts(JSON.parse(productList)); // Parse the stored string to array
                    props.setProdList(JSON.parse(productList)); // Set productList in parent component
                }
            } catch (error) {
                console.error('Error in fetching products', error);
            }
        };
        fetchProducts();
        
    }, []); //[onUpdateProductList, setProdList]

    // Convert binary image data to base64-encoded string
    const bufferToBase64 = buffer => {
        const binary = Array.from(new Uint8Array(buffer));
        return btoa(binary.map(byte => String.fromCharCode(byte)).join(''));
    };

    const filteredProducts = searchQuery ? (products || []).filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    ) : products || [];

    return (
        <div>
            <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                }}
            />
            {filteredProducts.length === 0 ? (
                <p style={{ color: 'blue' }}>'Currently the item(s) is not available in the store. Please check again later.'</p>
            ) :
                (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {filteredProducts.filter(product => product !== null && product !== undefined).map(product => (
                        <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '15px' }}>
                            <Link to={{ pathname: `/displayProducts/${product._id}` }} style={{ textDecoration: 'none', color: '#333' }}>
                                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                    {product.productImageFile && (
                                        <img
                                            src={product.productImageFile}
                                            alt={product.productName}
                                            style={{ maxWidth: '100%', maxHeight: '150px' }}
                                        />
                                    )}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{product.productName}</p>
                                    <p style={{ fontSize: '14px', color: '#777', marginBottom: '5px' }}>${product.productPrice}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                    }
                </div>
                )
            }
        </div>
    );
};

export default FetchProducts;
