//Import libraries/modules
const express = require('express');  //Manage api calls
const env= require('dotenv');
const app = express(); 
const bodyParser = require('body-parser'); //parse url requests body
const mongoDb = require('mongoose'); //mongo db
const cors = require('cors');

//Set routes for api calls to direct connections
const authenticationRoutes = require('./routes/routingCalls');

//configure environment variable
env.config();

//set mongodb connection using connection string -(not yet used) the user id and password was created in MongoDB which i am storing NOW IN .environment for modularization
mongoDb.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hbmknxf.mongodb.net/${process.env.DB_DATABASE_NAME}?retryWrites=true&w=majority`
).then(() => {
    console.log("Database Connected!");
});
// Allow requests from all origins/ports
app.use(cors());

//bodyparser to parse url requests in json format
app.use(bodyParser.urlencoded({ //extended version of body-parser  is added because few functions are deprecated
    extended : true
}));

app.use(bodyParser.json()); //extended version of body-parser  is added because few functions are deprecated

app.use('/api', authenticationRoutes);

//listening to port for incoming requests
app.listen(process.env.SERVER_PORT, () => {
    console.log('Running on server: ' + process.env.SERVER_PORT);
});
