const sqlite3 = require('sqlite3')


//database write middleware here (use as an array - middleware chain)
//once written and workin, place into it's own file
//write customer data
//write order data
//write products_sold data

//function to write customer data to the database



/*  ------------------------------- Database Insertion Functions ------------------------------- */

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

function insertProductSold(req, res, next) {

    const db = new sqlite3.Database('../Database/daisyajewelry.db');
    
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
                db.close();
                //need to remove previously added record in customers and orders if there was an error
                res.status(500).send();
                return;
            }
            else {
                console.log(`Product Sold ID #${this.lastID} added to the Products Sold table`);
                db.close();
                next();
            }
        }
        )
    } 
}


/*  ------------------------------- Database Query Functions ------------------------------- */


function getAllProducts(req, res, next) {

    const db = new sqlite3.Database('../Database/daisyajewelry.db');

    db.all('SELECT * FROM Products', (err, rows) =>
    {
        db.close();
        if(err){
            //need to detemrine how to handle the error - set error code
            res.status(500).send()
            //next(error);  - create next error handling function
        } else {
            res.json(rows);
        }
    })
    //need to close database connection once done
}

function getUnitPrice(productID) {
    //returns a middleware function, but it has access to the input parameter in the parent function
    return function (req, res, next) {
    const db = new sqlite3.Database('../Database/daisyajewelry.db');
     
    db.get('SELECT * FROM Products WHERE PRODUCT_ID = $id', {
        $id: productID
    }, (err, row) => {
        db.close();
        if(err){
            //need to detemrine how to handle the error - set error code
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

    if(req.query.content === "all"){ 
        db.all('SELECT * FROM Orders', (err, rows) =>
        {
            db.close();
            if(err){
                //need to detemrine how to handle the error - set error code
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                res.json(rows);
            }
        })
    }
    else if(req.query.content === "open") [
        db.all("SELECT * FROM Orders WHERE ORDER_STATUS='open'", (err, rows) =>
        {
            db.close();
            if(err){
                //need to detemrine how to handle the error - set error code
                res.status(500).send()
                //next(error);  - create next error handling function
            } else {
                res.json(rows);
            }
        })
    ]


    //need to close database connection once done
}





module.exports = {insertCustomer, insertOrder, insertProductSold, getAllProducts, getUnitPrice, getOrders};