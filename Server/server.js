const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')
const path = require('path');
const session = require('express-session');
const orders = require('./orders.js');
const cart = require('./cart.js');

//To handle sessions, need pckages:
//express-session

//Continue using multer for handling form inputs - express can handle this natively, but we might
//want to add the ability to upload a file later, which needs multer

//Establish Express Server
const app = express();

//Note: MemoryStore should not be used in production
const store = new session.MemoryStore();

app.use(session({
    //best practice is to set expiration on cookie - the Session ID is automatically set by express-session
    resave: false,
    saveUninitialized: false,
    secret: "tempSecret", //For production, this should be placed in env variable outside of code
    store
}))



//set headers to fix the CORS error - research this - do I need?
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//initialize the cart to an empty object so we can use to track components of orders
app.use((req, res, next) => {
    if(!req.session.cart) {
        req.session.cart = {};
        req.session.itemNumber = 1;
        next()
    } else {
        next();
    }

})

//Mount the Routers
app.use('/orders', orders);
app.use('/cart', cart);

 
//directs the server to pull static pages like other html/css/images from the appropriate directory
//__dirname refers to the current directory running the serve JS file


app.use(express.static(path.join(__dirname, '..', 'Webpages')));
app.use(express.static(path.join(__dirname, '..', 'Utilities')));


//request the home page of the website
app.get('/daisyajewelry.com', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'Webpages', 'index.html'));
})

//Route to serve the confirmation page the ID of the order just submitted
app.get('/lastOrderID', (req, res, next) => {
    res.json(req.session.lastOrderID.toString());
})

app.listen(3000, () => {
    console.log('Server up and Listening on Port: 3000');
});





