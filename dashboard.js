const testOrders = {
    order1: {
        orderNumber: 1,
        customerFirstName: "Justin",
        customerLastName: "Lassiter",
        address1: "250 E 32nd St.",
        address2: "Apartment R228",
        city: "Jasper",
        state: "Indiana",
        zip: "47546"
    },
    order2: {
        orderNumber: 2,
        customerFirstName: "Thomas",
        customerLastName: "Lassiter",
        address1: "250 E 32nd St.",
        address2: "Apartment R228",
        city: "Jasper",
        state: "Indiana",
        zip: "47546"
    }

};

console.log(testOrders.order1.orderNumber);

function displayOrders(event) {

    //const parent = event.target.parentNode;

    //Get table parent element (table body)
    const parent = document.getElementById('tableBody');

    for (let order in testOrders) {
        //console.log(testOrders[order]);
        //create new table row element - each order detail will be appended below
        const newTr = document.createElement('tr');
        
        for (let Detail in testOrders[order]) {
            
            //console.log(testOrders[Detail]);
            const newTd = document.createElement('td');
            
            let orderDetail = document.createTextNode(testOrders[order][Detail]);
            
            newTd.appendChild(orderDetail);

            newTr.appendChild(newTd);

        }

        parent.appendChild(newTr);

        //const orderLine = document.createTextNode(`${testOrders[order].orderNumber} ${testOrders[order].customerFirstName} ${testOrders[order].customerLastName}`);

        //newDiv.appendChild(orderLine);

        //parent.insertBefore(newDiv, event.target);

        //parent.appendChild(newDiv);

        /*
        <tr>
            <td>HTML tables</td>
            <td>HTML tables</td>
            <td>22</td>
        </tr>
        */

    }

}

const orderButton = document.getElementById('openOrders');

orderButton.addEventListener('click', displayOrders);




async function getData() {
  const url = "http://localhost:3000/orders";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

getData();