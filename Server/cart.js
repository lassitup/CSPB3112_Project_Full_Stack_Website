//Express Router To Handle User Interactions with Shopping Cart
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')

const upload = multer();
const cart = express.Router();



cart.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})


cart.get('/', (req, res) => {
    res.json('We did it!');
});

//upload.none - multer method to parse form data and attached to body
cart.post('/add', upload.none(), (req, res) => {
    req.session.cart = req.body;
    console.log(req.session.cart);
    res.redirect('../cart.html');
});

module.exports = cart;