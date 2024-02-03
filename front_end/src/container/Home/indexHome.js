import React from 'react';
import ProductList from '../Products/fetchProducts';

const Homepage = (props) => {
    return (
        <div className="container">
            <h1 className="text-center" style={{ marginTop: '50px' }}>Welcome to Our Store!</h1>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <ProductList setProdList={props.setProdList} />
                </div>
            </div>
        </div>
    );
};

export default Homepage;
