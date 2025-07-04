const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer();


//Use multer to access form data

app.get('/orders', (req, res) => {
    //set headers to fix the CORS error
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.json('We did it!');
});


app.post('/orders', upload.none(), (req, res) => {
    //set headers to fix the CORS error
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    console.log("Caught Order!");
    console.log(req.body);
    res.json('Test');
});



app.listen(3000, () => {
    console.log('Server up and running!');
});





