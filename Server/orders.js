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
    console.log("test");

})





orders.get('/', (req, res) => {
    res.json('We did it!');
});


//route to update database with final purchase details
//upload.none - multer method to parse form data and attached to body
//need to calculate the total price
/*orders.post('/submitOrder', upload.none(), (req, res) => {
    //console.log("Caught Order!");
    //console.log(req.body);
    
    //Use serialize to ensure database is accessed sequentially 
    db.serialize(() => {
         //convert all to lower case
        
        //could also implement a series of middleware using next to separate the database writes
        //maybe refactor database querries into their own file and call in as needed



        //update customer table - check first to see if customer is in table before adding to avoid duplicates
        //maybe we should allow the duplicates? Maybe they have different contact data since last order? 



    //update Products Sold table
    //update order table

    //also need to clear the cart


    /*

    db.run('INSERT INTO orderTests (first_name, last_name, address1, address2, product_type) VALUES ($firstName, $lastName, $address1, $address2, $product)', 
        {
            $firstName: req.body.customerFirstName,
            $lastName: req.body.customerLastName,
            $address1: req.body.address1,
            $address2: req.body.address2,
            $product: req.body.productSelect
        }, function(error) { //standard function must be used in db.run due to 'this'
            if(error) {
                console.log(error);
                return;
            }
            else {
                console.log(`Order #${this.lastID} added to the database`);
            }
        })*/




module.exports = orders;