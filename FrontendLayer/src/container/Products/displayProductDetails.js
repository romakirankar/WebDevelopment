import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';
const DisplayProductDetails = (props) => {

    // List of products
    const productList = props.productList;

    // user obj to determine the role.
    const userRole = props.userObj.role;

    const { productIdUrl } = useParams();
    const [selectedQuantity, setSelectedQuantity] = useState(1); // quantity initially set to 1
    const [productDisplayed, setProductDisplay] = useState(null); //product details from the db - including quantity

    const navigation = useNavigate();

    // State variable to hold the message text
    const [message, setMessage] = useState('');

    //Function to display a message
    const showMessage = (text) => {
        setMessage(text);
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productSelected = productList.find(product => product._id === productIdUrl);
                setProductDisplay(productSelected);

            } catch (error) {
                console.error('Error in fetching product details');
            }
        };
        fetchProductDetails();

    }, [productIdUrl, productList]); //the useEffect hook will only run when these values change, preventing the infinite loop.

    if (!productDisplayed) {
        return <div>Page is loading. Kindly wait.</div>;
    }

    //on click of Add to cart
    const handleSubmitAddToCart = async (event) => {

        event.preventDefault();
        let productCartList = props.productsInCart || []; //fetch items that could already be in the cart
        let index = productCartList.findIndex(item => item._id === productDisplayed._id); //check if the selected product is in that list

        //update the overall product list with the updated quantity
        let index2 = productList.findIndex(item => item._id === productDisplayed._id); //check if the selected product is in that list

        if (index2 !== -1) {
            props.setProdList(productList);
        }

        if (index !== -1) {
            // If the product exists in the cart, update its quantity
            productCartList[index].selectedQuantity += selectedQuantity;
            productCartList[index].productQuantity -= selectedQuantity;

        } else {
            // If the product is not in the cart, add it as a new item
            productCartList.push({ ...productDisplayed, selectedQuantity }); //, productQuantity : productDisplayed.productQuantity - selectedQuantity  
            index = productCartList.findIndex(item => item._id === productDisplayed._id)
            productCartList[index].productQuantity -= selectedQuantity;
        }

        props.setProductsInCart(productCartList);
        props.onCart(productCartList);

        showMessage("Item added to cart successfully!");
    };

    const handleSubmitGoToCart = async (event) => {
        navigation("/viewCart");
    };

    const handleQuantityChange = (event) => {
        setSelectedQuantity(parseInt(event.target.value));
    };

    const handleSubmitGoToModifyProduct = async () => {
        props.setProductToBeModifiedByAdmin(productDisplayed);
        navigation("/upsertProduct");
    };

    const handleSubmitDeleteProduct = async () => {
        try {
            const response = await axios.delete('http://localhost:9000/api/deleteProduct', { data: productDisplayed });
            if (response.status === 200) {
                showMessage('Product deleted successfully!');

                // Filter out the deleted product from the productList array
                const updatedProductList = productList.filter(item => item._id !== productDisplayed._id);

                // Update state with the new productList
                props.setProdList(updatedProductList);
                props.onUpdateProductList(updatedProductList);

                navigation("/home");
            }
        }
        catch (error) {
            showMessage("Error in removing the product!");
        }

    };

    return (
        <div className="container" >

            <h1 style={{ marginTop: '10px', color: 'blue' }}>{productDisplayed.productName}</h1>
            <img
                src={productDisplayed.productImageFile}
                alt={productDisplayed.productName} height={'300px'} width={'300px'}
                style={{ marginBottom: '10px', border: '1px solid gray', padding: '10px', borderRadius: '20px' }}
            />
            <p><b>Price:</b> ${productDisplayed.productPrice}</p>
            <p><b>Description:</b>  {productDisplayed.productDescription}</p>

            {userRole === "admin" ?
                (<>
                    <p><b>Quantity:</b>  {productDisplayed.productQuantity}</p>
                    <Button type="submit" onClick={handleSubmitGoToModifyProduct}
                        style={{ marginTop: '20px', marginLeft: '20px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}
                    >Modify Product</Button>
                    <Button type="submit" onClick={handleSubmitDeleteProduct}
                        style={{ marginTop: '20px', marginLeft: '20px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}
                    >Delete Product</Button>
                </>
                )
                :
                (<Form onSubmit={handleSubmitAddToCart}>
                    <Form.Group style={{ marginTop: '30px' }}>
                        <Form.Label><b>Quantity:</b></Form.Label>
                        <Form.Control type="number" min="1" style={{ fontSize: '20px' }} onChange={handleQuantityChange} />
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={3}>
                            <Button type="submit" style={{ marginTop: '20px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Add to cart</Button>
                        </Col>

                        <Col sm={2}>
                            <Button type="submit" onClick={handleSubmitGoToCart} style={{ marginTop: '20px', fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Go to cart</Button>
                        </Col>

                        <Col>
                            {/* Hidden label element to display messages */}
                            <label style={{ display: message ? 'block' : 'none', color: "green", marginTop: '30px' }}>{message}</label>
                        </Col>
                    </Form.Group>

                </Form>
                )
            }
        </div>
    );
};
export default DisplayProductDetails;
