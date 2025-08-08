// --- JavaScript to handle activity within the Bracelets Product Page --- //

//Bring in functions commonly used in each product page
import {addToCart, getUnitPrice} from "/utilityFunctions.js";


//assign the head of the form
const formParent = document.getElementById('form');

//converts all inputs in the form into a FormData object that's sent to the server
const getFormInputs = (event) => {
    //overwrites the default behavior of the form's target / action attributes - allows javascript to take over
    event.preventDefault();
    
    //FormData API - used to create an object with the  name / values of the inputs
    const productDetails = new FormData(formParent);
    const submissionData = {
        method: "POST",
        body: productDetails,
        redirect: "follow" //This should instruct the browser to then new page on response
    }

    //sends the data to the server
    addToCart('addBracelet', submissionData);
};


//listen for the 'submit' event to trigger sending data to the server
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


//Call immediately to update with the initial price with 1 unit
updatePrice();

//Subsequent adjustments by the user to the quantiity element will update the price
const quantity = document.getElementById('quantity');
quantity.addEventListener('click', updatePrice);