
//JavaScript to handle interactions with the Cart page


const findPriceIndex = (prices, productType) => {
    for (const product of prices) {
      console.log(product.Product_Description);
      if (product.Product_Description === productType) {
        return product.Unit_Price;
      }
    }
} 

function displayCart(cart_data, prices) {

  //To keep track of and display the number of items in the cart
  let itemNumber = 1;
  //Get table parent element (table body)
  const parent = document.getElementById('tableBody');
  
  for (let cartItem in cart_data) {

    //determine the type of product being added - different products might have different characteristics
    if(cart_data[cartItem].productType === 'Bracelet'){
      
      const current_price = findPriceIndex(prices, 'Bracelet');
      const newTr = document.createElement('tr');
      //set id of row added to identify for removal
      newTr.id = cartItem;
      //establish array to hold all cells for the new row
      const newRow = [];
      //6 used as limit due to columns presented on cart table
      for(let i = 0; i < 8; i++) {
          newRow.push(document.createElement('td'));
      }
      //newRow[0].innerHTML = cartItem; //need to add logic to server to adjust numbers if something is deleted
      newRow[0].innerHTML = itemNumber;
      newRow[1].innerHTML = cart_data[cartItem].productType; 
      newRow[2].innerHTML = cart_data[cartItem].metalType; 
      newRow[3].innerHTML = cart_data[cartItem].wristSize; 
      newRow[4].innerHTML = cart_data[cartItem].quantity; 
      newRow[5].innerHTML = cart_data[cartItem].orderNotes; 
      newRow[6].innerHTML = `$${current_price.toFixed(2)}`;
      newRow[7].innerHTML = `$${(current_price * cart_data[cartItem].quantity).toFixed(2)}`; 

      //append each new data cell to the new row
      for(let i = 0; i < 8; i++) {
          newTr.appendChild(newRow[i]);
      }
      parent.appendChild(newTr);
      itemNumber++;
    }  
  }
}

//query the prices for the units here from the database
async function getPrices() {
  const url = "http://localhost:3000/Cart/getPrices";
  try {
    const response = await fetch(url);
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

async function getCart() {
  const url = "http://localhost:3000/Cart/getCart";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

async function populate_cart() {
  //wait for the cart fetch to complete
  const cart_data = await getCart();
  //wait for the db product prices fetch to complete
  const productPrices = await getPrices();
  console.log(productPrices);
  //then we can begin populating the cart
  displayCart(cart_data, productPrices);
}

populate_cart();

//Function to request an item be removed from the cart/session
async function removeFromCart(key) {
  const url = "http://localhost:3000/Cart/removeFromCart";

  const submissionData = {
    method: "DELETE",
    body: key,
    headers: {
      "Content-Type": "text/plain",
    },

  }

  try {
    const response = await fetch(url, submissionData);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    //execute removal of line item in table

  } catch (error) {
    console.error(error.message);
  }
}

removeFromCart('1');
