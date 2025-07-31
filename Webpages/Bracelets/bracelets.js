
import {addToCart, getUnitPrice} from "/utilityFunctions.js";



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
    //sendData(submissionData);
    addToCart('addBracelet', submissionData);
};


//Need to use  event type 'submit' on the event listener
formParent.addEventListener('submit', getFormInputs);


//------ Logic to update estimated total pricing in the order form based on quantity selected------ //


//function is called each type the quantity input is changed
async function updatePrice() {
  
  //query database for the current product price
  const unit = await getUnitPrice('getBraceletUnitPrice');
  const quantity = document.getElementById('quantity');
  const  totalPrice = document.getElementById('totalPrice');
  const  unitPrice= document.getElementById('price');

  //hidden form input
  const  extendedPrice = document.getElementById('extendedPrice');
  const  productID = document.getElementById('product_id');
  

  //display the unit price on the page
  unitPrice.innerHTML = `$${unit.UNIT_PRICE.toFixed(2)} per Bracelet`;
  //display the extended price on the page
  totalPrice.innerHTML = `$${(quantity.value * unit.UNIT_PRICE).toFixed(2)}`;
  
  //set hidden form input values as the extended price and productID to be submitted to the server
  extendedPrice.setAttribute('value', quantity.value * unit.UNIT_PRICE);
  productID.setAttribute('value', unit.PRODUCT_ID);

}


//Call to update with the initial price
updatePrice();

//subsequent adjustments to the quantiity element will update the price
quantity.addEventListener('click', updatePrice);