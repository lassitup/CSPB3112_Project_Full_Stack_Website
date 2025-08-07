//Express Router To Handle User Interactions with Shopping Cart
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')
const dbMiddleware = require('./databaseMiddleware.js');

const upload = multer();
const cart = express.Router();

//open conection to the databse
const db = new sqlite3.Database('../Database/daisyajewelry.db');

cart.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})


//add function that updates total price after something is added and removed
//upload.none - multer method to parse form data and attached to body
//add Bracelet product to the session cart
cart.post('/addBracelet', upload.none(), (req, res) => {
    req.body.productType = 'Bracelet';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});

//add Necklace product to the session cart
cart.post('/addNecklace', upload.none(), (req, res) => {
    req.body.productType = 'Necklace';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});

cart.post('/addKeychain', upload.none(), (req, res) => {
    req.body.productType = 'Keychain';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});


cart.get('/getCart', (req, res) => {
    res.json(req.session.cart);
});

cart.get('/getProducts', dbMiddleware.getAllProducts);


//can consolidate this function into a catch all, attach the product type to the request and then query based on the requested item attached to req.body
cart.get('/getBraceletUnitPrice', dbMiddleware.getUnitPrice('1'));

cart.get('/getNecklaceUnitPrice', dbMiddleware.getUnitPrice('2'));

cart.get('/getKeychainUnitPrice', dbMiddleware.getUnitPrice('3'));


cart.get('/getTotalPrice', (req, res) => {
    res.send(req.session.totalPrice);
})

//express.text middleware parses data received into text/string
cart.delete('/removeFromCart', express.text(), (req, res) => {
    //determine how to respond if cart is empty - shouldn't matter as user
    //can only remove by selecting the element, but just in case
    const removeKey = req.body;
    delete req.session.cart[removeKey];
    res.send();
    //need to add exception handling
});


//change these to post I think
cart.put('/updateTotal', express.text(), (req, res) => {
    req.session.totalPrice = Number(req.body);
    res.send();
})

cart.put('/updateTaxAndPrice', express.json(), (req, res) => {
    req.session.tax = req.body.tax;
    req.session.totalWithTax = req.body.total;
    req.session.shipping = 5;
    req.session.totalAll = req.body.total + req.session.shipping;
    res.send();
})




//removeBracelet
//addNecklace
//removeNecklace
//addKeychain
//removeKeychain




module.exports = cart;