

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

        //contentEditable attribute
        tdArray[0].innerHTML = orders[order].ORDER_ID;

        tdArray[1].innerHTML = `${orders[order].CUSTOMER_ID} +/-`;
        tdArray[1].classList.add('expandButton');
        tdArray[1].addEventListener('click', showCustomerDetails);
        
        //add button here that triggers query and display of sub table within order details / line items
        tdArray[2].innerHTML = '+ / -';
        tdArray[2].classList.add('expandButton');
        tdArray[2].addEventListener('click', showOrderDetails);


        tdArray[3].innerHTML = orders[order].ORDER_DATE;

        //create select listing for user to update order status
        //tdArray[4].innerHTML = orders[order].ORDER_STATUS;
        const selectElem = document.createElement('select');
        selectElem.setAttribute("name", "statusSelect");
    

        const currentStatus = document.createElement('option');
        currentStatus.setAttribute("value", orders[order].ORDER_STATUS);
        currentStatus.innerHTML = `Current Status: ${orders[order].ORDER_STATUS}`;

        const openStatus = document.createElement('option');
        openStatus.setAttribute("value", "open");
        openStatus.innerHTML = "Open";

        const completeStatus = document.createElement('option');
        completeStatus.setAttribute("value", "complete");
        completeStatus.innerHTML = "Complete";

        const cancelStatus = document.createElement('option');
        cancelStatus.setAttribute("value", "canceled");
        cancelStatus.innerHTML = "Cancel";

        selectElem.appendChild(currentStatus);
        selectElem.appendChild(openStatus);
        selectElem.appendChild(completeStatus);
        selectElem.appendChild(cancelStatus);

        selectElem.addEventListener('change', updateOrder);
        selectElem.classList.add('statusSelect');
        tdArray[4].appendChild(selectElem);
        tdArray[4].className = 'statusTd';

        const shipDateInput= document.createElement('input');
        shipDateInput.type = 'date';
        shipDateInput.className = 'dateTd'
        shipDateInput.value = orders[order].SHIP_DATE;
        shipDateInput.addEventListener('change', updateOrder);
        tdArray[5].appendChild(shipDateInput);
        
    
        const newTextarea = document.createElement('textarea');
        newTextarea.value = orders[order].ORDER_NOTES;
        newTextarea.addEventListener('change', updateOrder);
        newTextarea.className = 'notesTd';
        tdArray[6].appendChild(newTextarea);

        tdArray[7].innerHTML = `$${orders[order].TOTAL_PRICE.toFixed(2)}`;
        tdArray[8].innerHTML = `$${orders[order].SHIPPING.toFixed(2)}`;
        tdArray[9].innerHTML = `$${orders[order].SALES_TAX.toFixed(2)}`;
        tdArray[10].innerHTML = `$${orders[order].TOTAL_ALL.toFixed(2)}`;

        for (let cell of tdArray) {
            newRow.appendChild(cell);
        }

        tableBody.appendChild(newRow);
    }

}


async function updateOrder(event) {
    //get the order number

    const orderID = event.target.parentElement.parentElement.firstChild.innerHTML;

    const submissionData = {
        method: "POST",
        body: JSON.stringify(
            {
                type: event.target.className,
                orderID: orderID,
                toUpdate: event.target.value
            }),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const url = `http://localhost:3000/dbManage/updateOrder`;
    try {
        const response = await fetch(url, submissionData);
        if (!response.ok) {
        console.log(response);
        throw new Error(`Response status: ${response.status}`);
        }
    } 
    catch (error) {
        console.error(error.message);
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


async function getCustomerDetails(customerID) {

    //build request based on the scope of data needed
    const url = `http://localhost:3000/dbManage/getCustomer?customerID=${customerID}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        const row = await response.json();
        return row;
    } catch (error) {
        console.error(error.message);
    }
}


async function showOrderDetails(event) {

    //get the parent row of order idand then add a new sibing after limit the width of the new row so it doesn't overlap/blend with the parent table
    const parentRow = event.target.parentElement;

    //ensure that we don't try to access a null sibling
    const subTableRow1 = parentRow.nextElementSibling;
    let subTableRow2 = null;
    if(subTableRow1 != null)
    {
        subTableRow2 = parentRow.nextElementSibling.nextElementSibling;
    }

    //check first to ensure the row isn't null before tryiong to check the class name
    //this allows short circuiting with the and operator
    if(subTableRow1 != null && subTableRow1.className == "subTableRowProduct"){
            subTableRow1.remove();
    } else if(subTableRow2 != null && subTableRow2.className == "subTableRowProduct") {
            subTableRow2.remove();
    }
    else {

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

        for (let line of orderDetails){
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
            detailArray[4].innerHTML = `$${line.EXTENDED_PRICE.toFixed(2)}`;
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
        tableRow.className = "subTableRowProduct";



        parentRow.insertAdjacentElement('afterend', tableRow);

    }
}


async function showCustomerDetails(event) {

    //get the parent row of order idand then add a new sibing after limit the width of the new row so it doesn't overlap/blend with the parent table
    const parentRow = event.target.parentElement;
    
    //ensure that we don't try to access a null sibling
    const subTableRow1 = parentRow.nextElementSibling;
    let subTableRow2 = null;
    if(subTableRow1 != null)
    {
        subTableRow2 = parentRow.nextElementSibling.nextElementSibling;
    }

    //check first to ensure the row isn't null before tryiong to check the class name
    //this allows short circuiting with the and operator
    if(subTableRow1 != null && subTableRow1.className == "subTableRowCustomer"){
            subTableRow1.remove();
    } else if(subTableRow2 != null && subTableRow2.className == "subTableRowCustomer") {
            subTableRow2.remove();
    } else {

        const customerID = event.target.previousElementSibling.innerHTML;
        //get all order details related to the order number value in the data cell
        const customerDetails = await getCustomerDetails(customerID);

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

        for(let i = 0; i < 10; i++){
            const th = document.createElement('th');
            thArray.push(th);
        }
        thArray[0].innerHTML = "First Name";
        thArray[1].innerHTML = "Last Name";
        thArray[2].innerHTML = "Address 1";
        thArray[3].innerHTML = "Address 2";
        thArray[4].innerHTML = "City";
        thArray[5].innerHTML = "State";
        thArray[6].innerHTML = "Country";
        thArray[7].innerHTML = "Zip Code";
        thArray[8].innerHTML = "Phone";
        thArray[9].innerHTML = "Email";

        for(const th of thArray){
            headRow.appendChild(th);
        }

        const newTR = document.createElement('tr');
        const detailArray = [];

        //create data cells
        for(let i = 0; i < 10; i++){
            const newTD = document.createElement('td');
            detailArray.push(newTD);
        }
        detailArray[0].innerHTML = customerDetails.FIRST_NAME;
        detailArray[1].innerHTML = customerDetails.LAST_NAME;
        detailArray[2].innerHTML = customerDetails.ADDRESS_1;
        detailArray[3].innerHTML = customerDetails.ADDRESS_2;
        detailArray[4].innerHTML = customerDetails.CITY;
        detailArray[5].innerHTML = customerDetails.STATE;
        detailArray[6].innerHTML = customerDetails.COUNTRY;
        detailArray[7].innerHTML = customerDetails.ZIP;
        detailArray[8].innerHTML = customerDetails.PHONE;
        detailArray[9].innerHTML = customerDetails.EMAIL;


        for(const td of detailArray){
            newTR.appendChild(td);
        }

        tableBody.appendChild(newTR);
    

        const tableRow = document.createElement('tr');
        const td = document.createElement('td');
        td.appendChild(newTable);
        td.colSpan = "11";
        tableRow.appendChild(td);
        tableRow.className = "subTableRowCustomer";

        parentRow.insertAdjacentElement('afterend', tableRow);

    }
}




//show all open orders
//query a specifc order number
//be able to update order status and add notes
//have the ability to expand the customer id and the product details of the order - subtables
