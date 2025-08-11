//This file contains database middleware for use in the server Routers

const sqlite3 = require('sqlite3')



/*  ------------------------------- Database Insertion Functions ------------------------------- */


//for insertOrder and insertProductsSold functions, in the event of an error, I need to include a removal of the previously 
//entered data - if insertProductsSold fails, need to remove the order and customer data. Come back and implement this

//function writes customer data to the database for the order
function insertCustomer(req, res, next) {
    const db = new sqlite3.Database('../Database/daisyajewelry.db');

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
                db.close();
                //next(error);  - create next error handling function
            }
            else {
                console.log(`Customer #${this.lastID} added to the Customer table`);
                req.body.customerNum = this.lastID;
                db.close();
                next();
            }
        }
    )
}

//function writes main order data to the database for the order
function insertOrder(req, res, next) {
    req.session.orderDate = (new Date()).toString();

    const db = new sqlite3.Database('../Database/daisyajewelry.db');

    db.run('INSERT INTO Orders (CUSTOMER_ID, TOTAL_PRICE, SALES_TAX, TOTAL_PRICE_TAX, ORDER_DATE, ORDER_STATUS, SHIPPING, TOTAL_ALL) VALUES ($customer_id, $total_price, $sales_tax, $total_price_tax, $order_date, $order_status, $shipping, $totalAll)', {
        $customer_id: req.body.customerNum,
        $total_price: req.session.totalPrice,
        $sales_tax: req.session.tax,
        $total_price_tax: req.session.totalWithTax,
        $order_date: req.session.orderDate,
        $order_status: 'open',
        $shipping: req.session.shipping,
        $totalAll: req.session.totalAll

    }, function(error) {

        if(error) {
            db.close();
            //need to remove previously added record in customers if there was an error
            console.log(error);
            //next(error);  - create next error handling function
        }
        else {
            console.log(`Order #${this.lastID} added to the Order table`);
            req.body.orderID = this.lastID;
            req.session.lastOrderID = this.lastID;
            db.close();
            next();
        }
        }
    )
}

//function writes order details to the database - the line items (each product sold)
function insertProductSold(req, res, next) {

    const db = new sqlite3.Database('../Database/daisyajewelry.db');
    
    //using a counter to ensure that the database does not get closed prematurely due to possible race conditions
    //I kept receiving an error where the database would close before everything was written - this solution works, need to research
    //how to better use promises in node.js - it's slightly different than in ES6
    const totalProducts = Object.keys(req.session.cart).length;
    let completedWrites = 0;

    for(const product in req.session.cart) {
        db.run('INSERT INTO Products_Sold (ORDER_ID, PRODUCT_ID, QUANTITY, METAL_TYPE, SIZE, EXTENDED_PRICE, PRODUCT_DESCRIPTION, ORDER_NOTES) VALUES ($order_id, $product_id, $quantity, $metal_type, $size, $extended_price, $description, $orderNotes)', {
            $order_id: req.body.orderID,
            $product_id: req.session.cart[product].product_id,
            $quantity: req.session.cart[product].quantity,
            $metal_type: req.session.cart[product].metalType.toLowerCase(),
            $size: req.session.cart[product].size,
            $extended_price: req.session.cart[product].extendedPrice,
            $description: req.session.cart[product].productType,
            $orderNotes: req.session.cart[product].orderNotes
        }, function(error) {
            completedWrites++;
            if(error) {

                console.log("Error in Writing to Product Table:", error);
                db.close();
                res.status(500).send();
                return;
            }
            else {
                console.log(`Product Sold ID #${this.lastID} added to the Products Sold table`);
            }
            if(completedWrites === totalProducts){
                db.close();
                next();
            }
        }
        )
    } 

}


/*  ------------------------------- Database Query Functions ------------------------------- */

//function queries all products currently in the product table
function getAllProducts(req, res, next) {

    const db = new sqlite3.Database('../Database/daisyajewelry.db');

    db.all('SELECT * FROM Products', (err, rows) =>
    {
        db.close();
        if(err){
            res.status(500).send()
            //next(error);  - create next error handling function?
        } else {
            res.json(rows);
        }
    })

}

//function to query the current set price from the product table based on product ID number
function getUnitPrice(productID) {
    //returns a middleware function, but it has access to the input parameter in the parent function
    return function (req, res, next) {
        const db = new sqlite3.Database('../Database/daisyajewelry.db');
        
        db.get('SELECT * FROM Products WHERE PRODUCT_ID = $id', {
            $id: productID
        }, (err, row) => {
            db.close();
            if(err){
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                res.json(row);
            }
        });
    }
}
//Query database based on parameters provided attached to req as query string
function getOrders(req, res, next) {

    const db = new sqlite3.Database('../Database/daisyajewelry.db');

    if(req.query.type === "all"){ 
        
        db.all('SELECT * FROM Orders', (err, rows) =>
        {
            db.close();
            if(err){
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                res.json(rows);
            }
        })
    }
    else if(req.query.type === "open") {
        db.all("SELECT * FROM Orders WHERE ORDER_STATUS='open'", (err, rows) =>
        {
            db.close();
            if(err){
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                res.json(rows);
            }
        })
    }
    else if(req.query.type === "orderID"){
        const container = {};

        db.get(`SELECT * FROM Orders WHERE ORDER_ID=${req.query.id}`, (err, row) =>
        {
            db.close();

            
            if(err){
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                //place result as a nested object to be consistent with format of other queries
                container[req.query.id] = row;
                res.json(container);
            }
        })
    }
    else if(req.query.type === "customerID"){
        const container = {};

        db.get(`SELECT * FROM Orders WHERE CUSTOMER_ID=${req.query.id}`, (err, row) =>
        {
            db.close();

            
            if(err){
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                //place result as a nested object to be consistent with format of other queries
                container[req.query.id] = row;
                res.json(container);
            }
        })





    }
    //need to close database connection once done
}
//function gets customer details of customer ID passed attached as query string
function getCustomer(req, res, next) {
        
const db = new sqlite3.Database('../Database/daisyajewelry.db');
    
    db.get('SELECT * FROM CUSTOMERS WHERE CUSTOMER_ID = $id', {
        $id: req.query.customerID
    }, (err, row) => {
        db.close();
        if(err){
            res.status(500).send()
            //next(error);  - create next error handling function
        } else {
            res.json(row);
        }
    });
}
//function gets order details (product details) based on order ID attached as query string
function getOrderDetails(req, res, next) {

    const db = new sqlite3.Database('../Database/daisyajewelry.db');

    db.all(`SELECT * FROM Products_Sold WHERE ORDER_ID=${req.query.orderID}`, (err, rows) =>
    {
        db.close();
        if(err){
            res.status(500).send()
            //next(error);  - create next error handling function
        } else {
            res.json(rows);
        }
    })
}



/*  ------------------------------- Database Update Functions ------------------------------- */

//function performs updates to the database based on the data passed in the request body
//values checked in the conditional are based on the class name of the element triggering the event
function updateOrder(req, res, next) {

    console.log(req.body);

    const db = new sqlite3.Database('../Database/daisyajewelry.db');

    let column;
    
    if(req.body.type == "statusSelect"){
        column = 'ORDER_STATUS';
    }

    else if(req.body.type == "dateTd"){
        column = 'SHIP_DATE';
    }
    else if(req.body.type == "notesTd"){
        column = 'ORDER_NOTES';
    }

    db.run(`UPDATE Orders SET ${column}="${req.body.toUpdate}" WHERE ORDER_ID=${req.body.orderID}`, (err) =>
    {
        db.close();
        if(err){
            res.status(500).send()
            //next(error);  - create next error handling function
        } else {
            res.send();
        }
    })
}



module.exports = {insertCustomer, insertOrder, insertProductSold, getAllProducts, getUnitPrice, getOrders, getCustomer, getOrderDetails, updateOrder};