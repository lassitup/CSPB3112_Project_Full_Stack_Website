

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
        tdArray[2].classList.add('expandButton');
        tdArray[2].addEventListener('click', showOrderDetails);


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

}

async function getOrderDetails(orderID) {


    //build request based on the scope of data needed
    const url = `http://localhost:3000/dbManage/getOrderDetails?orderID=${orderID}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        const rows = await response.json();
        return rows;
    } catch (error) {
        console.error(error.message);
    }
}


async function showOrderDetails(event) {

    //get the parent row of order idand then add a new sibing after limit the width of the new row so it doesn't overlap/blend with the parent table
    const parentRow = event.target.parentElement;

    if(parentRow.nextElementSibling.className == "subTableRow"){
            parentRow.nextElementSibling.remove();
    }else {

        const orderID = event.target.previousElementSibling.previousElementSibling.innerHTML;
        //get all order details related to the order number value in the data cell
        const orderDetails = await getOrderDetails(orderID);




        const newTable = document.createElement('table');
        newTable.classList.add('table')
        newTable.classList.add('subtable')
        const newTableHead = document.createElement('thead');
        newTable.appendChild(newTableHead);
        const headRow = document.createElement('tr');
        newTableHead.appendChild(headRow);
        const tableBody = document.createElement('tbody');
        newTable.appendChild(tableBody);

        //create header cells
        const thArray = [];

        for(let i = 0; i < 6; i++){
            const th = document.createElement('th');
            thArray.push(th);
        }
        thArray[0].innerHTML = "Product";
        thArray[1].innerHTML = "Order Quantity";
        thArray[2].innerHTML = "Metal Type";
        thArray[3].innerHTML = "Size";
        thArray[4].innerHTML = "Extended Price";
        thArray[5].innerHTML = "Order Notes";

        for(const th of thArray){
            headRow.appendChild(th);
    
        }

        console.log(orderDetails);

        for (let line of orderDetails){
            console.log(line);
            const newTR = document.createElement('tr');
            const detailArray = [];

            //create data cells
            for(let i = 0; i < 6; i++){
                const newTD = document.createElement('td');
                detailArray.push(newTD);
            }
            detailArray[0].innerHTML = line.PRODUCT_DESCRIPTION;
            detailArray[1].innerHTML = line.QUANTITY;
            detailArray[2].innerHTML = line.METAL_TYPE;
            detailArray[3].innerHTML = line.SIZE;
            detailArray[4].innerHTML = line.EXTENDED_PRICE;
            detailArray[5].innerHTML = line.ORDER_NOTES;

            console.log(detailArray);
            for(const td of detailArray){
                newTR.appendChild(td);
            }

            tableBody.appendChild(newTR);
    
        }

        const tableRow = document.createElement('tr');
        const td = document.createElement('td');
        td.appendChild(newTable);
        td.colSpan = "11";
        tableRow.appendChild(td);
        tableRow.className = "subTableRow";



        parentRow.insertAdjacentElement('afterend', tableRow);

    }
    //product description
    //quanitity
    //metal type
    //size
    //extended price
}







//show all open orders
//query a specifc order number
//be able to update order status and add notes
//have the ability to expand the customer id and the product details of the order - subtables
