//Express Router To Handle Database management requests

const express = require('express');
const dbMiddleware = require('./databaseMiddleware.js');
const dbManage = express.Router();

//set headers to fix the CORS error - research this if I still it
dbManage.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//route to handle queries for orders
dbManage.get('/getOrders', dbMiddleware.getOrders);

//route to handle queries for customer details
dbManage.get('/getCustomer', dbMiddleware.getCustomer);

//route to handle queries for order line item (product) details
dbManage.get('/getOrderDetails', dbMiddleware.getOrderDetails);

//route to handle queries to update the database
dbManage.post('/updateOrder', express.json(), dbMiddleware.updateOrder);

//export the router for use within the main server file
module.exports = dbManage;