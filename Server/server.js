const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')
const app = express();
const upload = multer();

//Connect to the database here
const db = new sqlite3.Database('../Database/daisyajewelry.db');


//set headers to fix the CORS error
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})
//Use multer to access form data
//cors module for cors error?

app.get('/orders', (req, res) => {
    res.json('We did it!');
});

//upload.none - multer method to parse form data and attached to body
app.post('/orders', upload.none(), (req, res) => {
    console.log("Caught Order!");
    db.run('INSERT INTO orderTests (first_name, last_name, address1, address2, product_type) VALUES ($firstName, $lastName, $address1, $address2, $product)', 
        {
            $firstName: req.body.customerFirstName,
            $lastName: req.body.customerLastName,
            $address1: req.body.address1,
            $address2: req.body.address2,
            $product: req.body.productSelect
        }, function(error) {
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



app.listen(3000, () => {
    console.log('Server up and running!');
});





