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

//upload.none - multer method to parse form data and attached to body
cart.post('/addBracelet', upload.none(), (req, res) => {
    req.body.productType = 'Bracelet';
    req.session.cart[req.session.itemNumber] = req.body;
    req.session.itemNumber++;
    console.log(req.session.cart);
    res.redirect('/cart.html');
});


cart.get('/getCart', (req, res) => {
    res.json(req.session.cart);
});

cart.get('/getPrices', (req, res) => {
    db.all('SELECT * FROM PRODUCTS', (err, rows) =>
    {
        if(err){
            //need to detemrine how to handle the error
            res.send()
        }
        res.json(rows);
    })
    //need to close database connection once done
})

cart.delete('/removeFromCart', express.text(), (req, res) => {
    const removeKey = req.body;
    console.log(removeKey)
    delete req.session.cart[removeKey];
    console.log(req.session.cart)
    res.send();
    //need to add exception handling
});




//removeBracelet
//addNecklace
//removeNecklace
//addKeychain
//removeKeychain




module.exports = cart;