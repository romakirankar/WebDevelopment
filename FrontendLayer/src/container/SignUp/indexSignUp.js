import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const SignUp = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        address: '',
        userName: '',
        email: '',
        password: '',
        role: 'user'
    });

    // State variable to hold the message text
    const [message, setMessage] = useState('');

    //Function to display a message
    const showMessage = (text, isError) => {
        setMessage({ text, isError });
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        try {
            if (formData.email === '' || formData.password === '' || formData.userName === '') {
                showMessage("Information is missing", false);
                return;
            }

            let payload = {
                action: "signUp",
                payload: formData
            };

            const response = await axios.post('http://localhost:9000/api/upsertUser', payload);
            if (response.status === 200) { showMessage("User Registered Sucessfully!", true) }

        } catch (error) {
            if (error.response.status === 404) { showMessage("User with same email/username exists.", false); }
            if (error.response.status === 500) { showMessage("Something went wrong.", false); }
        }
    };


    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h1 style={{ color:"cadetblue"}}>Sumazon</h1>
            <h2 style={{ textAlign: 'left', marginLeft: '20px' }} >Create Account</h2>
            <div >
                <Form  className="container" onSubmit={handleSubmit}> {/* wrapper of all elements in react Bootstrap */}
                    <Form.Group as={Row} controlId="InputName" style={{ marginTop: '20px' }}> {/* group of elements defined with name InputName */}
                        <Form.Label column sm={3} style={{ fontSize: '20px' }}>
                            Enter Name
                        </Form.Label>
                        
                        <Col sm={9}> {/* How many columns the element should occupy */}
                            <Form.Control type="name" pattern="[A-Za-z ]{3,}"
                                style={{ fontSize: '20px', color: 'grey' }} name="name"
                                value={formData.name} onChange={handleChange} />
                            <Form.Text muted>Enter a valid name with atleast 3 characters [a-z, A-Z ]</Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="InputContactNumber" style={{ marginTop: '20px' }}>
                        <Form.Label column sm={3} style={{ fontSize: '20px' }}>
                            Enter Contact Number
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="tel" pattern="[0-9]{10,13}" name="contactNumber"
                                style={{ fontSize: '20px', color: 'grey' }}
                                value={formData.contactNumber} onChange={handleChange} />
                            <Form.Text muted>Enter a valid contact number with 10-13 digits</Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="InputAddress" style={{ marginTop: '20px' }}>
                        <Form.Label column sm={3} style={{ fontSize: '20px' }}>
                            Enter Address
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="address" pattern="[0-9a-zA-Z.,\- ]{3,}"
                                style={{ fontSize: '20px', color: 'grey' }} name="address"
                                value={formData.address} onChange={handleChange} />
                            <Form.Text muted>Enter a valid address with atleast 3 characters [a-z A-Z . , \ - ] </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="InputUserName" style={{ marginTop: '20px' }}>
                        <Form.Label column sm={3} style={{ fontSize: '20px' }}>
                            Enter Username*
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="username" pattern="[0-9a-zA-Z.-@$]{3,}"
                                style={{ fontSize: '20px', color: 'grey' }} name="userName"
                                value={formData.userName} onChange={handleChange} />
                            <Form.Text muted>Enter a valid username with atleast 3 characters [0-9 a-z A-Z . - @ $] (no space)</Form.Text>
                            <Form.Text muted>  *Username once given cannot be changed later </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="InputEmail" style={{ marginTop: '20px' }}>
                        <Form.Label column sm={3} style={{ fontSize: '20px' }}>
                            Enter Email*
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="email" required style={{ fontSize: '20px', color: 'grey' }} name="email"
                                value={formData.email} onChange={handleChange} />
                            <Form.Text muted>Enter a valid email eg: sample@email.com</Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="InputPassword" style={{ marginTop: '20px' }}>
                        <Form.Label column sm={3} style={{ fontSize: '20px' }}>
                            Enter Password*
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="password" required pattern="[0-9a-zA-Z.-@$]{5,}"
                                style={{ fontSize: '20px', color: 'grey' }} name="password"
                                value={formData.password} onChange={handleChange} />
                            <Form.Text muted>Enter a valid password with atleast 5 characters [0-9 a-z A-Z . - @ $] (no space)  </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="btnSignup" style={{ marginTop: '20px' }}>
                        <Col > {/* Padding to add space between the element content and the border */}
                            <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Sign Up</Button>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} >
                        <Col >
                            <a href='SignIn' >Have an account? Sign In now!</a>
                        </Col>
                    </Form.Group>

                    {/* Hidden label element to display messages */}
                    <label style={{ display: message.text ? 'block' : 'none', color: message.isError ? "green" : "red" }}>{message.text}</label>
                  </Form>

            </div>
        </div>
      
    );
}
export default SignUp