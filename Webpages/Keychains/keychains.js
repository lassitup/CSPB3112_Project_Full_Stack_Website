
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
  const url = "http://localhost:3000/cart/addKeychain";
  try {
    const response = await fetch(url, submissionData);
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    //checks if the response contains a redirection to a new page
   /*else if (response.redirected) {
      window.location = response.url;
    }*/
   else {
    //provide a notifcation that item successfully added to cart
    //could build out div in html doc, when this returns 'unhide' it and call a function to hide after
    //a period of time
    const alert = document.getElementById('cartAdded');
    alert.style.display = 'block';
    setTimeout(() => {
      alert.style.display = 'none';
    }, 2000);
     //window.alert('Item successfully added to cart!');
   }
  } catch (error) {
    console.error(error.message);
  }
}



//------ Logic to update estimated total pricing in the order form ------ //

//holds the base price per unit - going to change this to a database query - keep all prices in a table
//attach the product id from the database query to the form submission - attaches it to the cart
//think about maybe putting some of these functions in a utility module

async function getUnitPrice() {
  const url = "http://localhost:3000/cart/getKeychainUnitPrice";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } 
  catch (error) {
    console.error(error.message);
  }
}



async function updatePrice() {
  
  //query database for the current product price
  const unit = await getUnitPrice();
  const quantity = document.getElementById('quantity');
  const  totalPrice = document.getElementById('totalPrice');

  //hidden form input
  const  extendedPrice = document.getElementById('extendedPrice');
  const  productID = document.getElementById('product_id');
  const  unitPrice= document.getElementById('price');
  


  //display the unit price on the page
  unitPrice.innerHTML = `$${unit.UNIT_PRICE.toFixed(2)} per Keychain`;
  //display the extended price on the page
  totalPrice.innerHTML = `$${(quantity.value * unit.UNIT_PRICE).toFixed(2)}`;
  
  //set hidden form input values as the extended price and productID to be submitted to the server
  extendedPrice.setAttribute('value', quantity.value * unit.UNIT_PRICE);
  productID.setAttribute('value', unit.PRODUCT_ID);

}



/*

const updatePrice = () => {
  totalPrice.innerHTML = `$${(quantity.value * unitPrice).toFixed(2)}`;
  extendedPrice.setAttribute('value', quantity.value * unitPrice);
};*/

//Call to update with the initial price
updatePrice();

//subsequent adjustments to the quantiity element will update the price
quantity.addEventListener('click', updatePrice);