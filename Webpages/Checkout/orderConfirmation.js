

async function getOrderID() {
  const url = "http://localhost:3000/lastOrderID";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const orderID = await response.json();
    const orderIDElement = document.getElementById('orderID');
    orderIDElement.innerHTML = `Your Order Number is ${orderID}`;
  } catch (error) {
    console.error(error.message);
  }
}

getOrderID();
