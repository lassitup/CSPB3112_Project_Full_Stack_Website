//Express Router To Handle Final Submitted Orders


const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')
const dbMiddleware = require('./databaseMiddleware.js');

const upload = multer();
const orders = express.Router();

//should we open and close the database within the route itself?
//const db = new sqlite3.Database('../Database/daisyajewelry.db');


orders.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})


const order_db_chain = [dbMiddleware.insertCustomer, dbMiddleware.insertOrder, dbMiddleware.insertProductSold]

orders.post('/submitOrder', upload.none(), order_db_chain, (req, res) => {
    res.send();
})





module.exports = orders;