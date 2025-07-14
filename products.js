
const formParent = document.getElementById('form');


const getFormInputs = (event) => {
    
    //overwrites the default behavior of the form's target / action attributes - allows javascript to take over
    event.preventDefault();
    
    //FormData API - use to create an object with the  name / values of the inputs
    const productDetails = new FormData(formParent);

    console.log(productDetails.get("metalType"));

    const submissionData = {
        method: "POST",
        body: productDetails
    }
    
    sendData(submissionData);
};


//Need to use  event type 'submit' on the event listener
formParent.addEventListener('submit', getFormInputs);


async function sendData(submissionData) {
  const url = "http://localhost:3000/cart/add";
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


