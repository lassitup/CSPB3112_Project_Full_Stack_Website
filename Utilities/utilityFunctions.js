//Functions that support multiple JS files

async function getUnitPrice() {
  const url = "http://localhost:3000/cart/getBraceletUnitPrice";
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