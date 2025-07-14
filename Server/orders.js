//Express Router To Handle Orders


const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')

const upload = multer();
const orders = express.Router();


const db = new sqlite3.Database('../Database/daisyajewelry.db');


orders.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})


orders.get('/', (req, res) => {
    res.json('We did it!');
});

//upload.none - multer method to parse form data and attached to body
orders.post('/', upload.none(), (req, res) => {
    console.log("Caught Order!");
    db.run('INSERT INTO orderTests (first_name, last_name, address1, address2, product_type) VALUES ($firstName, $lastName, $address1, $address2, $product)', 
        {
            $firstName: req.body.customerFirstName,
            $lastName: req.body.customerLastName,
            $address1: req.body.address1,
            $address2: req.body.address2,
            $product: req.body.productSelect
        }, function(error) { //standard function must be used in db.run
            if(error) {
                console.log(error);
                return;
            }
            else {
                console.log(`Order #${this.lastID} added to the database`);
            }
        })
    console.log(req.body);
    res.json('Test');
});

module.exports = orders;