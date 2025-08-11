//Functions that support multiple Product files


//Form Submission logic contained here - data will be sent to the server and held until final order is complete//

const getFormInputs = (event) => {
    //overwrites the default behavior of the form's target / action attributes - allows javascript to take over
    event.preventDefault();
    
    //FormData API - use to create an object with the  name / values of the inputs
    const productDetails = new FormData(formParent);
    const submissionData = {
        method: "POST",
        body: productDetails,
        redirect: "follow" //This should instruct the browser to go  to page on response
    }
    sendData(submissionData);
};



//Function to retrieve the base price of the selected unit
//Call with the route path for the specific product type
async function getUnitPrice(path) {
  const url = `http://localhost:3000/cart/${path}`;
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

//Function to add items to the session cart
async function addToCart(path, submissionData) {
  const url = `http://localhost:3000/cart/${path}`;
  try {
    const response = await fetch(url, submissionData);
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
   else {
    //provides a notifcation that item successfully added to cart
    const alert = document.getElementById('cartAdded');
    alert.style.display = 'block';
    setTimeout(() => {
      alert.style.display = 'none';
    }, 2000);
   }
  } catch (error) {
    console.error(error.message);
  }
}


export {getFormInputs, getUnitPrice, addToCart};