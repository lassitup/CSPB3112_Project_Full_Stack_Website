
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
        redirect: "follow" //This should instruct the browser to then new page on response
    }
    sendData(submissionData);
};


//Need to use  event type 'submit' on the event listener
formParent.addEventListener('submit', getFormInputs);


async function sendData(submissionData) {
  const url = "http://localhost:3000/cart/addBracelet";
  try {
    const response = await fetch(url, submissionData);
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    //checks if the response contains a redirection to a new page
   else if (response.redirected) {
      window.location = response.url;
    }
  } catch (error) {
    console.error(error.message);
  }
}



//------ Logic to update estimated total pricing in the order form ------ //

//holds the base price per unit - going to change this to a database query - keep all prices in a table
const unitPrice = 30.00;





const quantity = document.getElementById('quantity')
const  totalPrice = document.getElementById('totalPrice')

const updatePrice = () => {
  totalPrice.innerHTML = `$${(quantity.value * unitPrice).toFixed(2)}`;
};

//Call to update with the initial price
updatePrice();

//subsequent adjustments to the quantiity element will update the price
quantity.addEventListener('click', updatePrice);