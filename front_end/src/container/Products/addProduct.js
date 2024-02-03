import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Form, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import FileBase64 from 'react-file-base64';

const AddProduct = (props) => {
    const [formData, setFormData] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        productImageBase64: ''
    });

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (base64) => {
        setFormData({
            ...formData,
            productImageBase64: base64 // Store the base64-encoded image in state
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.productName === '' || formData.productDescription === '' || formData.productPrice === '' || formData.productImageBase64 === '') {
            return alert("Information is missing.");
        }
        try {
            const response = await axios.post('http://localhost:9000/api/createProduct',formData);

            if (response.status === 201) { 
                alert('Product added successfully!') 
            };
        }
        catch (error) {
            alert('Error adding the product!');
        }
    };

    return (
        <div  className="container">
            <h1 style={{ marginTop: '50px', color: 'blue'}}>Add a new product</h1>
            <Form className="mb-3" onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" style={{ marginTop: '50px' }} controlId="productName">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Name
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="name" style={{ fontSize: '20px', color: 'grey' }} name="productName" value={formData.productName} onChange={handleInputChange} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" style={{ marginTop: '50px' }} controlId="productPrice">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Price
                    </Form.Label>
                    <Col sm={10} >
                        <Form.Control type="number" style={{ fontSize: '20px', color: 'grey' }} name="productPrice" value={formData.productPrice} onChange={handleInputChange} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" style={{ marginTop: '50px' }} controlId="productDescription">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Description
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="textarea" style={{ fontSize: '20px', color: 'grey' }} name="productDescription" value={formData.productDescription} onChange={handleInputChange} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" style={{ marginTop: '50px' }} controlId="productImageFile">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Upload File
                    </Form.Label>
                    <Col sm={10}>
                        <FileBase64 multiple={false} onDone={({ base64 }) => handleFileChange(base64)} />
                        {/* <Form.Control type="file" style={{ fontSize: '20px', color: 'grey' }} name="file" onChange={handleFileChange}/> */}
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="addProduct" style={{ marginTop: '30px' }}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Add Product</Button>
                    </Col>
                </Form.Group>
            </Form>

        </div>
    );
};

export default AddProduct;
