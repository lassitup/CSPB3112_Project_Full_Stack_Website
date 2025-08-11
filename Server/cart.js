//Express Router To Handle User Interactions with Shopping Cart
const express = require('express');
const multer = require('multer');
const dbMiddleware = require('./databaseMiddleware.js');

const upload = multer();
const cart = express.Router();

//set headers to fix the CORS error - research this if I still it
cart.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})



//Note for self: upload.none - multer method to parse form data and attached to body
//really need for forms with file uploads, but continuing use in case we decide to add the ability
//to load images/files

//Route to add Bracelet product to the session cart
cart.post('/addBracelet', upload.none(), (req, res) => {
    req.body.productType = 'Bracelet';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});

//Route to add Necklace product to the session cart
cart.post('/addNecklace', upload.none(), (req, res) => {
    req.body.productType = 'Necklace';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});

//Route to add Keychain product to the session cart
cart.post('/addKeychain', upload.none(), (req, res) => {
    req.body.productType = 'Keychain';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});

//Route that handles returning the current contents in the cart
cart.get('/getCart', (req, res) => {
    res.json(req.session.cart);
});

//Route that handles returning the current products available
cart.get('/getProducts', dbMiddleware.getAllProducts);


//Routes that call the db middleware with the product ID as an argument - returns the product record
//Think through ways to refactor this - there's too much repitition here
cart.get('/getBraceletUnitPrice', dbMiddleware.getUnitPrice('1'));

cart.get('/getNecklaceUnitPrice', dbMiddleware.getUnitPrice('2'));

cart.get('/getKeychainUnitPrice', dbMiddleware.getUnitPrice('3'));


//Route to handle getting the current total price of the order
cart.get('/getTotalPrice', (req, res) => {
    res.send(req.session.totalPrice);
})

//express.text middleware parses data received into text/string
//Route that handles removing an item from the cart initiated by the user
cart.delete('/removeFromCart', express.text(), (req, res) => {
    //determine how to respond if cart is empty
    const removeKey = req.body;
    delete req.session.cart[removeKey];
    res.send();
    //need to add exception handling
});

//change this to post here and in the request
cart.put('/updateTotal', express.text(), (req, res) => {
    req.session.totalPrice = Number(req.body);
    res.send();
})

//change this to post here and in the request
cart.put('/updateTaxAndPrice', express.json(), (req, res) => {
    req.session.tax = req.body.tax;
    req.session.totalWithTax = req.body.total;
    req.session.shipping = 5; //need to store the shipping cost in the database - ok for right now
    req.session.totalAll = req.body.total + req.session.shipping;
    res.send();
})


//export the router for use within the main server file
module.exports = cart;