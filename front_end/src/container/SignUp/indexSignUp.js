import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../LoginForm.css'; // Import your custom CSS file for additional styling
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

const SignUp = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        address: '',
        userName: '',
        email: '',
        password: ''
    });

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
                alert("Information is missing");
                return;
            }

            let payload = {
                action : "signUp",
                payload : formData
            };

            const response = await axios.post('http://localhost:9000/api/upsertUser', payload);
            if (response.status === 201) { alert("User Registered Sucessfully!") }

        } catch (error) {
            if (error.response.status === 404) { alert("User with same email/username exists."); }
            if (error.response.status === 500) { alert("Something went wrong."); }
        }
    };


    return (
        <div className="container">
            <div className='row'>
                <div className='col-3'>
                    <h1 className=''>REGISTRATION PAGE </h1>
                </div>
                <div className='col-4'>

                    <Form className="login-form" onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="InputName" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Name
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="name" style={{ fontSize: '20px', color: 'grey' }} name="name" value={formData.name} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputContactNumber" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Contact Number
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="number" style={{ fontSize: '20px', color: 'grey' }} name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputAddress" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Address
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="address" style={{ fontSize: '20px', color: 'grey' }} name="address" value={formData.address} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputUserName" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Username
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="username" style={{ fontSize: '20px', color: 'grey' }} name="userName" value={formData.userName} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputEmail" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Email
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="email" style={{ fontSize: '20px', color: 'grey' }} name="email" value={formData.email} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputPassword" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Password
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="password" style={{ fontSize: '20px', color: 'grey' }} name="password" value={formData.password} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="btnSignup" style={{ marginTop: '30px' }}>
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Sign Up</Button>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" >
                            <Col sm={{ span: 10, offset: 2 }}>
                                <a href='SignIn' >Have an account? Sign In now!</a>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default SignUp