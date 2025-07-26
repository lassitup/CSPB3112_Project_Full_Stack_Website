//Express Router To Handle User Interactions with Shopping Cart
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')

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

//create and add and remove item functions to avoid repitition
cart.get('/', (req, res) => {
    res.json('We did it!');
});

//add function that updates total price after something is added and removed
//upload.none - multer method to parse form data and attached to body
cart.post('/addBracelet', upload.none(), (req, res) => {
    req.body.productType = 'Bracelet';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    res.send();
});

cart.get('/getCart', (req, res) => {
    res.json(req.session.cart);
});

cart.get('/getPrices', (req, res) => {
    db.all('SELECT * FROM Products', (err, rows) =>
    {
        if(err){
            //need to detemrine how to handle the error - set error code
            res.send()
            return;
        }
        res.json(rows);
    })
    //need to close database connection once done
})


cart.get('/getBraceletUnitPrice', (req, res) => {
    //query the product table for the price of the unit
    db.get("SELECT * FROM Products WHERE PRODUCT_DESCRIPTION='Bracelet'", (err, row) => {
        if(err){
            //need to detemrine how to handle the error - set error code
            res.send()
            return;
        }
        res.json(row);
    });
})


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

cart.put('/updateTotal', express.text(), (req, res) => {
    req.session.totalPrice = Number(req.body);
    res.send();
})

cart.put('/updateTaxAndPrice', express.json(), (req, res) => {
    console.log(req.body);
    req.session.tax = req.body.tax;
    req.session.totalWithTax = req.body.total;
    res.send();
})




//removeBracelet
//addNecklace
//removeNecklace
//addKeychain
//removeKeychain




module.exports = cart;