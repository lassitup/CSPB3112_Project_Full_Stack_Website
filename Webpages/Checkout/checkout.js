
//Form Submission logic contained here - data will be sent to the server and held until final order is complete//

const formParent = document.getElementById('form');

const getFormInputs = (event) => {
    //overwrites the default behavior of the form's target / action attributes - allows javascript to take over
    event.preventDefault();
    
    //FormData API - use to create an object with the  name / values of the inputs
    const productDetails = new FormData(formParent);
    const submissionData = {
        method: "POST",
        body: productDetails,
        redirect: "follow" //This should instruct the browser to then load new page on response
    }
    sendData(submissionData);
};


//Need to use  event type 'submit' on the event listener
formParent.addEventListener('submit', getFormInputs);

//make it so the submit button doesn't appear / able to be pressed until this completes
//could add this function to a utility file and import - add a parameter so we can call with the desired server route?
async function sendData(submissionData) {
  const url = "http://localhost:3000/orders/submitOrder";
  try {
    const response = await fetch(url, submissionData);
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    console.log(response.status);
  } catch (error) {
    console.error(error.message);
  }
}




// maybe perform this calculation at checkout and have it trigger when they enter their zip code
async function getTotalPrice() {
  const url = "http://localhost:3000/cart/getTotalPrice";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const value = await response.text();

     return Number(value);
  } catch (error) {
    console.error(error.message);
  }
}


// perform this calculation at checkout and have it trigger when they enter their zip code
async function calculateTax(totalPrice, zip) {
  const url = `https://api.api-ninjas.com/v1/salestaxcalculator?zip_code=${zip}&amount=${totalPrice}`;
    const submissionData = {
    headers: {
       "X-Api-Key": "3FOkJPhAbdvIOpVhQSnpkQ==52rNhbQqIma0HP6z",
      } 
    }
  try {
    const response = await fetch(url, submissionData);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
      console.error(error.message);
  }
}

//need to display this on page


async function calculateTotal() {

  const price = await getTotalPrice();
  console.log(price);  const tax = await calculateTax(price, 47546);
  const total = price + tax[0].state_tax;

  //add the tax and new total to the DOM
  display_summary(tax[0].state_tax, total);

  //update the session on the server
  sendPriceData(tax[0].state_tax, total);
}


//function to submit the tax amount and the total price with tax
async function sendPriceData(tax, total) {
  const url = "http://localhost:3000/cart/updateTaxAndPrice";
  submissionData = {
    method: "PUT",
    body: JSON.stringify({ 
            tax,
            total
          }),
    headers: {
      "Content-Type": "application/json"
    }

  }
  console.log(submissionData.body);
  try {
    const response = await fetch(url, submissionData);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    //update button state to allow user to press/activate - 
    // ensures data was reeived by server before submitting the order
    //Could maybe refactor this to be included as hidden element in form submission
    //come back to and review
    const submitButton = document.getElementById('submitButton');

    submitButton.removeAttribute('disabled');
    
  } catch (error) {
    console.error(error.message);
  }
}


 const zip = document.getElementById('zip');

 zip.addEventListener('change', calculateTotal);

 //call and populate right away

 //display total price
  
async function display_summary(tax, totalAndTax) {
  //if the argumentsare empty, just populate the initial total
  if(tax === undefined){
    const initialPrice = document.getElementById('initialPrice');
    const priceCell = document.createElement('td');
    priceCell.innerHTML = await getTotalPrice();
    initialPrice.insertAdjacentElement('afterend', priceCell);
  }
  else {
    //otherwise, the initial amount is already populated so just populated the tax and new total
    const salesTax = document.getElementById('salesTax');
    const taxCell = document.createElement('td');
    taxCell.innerHTML = tax;
    salesTax.insertAdjacentElement('afterend', taxCell);

    const totalPrice = document.getElementById('totalPrice');
    const totalCell = document.createElement('td');
    totalCell.innerHTML = totalAndTax;
    totalPrice.insertAdjacentElement('afterend', totalCell);
  }
}


display_summary();