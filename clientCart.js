
const formParent = document.getElementById('form');


const getFormInputs = (event) => {
    
    //overwrites the behavior of the form's target / action attributes - allows javascript to take over
    event.preventDefault();
    
    //FormData API - use to create an object with the  name / values of the inputs
    const orderDetails = new FormData(formParent);

    console.log(orderDetails.get("customerFirstName"));

    const submissionData = {
        method: "POST",
        body: orderDetails
    }
    
    sendData(submissionData);
};



//Need to use  event type 'submit' on the event listener

formParent.addEventListener('submit', getFormInputs);



async function sendData(submissionData) {
  const url = "http://localhost:3000/orders";
  try {
    const response = await fetch(url, submissionData);
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
