//Set up schema for table of User
const mongoDb = require('mongoose');
const userSchema = new mongoDb.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    contactNumber: {
        type: String
    },
    address:{
        type: String
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

//validate the entered password with the record password in db
userSchema.methods = {
    authenticate: function(enteredPassword){
        if (enteredPassword == this.password)
        { return true; }
        else
        { return false; }
    }
};
module.exports = mongoDb.model('users', userSchema); //set collections-name which is set in MongoDB