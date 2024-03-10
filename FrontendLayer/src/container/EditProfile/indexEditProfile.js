import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap';
// import '../LoginForm.css'; // Import your custom CSS file for additional styling
import axios from 'axios';


const EditProfile = (props) => {
    const userObj = props.userObj;

    const [formData, setFormData] = useState({
        _id: userObj._id,
        name: userObj.name,
        userName: userObj.userName,
        email: userObj.email,
        password: userObj.password,
        contactNumber: userObj.contactNumber,
        address: userObj.address,
        role: userObj.role
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

    //on click of save profile button
    const handleSubmit = async (event) => {

        event.preventDefault();
        try {
            if (formData.email === '' || formData.password === '') {
                showMessage("Email ID/Password is missing", false);
                return;
            }
            let payload = {
                action: "editProfile",
                payload: formData
            };
            const response = await axios.post('http://localhost:9000/api/upsertUser', payload);

            if (response.status === 200) {
                showMessage("Profile Updated Sucessfully!", true);
                props.setUserObj(formData);
                props.onEditProfile(formData);
            }


        } catch (error) {
            if (error.response.status === 404) { showMessage("User with same email/username exists.", false); }
            if (error.response.status === 500) { showMessage("Something went wrong.", false); }
        }
    };

    return (
        <div className="container">
            <h1 style={{ marginTop: '50px', color: 'blue' }}>Edit Profile</h1>
            <Form onSubmit={handleSubmit}>

                <Form.Group as={Row} controlId="InputUserName" style={{ marginTop: '30px' }}>
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Username
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="username" style={{ fontSize: '20px', color: 'grey' }} name="userName"
                            value={formData.userName}
                            onChange={handleChange} disabled />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="InputName" style={{ marginTop: '10px' }}>
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Name
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="name" style={{ fontSize: '20px', color: 'grey' }} name="name"
                            pattern="[A-Za-z ]{3,}"
                            value={formData.name} onChange={handleChange} />
                        <Form.Text muted>Enter a valid name with atleast 3 characters [a-z, A-Z ]</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="InputEmail" style={{ marginTop: '20px' }}>
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Email
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="email" style={{ fontSize: '20px', color: 'grey' }} name="email"
                            value={formData.email} onChange={handleChange} />
                        <Form.Text muted>Enter a valid email eg: sample@email.com</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="InputPassword" style={{ marginTop: '20px' }}>
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="password" style={{ fontSize: '20px', color: 'grey' }}
                            name="password" pattern="[0-9a-zA-Z.-@$]{5,}"
                            value={formData.password} onChange={handleChange} />
                        <Form.Text muted>Enter a valid password with atleast 5 characters [0-9 a-z A-Z . - @ $] (no space)  </Form.Text>
                    </Col>
                </Form.Group>


                <Form.Group as={Row} controlId="InputContactNumber" style={{ marginTop: '20px' }}>
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Contact Number
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="tel" style={{ fontSize: '20px', color: 'grey' }}
                            name="contactNumber" pattern="[0-9]{10,13}"
                            value={formData.contactNumber} onChange={handleChange} />
                        <Form.Text muted>Enter a valid contact number with 10-13 digits</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="InputAddress" style={{ marginTop: '20px' }}>
                    <Form.Label column sm={2} style={{ fontSize: '20px' }}>
                        Address
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="address" style={{ fontSize: '20px', color: 'grey' }}
                            name="address" pattern="[0-9a-zA-Z.,\- ]{3,}"
                            value={formData.address} onChange={handleChange} />
                        <Form.Text muted>Enter a valid address with atleast 3 characters [a-z A-Z . , \ - ] </Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="btnSaveProfile" style={{ marginTop: '20px' }}>
                    <Col sm={3}>
                        <Button type="submit" style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }}>Save Changes</Button>
                    </Col>

                    <Col>
                        {/* Hidden label element to display messages */}
                         <label style={{ display: message.text ? 'block' : 'none', color: message.isError ? "green" : "red" }}>{message.text}</label>
                 </Col>
                </Form.Group>
            </Form>
        </div>
    );
}

export default EditProfile