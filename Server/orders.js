//Express Router To Handle Final Submitted Orders


const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')

const upload = multer();
const orders = express.Router();

//should we open and close the database within the route itself?
const db = new sqlite3.Database('../Database/daisyajewelry.db');


orders.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})


// database write middleware here (use as an array - middleware chain)
//once written and workin, place into it's own file
//write customer data
//write order data
//write products_sold data

//function to write customer data to the database
function insertCustomer(req, res, next) {

    db.run('INSERT INTO Customers (FIRST_NAME, LAST_NAME, ADDRESS_1, ADDRESS_2, CITY, STATE, COUNTRY, ZIP, PHONE, EMAIL) VALUES ($first_name, $last_name, $address_1, $address_2, $city, $state, $country, $zip, $phone, $email) ', {
            $first_name: req.body.firstName.toLowerCase(),
            $last_name: req.body.lastName.toLowerCase(),
            $address_1: req.body.address_1.toLowerCase(),
            $address_2: req.body.address_2.toLowerCase(),
            $city: req.body.city.toLowerCase(),
            $state: req.body.state.toLowerCase(),
            $country: req.body.country.toLowerCase(),
            $zip: req.body.zip,
            $phone: req.body.phone,
            $email: req.body.email.toLowerCase()
    },  function(error) {
            if(error) {
                console.log(error);
                //next(error);  - create next error handling function
            }
            else {
                console.log(`Customer #${this.lastID} added to the Customer table`);
                req.body.customerNum = this.lastID;
                next();
            }
        }
    )
}

function insertOrder(req, res, next) {
       
    req.session.orderDate = (new Date()).toString();

    db.run('INSERT INTO Orders (CUSTOMER_ID, TOTAL_PRICE, SALES_TAX, TOTAL_PRICE_TAX, ORDER_DATE, ORDER_STATUS) VALUES ($customer_id, $total_price, $sales_tax, $total_price_tax, $order_date, $order_status) ', {
        $customer_id: req.body.customerNum,
        $total_price: req.session.totalPrice,
        $sales_tax: req.session.tax,
        $total_price_tax: req.session.totalWithTax,
        $order_date: req.session.orderDate,
        $order_status: 'unfulfilled'
    }, function(error) {
        if(error) {
            //need to remove previously added record in customers if there was an error
            console.log(error);
            //next(error);  - create next error handling function
        }
        else {
            console.log(`Order #${this.lastID} added to the Order table`);
            req.body.orderID = this.lastID;
            next();
        }
        }
    )
}

function insertProductSold(req, res, next) {

    for(const product in req.session.cart) {
        db.run('INSERT INTO Products_Sold (ORDER_ID, PRODUCT_ID, QUANTITY, METAL_TYPE, SIZE, EXTENDED_PRICE) VALUES ($order_id, $product_id, $quantity, $metal_type, $size, $extended_price)', {
            $order_id: req.body.orderID,
            $product_id: req.session.cart[product].product_id,
            $quantity: req.session.cart[product].quantity,
            $metal_type: req.session.cart[product].metalType.toLowerCase(),
            $size: req.session.cart[product].size,
            $extended_price: req.session.cart[product].extendedPrice,
        }, function(error) {
            if(error) {
                //need to remove previously added record in customers and orders if there was an error
                //console.log(error);
                res.status(500).send("Test");
            }
            else {
                console.log(`Produc Sold ID #${this.lastID} added to the Products Sold table`);
                next();
            }
            
        }
        )
    }  
}

const order_db_chain = [insertCustomer, insertOrder, insertProductSold]

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