
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
    console.log(response);
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
  console.log(price);
  const tax = await calculateTax(price, 47546);
  const total = price + tax;
  console.log(tax);
  //add these results to the DOM and then post them to the server

}

 const zip = document.getElementById('zip');

 zip.addEventListener('change', calculateTotal);