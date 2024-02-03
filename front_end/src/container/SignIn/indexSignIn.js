import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../LoginForm.css'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';


const SignIn = (props) => {
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
                alert("Email ID/Password is missing");
            }
            else 
            {
                const response = await axios.post('http://localhost:9000/api/userSignIn', formData);
               // alert(response.data.message)

                // Store the token in local storage
                const sessionToken = response.data.sessionToken
                // Call the onLogin function passed from the parent component
                props.onLogin(sessionToken);
                props.setUserObj(response.data.user);
                console.log(response.data.user);
            }
        } catch (error) {
            alert(error.response.data.message)
        }
    };

    return (
        <div className="container">
            <div className='row' >
                <div className='col-3'>
                    <h1 className=''>LOGIN PAGE </h1>
                </div>
                <div className='col-1'>
                    <Form className="login-form" onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" style={{ marginTop: '50px' }} controlId="formEmail">
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Email
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="email" style={{ fontSize: '20px', color: 'grey' }} name="email" value={formData.email} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" style={{ marginTop: '50px' }} controlId="formPassword">
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Enter Password
                            </Form.Label>
                            <Col sm={10} >
                                <Form.Control type="password" style={{ fontSize: '20px', color: 'grey' }} name="password" value={formData.password} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="btnSignin" style={{ marginTop: '30px' }}>
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Sign In</Button>

                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="signup-link" >
                            <Col sm={{ span: 10, offset: 2 }}>
                                <a href='Signup'>Do not have an account? Sign up now!</a>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default SignIn