const User = require('../models/user');
const jwt = require('jsonwebtoken');

//--Event- Sign UP OR Save profile//
exports.upsertUser = (request, response) => {

    let action = request.body.action;
    let userPayload = request.body.payload;
    let upsert = false;

    let query = { email: userPayload.email, userName: { $ne: userPayload.userName } }; //Save profile query
    if (action === 'signUp') {
        query = { $or: [{ email: userPayload.email }, { userName: userPayload.userName }] }; //Sign Up query
        upsert = true;
    }

    //Check if user already exists
    User.findOne(query)
        .then((UserRecord) => {
            if (UserRecord != null) {
                return response.status(404).json();
            }

            const { _id, name, contactNumber, address, userName, email, password } = userPayload;

            //user object
            const userObj = new User(
                { _id, name, contactNumber, address, userName, email, password, });

            User.updateOne({ userName: userObj.userName }, userObj, { upsert: upsert })
                .then((userRecord) => {
                    if (userRecord) {
                        response.status(201).json();
                    }
                }).catch((err) => {
                    return response.status(500).json();
                });
        }).catch((err) => {
            return response.status(500).json();
        });
}

//--Event - Sign IN//
exports.userSignIn = (request, response) => {
    //check if user already exists ; result= either error or record
    User.findOne({ email: request.body.email })
        .then((userRecord) => {
            if (userRecord) {
                //Verify login password
                if (userRecord.authenticate(request.body.password)) {
                    const { userName } = userRecord.userName;
                    //set token to control a session for login and logout
                    const sessionToken = jwt.sign({ userName }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                    response.status(200).json({ message: 'User Login Successful!', user: userRecord, sessionToken: sessionToken });
                }
                else {
                    response.status(404).json({ message: 'Invalid Password' });
                }
            } else {
                response.status(404).json({ message: "Invalid credentials" });
            }
        }).catch((err) => {
            return response.status(400).json({ message: "Something went wrong" });
        });
}