//Express Router To Handle Final Submitted Orders

const express = require('express');
const multer = require('multer');
const dbMiddleware = require('./databaseMiddleware.js');

const upload = multer();
const orders = express.Router();

//Continue using multer for handling form inputs - express can handle this natively, but we might
//want to add the ability to upload a file later, which needs multer

//set headers to fix the CORS error - research this if I still it
orders.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//database functions used as middleWare to ensure that the database is written to sequentially
const order_db_chain = [dbMiddleware.insertCustomer, dbMiddleware.insertOrder, dbMiddleware.insertProductSold]


//Route to request the order ID of the previously submitted order - used in the confirmation page
orders.get('/getOrderId', (req, res) => {
    res.send(req.session.lastOrderID);
})

//execute the submission of order data to the database
//reset the user cart in the session once orders are successfully recorded
orders.post('/submitOrder', upload.none(), order_db_chain, (req, res) => {
    //Once the order is recorded to the database, reset the session cart and item numbers in the cart
    req.session.cart = {};
    req.session.itemNumber = 1;
    res.redirect('/Checkout/orderConfirmation.html')
})

//export the router for use within the main server file
module.exports = orders;