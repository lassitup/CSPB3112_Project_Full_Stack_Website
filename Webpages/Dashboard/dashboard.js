

const button1 = document.getElementById('openOrders');
const button2 = document.getElementById('allOrders');
const button3 = document.getElementById('searchOrderButton');
const button4 = document.getElementById('searchCustomerButton');

button1.addEventListener('click', getOrders);
button2.addEventListener('click', getOrders);
button3.addEventListener('click', getOrders);
button4.addEventListener('click', getOrders);

//show all orders

//Function to return order details from the database
//Query parameters used to specify the reequested items
async function getOrders(event) {

    //By default, button element has a value of an empty string
    //Test if the button has a value, if not go to the previous element and get the value from the input
    let queryStringType = "";
    let queryStringID = "";
    if(event.target.value === ""){
        //can further test is if the input is for cust or order id and attach to query
        // or maybe place the order id / customer num in the query string and can then test of they are empty on the server
        const inputElement = event.target.previousElementSibling;

        //console.log(inputElement.id);
        if(inputElement.id === "searchOrderID"){
            queryStringType = "orderID"
            queryStringID = inputElement.value;
        }
        else if(inputElement.id === "searchCustomerID") {
            queryStringType = "customerID"
            queryStringID = inputElement.value;
        }

    } else {
        queryStringType = event.target.value;
    }


    //build request based on the scope of data needed
    const url = `http://localhost:3000/dbManage/getOrders?type=${queryStringType}&id=${queryStringID}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const rows = await response.json();
        populateDashboard(rows);
    } catch (error) {
        console.error(error.message);
    }
}


function populateDashboard(orders) {
    const tableBody = document.getElementById('tableBody');
    //This will remove all child elements and handles cleaning up event listeners within
    tableBody.innerHTML = "";
    //console.log(orders);

    for(let order in orders){
        const newRow = document.createElement('tr');
        const tdArray = [];
        for (let i = 0; i < 11; i++) {
            const newCell = document.createElement('td');
            tdArray.push(newCell);
        }

        console.log(orders[order]);
        tdArray[0].innerHTML = orders[order].ORDER_ID;
        tdArray[1].innerHTML = `${orders[order].CUSTOMER_ID} +/-`;
        //add button here that triggers query and display of sub table within order details / line items
        tdArray[2].innerHTML = '+ / -';
        
        tdArray[3].innerHTML = orders[order].ORDER_DATE;
        tdArray[4].innerHTML = orders[order].ORDER_STATUS;
        tdArray[5].innerHTML = orders[order].SHIP_DATE;
        tdArray[6].innerHTML = orders[order].ORDER_NOTES;
        tdArray[7].innerHTML = orders[order].TOTAL_PRICE;
        tdArray[8].innerHTML = orders[order].SHIPPING;
        tdArray[9].innerHTML = orders[order].SALES_TAX;
        tdArray[10].innerHTML = orders[order].TOTAL_ALL;

        for (let cell of tdArray) {
            newRow.appendChild(cell);
        }

        tableBody.appendChild(newRow);
    }

    //create a new empty row
    //loop through the returned objects
    //add each component as a cell to the row
    //once all added, add the row as a child to the table body

}

async function getCustomer(event) {

    //By default, button element has a value of an empty string
    //Test if the button has a value, if not go to the previous element and get the value from the input
    let queryString;
    if(event.target.value === ""){

        const inputElement = event.target.previousElementSibling;
        queryString = inputElement.value;
        
    } else {
        queryString = event.target.value;
    }
    //build request based on the scope of data needed
    const url = `http://localhost:3000/dbManage/getCustomer?customerID=${queryString}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        const rows = await response.json();
        populateDashboard(rows);
    } catch (error) {
        console.error(error.message);
    }
}



//show all open orders
//query a specifc order number
//be able to update order status and add notes
//have the ability to expand the customer id and the product details of the order - subtables
