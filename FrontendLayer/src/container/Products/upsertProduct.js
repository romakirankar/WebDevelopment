//Only for admin
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Form, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import FileBase64 from 'react-file-base64';
import ImageCompressor from 'image-compressor.js';
import { useNavigate } from 'react-router-dom';

const UpsertProduct = (props) => {
    
    // Product form to be upserted.
    const [formData, setFormData] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        productImageFile: '',
        productQuantity: ''
    });

    const navigation = useNavigate();

    const [fileBase64Key, setfileBase64Key] = useState(0); // Key for FileBase64 component

    const productToBeModifiedByAdmin = props.productToBeModifiedByAdmin;

    const [addOrModifyFlag, setAddOrModifyFlag] = useState('');

    // State variable to hold the message text
    const [message, setMessage] = useState('');

    //Function to display a message
    const showMessage = (text, isError) => {
        setMessage({ text, isError });
    };

    useEffect(() => {

        // Check if productToBeModifiedByAdmin contains data
        if (productToBeModifiedByAdmin.productName !== '') {
            setAddOrModifyFlag('modify');
            showMessage(" ");

        } else {
            setAddOrModifyFlag('add');
            showMessage(" ");

            // Reset FileBase64 component by reversing/changing the key
            setfileBase64Key(previousKey => previousKey + 1);
            setFormData({ productName: '', productPrice: '', productDescription: '', productImageFile: '', productQuantity: '' });

        }
        setFormData(productToBeModifiedByAdmin);

    }, [productToBeModifiedByAdmin]);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = async (fileBase64) => {
        try {
            showMessage(" ");
            //check if file is image - extract file type
            const fileType = fileBase64.split(';')[0].split('/')[1];

            if (fileType === 'jpeg' || fileType === 'jpg' || fileType === 'png' || fileType === 'gif') {

                //COMPRESSING IMAGE Convert base64 to Blob
                const blob = await fetch(fileBase64).then(res => res.blob());

                // Compress the Blob
                const compressor = new ImageCompressor();
                const compressedBlob = await compressor.compress(blob, {
                    maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true,
                });

                // Convert compressed Blob back to base64
                const compressedBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(compressedBlob);
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                });

                // Update state with the compressed base64
                setFormData({
                    ...formData,
                    productImageFile: compressedBase64,
                });
            }

            else {
                // Clear the file data
                setFormData({
                    ...formData,
                    productImageFile: '',
                });

                showMessage('Only image files (JPEG, JPG, PNG, GIF) are allowed.', false);

                // Reset FileBase64 by reversing/changing the key
                setfileBase64Key(previousKey => previousKey + 1);
            }

        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.productName === '' || formData.productDescription === '' || formData.productPrice === '' || formData.productImageFile === '' || formData.productQuantity === '') {
            return showMessage("Some information is missing.", false);
        }

        let payload = {
            action: addOrModifyFlag === 'add' ? "createProduct" : "modifyProduct",
            payload: formData
        };

        try {
            const res = await axios.post('http://localhost:9000/api/createProduct', payload);
            if (res.status === 200) {
                res.data.productRecord.productImageFile = res.data.base64image; //convert image to base64 type

                if (addOrModifyFlag === 'add') {
                    let productList = props.productList || [];
                    productList.push({
                        _id: res.data.productRecord._id,
                        productName: res.data.productRecord.productName,
                        productPrice: res.data.productRecord.productPrice,
                        productDescription: res.data.productRecord.productDescription,
                        productImageFile: res.data.productRecord.productImageFile,
                        productQuantity: res.data.productRecord.productQuantity
                    });

                    props.setProdList(productList);
                    props.onUpdateProductList(productList);
                    showMessage('Product added successfully!', true);
                    //clear screen
                    setFormData({ productName: '', productPrice: '', productDescription: '', productImageFile: '', productQuantity: '' });
                }

                else {
                    props.setProductToBeModifiedByAdmin(formData);
                    const updatedProductList = props.productList.map(product => {
                        if (product._id === res.data.productRecord._id) {
                            return res.data.productRecord; // Replace the modified product with the updated data
                        }
                        return product;
                    });
                    props.setProdList(updatedProductList);
                    props.onUpdateProductList(updatedProductList);
                    showMessage('Product modified successfully!', true);
                    navigation(`/displayProducts/${res.data.productRecord._id}`);

                }

            }

        }
        catch (error) {
            showMessage('Error in adding/modifying the product!', false);
        }
    }

    return (
        <div className="container" >
            {addOrModifyFlag === 'modify' ?
                (<h1 style={{ marginTop: '10px', color: 'blue' }}>Modify Product</h1>)
                : (<h1 style={{ marginTop: '10px', color: 'blue' }}>Add a new product</h1>)
            }

            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} style={{ marginTop: '50px' }} controlId="productName">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Name
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="name" required minLength="3" style={{ fontSize: '20px', color: 'grey' }} name="productName"
                            value={formData.productName} onChange={handleInputChange}
                        />
                        <Form.Text muted>Enter a valid product name with atleast 3 characters </Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} style={{ marginTop: '50px' }} controlId="productPrice">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Price
                    </Form.Label>
                    <Col sm={10} >
                        <Form.Control style={{ fontSize: '20px', color: 'grey' }} name="productPrice"
                            pattern="[0-9.]{1,}"
                            value={formData.productPrice} onChange={handleInputChange} />
                        <Form.Text muted>Enter a valid product price</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} style={{ marginTop: '50px' }} controlId="productDescription">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Description
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="name" required minLength="3" style={{ fontSize: '20px', color: 'grey' }} name="productDescription"
                            value={formData.productDescription} onChange={handleInputChange}
                        />
                        <Form.Text muted>Enter a valid description of atleast 3 characters</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} style={{ marginTop: '50px' }} controlId="productQuantity">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Product Quantity
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="number" min="0" style={{ fontSize: '20px', color: 'grey' }} name="productQuantity"
                            value={formData.productQuantity} onChange={handleInputChange} />
                        <Form.Text muted>Enter a valid product quantity </Form.Text>
                    </Col>
                    {/* type="textarea" */}
                </Form.Group>

                <Form.Group as={Row} style={{ marginTop: '50px' }} controlId="productImageFile">
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Upload File
                    </Form.Label>
                    <Col sm={10}>
                        <FileBase64
                            key={fileBase64Key} // Use key to reset the component
                            multiple={false} onDone={({ base64 }) => handleFileChange(base64)}


                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="image" controlId="imagePreview">
                    <Col sm={{ span: 1, offset: 2 }}>
                        {/* Buffer image type only for initial render of screen*/}
                        <Form.Group as={Row} className="image" controlId="imagePreview">
                            <Col sm={{ span: 10, offset: 2 }}>
                                {formData.productImageFile ?

                                    //fileBase64 type for all images that are newly uploaded
                                    (<img src={formData.productImageFile}
                                        alt={formData.productName} height={'100px'} width={'100px'}
                                    />)
                                    : null
                                }
                            </Col>
                        </Form.Group>

                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="addProduct" style={{ marginTop: '30px' }}>
                    <Col sm={2}>
                        {addOrModifyFlag === 'add' ?
                            (<Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>
                                Add Product
                            </Button>)
                            :
                            (<Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>
                                Modify Product
                            </Button>)
                        }
                    </Col>

                    <Col>
                        {/* Hidden label element to display messages */}
                        <label style={{ display: message.text ? 'block' : 'none', color: message.isError ? "green" : "red" }}>{message.text}</label>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    );
};

export default UpsertProduct;
