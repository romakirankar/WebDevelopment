import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../LoginForm.css';
import axios from 'axios';


const SignIn = (props) => {

    // State variable to hold the message text
    const [message, setMessage] = useState('');

     //Function to display a message
     const showMessage = (text) => {
        setMessage(text);
    };

    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
            if (formData.email === '' || formData.password === '') {
                showMessage("Email ID/Password is missing");
            }
            else {
                const response = await axios.post('http://localhost:9000/api/userSignIn', formData);
                
                // Store the token in local storage
                const sessionToken = response.data.sessionToken
                
                // Call the onLogin function passed from the parent component
                props.onLogin(sessionToken, response.data.user);
                props.setUserObj(response.data.user);
            }
        } catch (error) {
            showMessage(error.response.data.message)
        }
    };

    return (
        <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
            <h1 style={{ color:"cadetblue"}}>Sumazon  </h1>
            <h2 style={{ textAlign: 'left', marginLeft: '20px' }} >SignIn</h2>
            <div >
                <Form className="container" onSubmit={handleSubmit} >
                    <Form.Group as={Row} className="email" style={{ marginTop: '50px' }} controlId="formEmail">
                        <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                            Enter Email*
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="email" required style={{ fontSize: '20px', color: 'grey' }} name="email" value={formData.email} onChange={handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="password" style={{ marginTop: '50px' }} controlId="formPassword">
                        <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                            Enter Password*
                        </Form.Label>
                        <Col sm={10} >
                            <Form.Control type="password" required style={{ fontSize: '20px', color: 'grey' }} name="password" value={formData.password} onChange={handleChange} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="btnSignin" style={{ marginTop: '30px' }}>
                        <Col sm={{ span: 10, offset: 1 }}>
                            <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Sign In</Button>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="signup-link" >
                        <Col sm={{ span: 10, offset: 1}}>
                            <a href='Signup'>Do not have an account? Sign up now!</a>
                        </Col>
                    </Form.Group>
                </Form>
                 {/* Hidden label element to display messages */}
                 <label style={{ display: message ? 'block' : 'none', color: "red"}}>{message}</label>
            </div>

        </div>
    );
}
export default SignIn