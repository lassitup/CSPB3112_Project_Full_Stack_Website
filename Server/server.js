const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3')
const path = require('path');
const session = require('express-session');
const orders = require('./orders.js');
const cart = require('./cart.js');

//To handle sessions, need pckages:
//express-session


//Establish Express Server
const app = express();

//MemoryStore should not be used in production
const store = new session.MemoryStore();

app.use(session({
    //best practice is to set expiration on cookie - the Session ID is automatically set by express-session
    resave: false,
    saveUninitialized: false,
    secret: "tempSecret", //For production, this should be placed in env variable outside of code
    store
}))


//set headers to fix the CORS error
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//Mount the Routers
app.use('/orders', orders);
app.use('/cart', cart);

 
//directs the server to pull static pages like other html/css/images to the appropriate directory
//__dirname refers to the current directory running the serve JS file
app.use(express.static(path.join(__dirname, '..')));

//request the home page of the website
app.get('/daisyajewelry.com', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
})



app.listen(3000, () => {
    console.log('Server up and running!');
});





