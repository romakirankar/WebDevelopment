import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../LoginForm.css'; // Import your custom CSS file for additional styling
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';


const EditProfile = (props) => {
    const userObj = props.userObj;

    const [formData, setFormData] = useState({
        _id : userObj._id,
        name : userObj.name,
        userName: userObj.userName,
        email: userObj.email,
        password: userObj.password,
        contactNumber: userObj.contactNumber,
        address: userObj.address
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    //on click of save profile button
    const handleSubmit = async (event) => {

        event.preventDefault();
        try {
            if (formData.email === '' || formData.password === '') {
                alert("Email ID/Password is missing");
                return;
            }

            let payload = {
                action : "editProfile",
                payload : formData
            };

            const response = await axios.post('http://localhost:9000/api/upsertUser', payload);

            if (response.status === 201) {
                alert("Profile Updated Sucessfully!")
                props.setUserObj(formData);
            }


        } catch (error) {
            if (error.response.status === 404) { alert("User with same email/username exists."); }
            if (error.response.status === 500) { alert("Something went wrong."); }
        }
    };

    return (
        <div className="container">
                <h1 style={{ marginTop: '50px', color: 'blue'}}>Edit Profile</h1>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group as={Row} className="mb-3" controlId="InputUserName" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Username
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="username" style={{ fontSize: '20px', color: 'grey' }} name="userName" value={formData.userName} onChange={handleChange} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputEmail" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Email
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="email" style={{ fontSize: '20px', color: 'grey' }} name="email" value={formData.email} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputPassword" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Password
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="password" style={{ fontSize: '20px', color: 'grey' }} name="password" value={formData.password} onChange={handleChange} />
                            </Col>
                        </Form.Group>


                        <Form.Group as={Row} className="mb-3" controlId="InputContactNumber" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                                Contact Number
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="number" style={{ fontSize: '20px', color: 'grey' }} name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="InputAddress" style={{ marginTop: '30px' }}>
                            <Form.Label column sm={2} style={{ fontSize: '20px'}}>
                                Address
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="address" style={{ fontSize: '20px', color: 'grey' }} name="address" value={formData.address} onChange={handleChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="btnSaveProfile" style={{ marginTop: '30px' }}>
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Save Changes</Button>
                            </Col>
                        </Form.Group>

                    </Form>
        </div>
    );
}

export default EditProfile