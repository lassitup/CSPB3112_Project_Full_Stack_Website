//Express Router To Handle Database management requests

const express = require('express');
const multer = require('multer');
const dbMiddleware = require('./databaseMiddleware.js');
const path = require('path');

const upload = multer();
const dbManage = express.Router();


dbManage.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//database functions used as middleWare to ensure that the database is written to sequentially
const order_db_chain = [dbMiddleware.insertCustomer, dbMiddleware.insertOrder, dbMiddleware.insertProductSold]


//execute the submission of order data to the database
//reset the user cart in the session once orders are successfully recorded
dbManage.get('/getOrders', dbMiddleware.getOrders, (req, res) => {
    //can we send the order number with it? can maybe set a previous order number object within the session
})

//export the router for use within the main server file
module.exports = dbManage;