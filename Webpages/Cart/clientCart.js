
//JavaScript to handle interactions with the Cart page

const findPriceIndex = (prices, productType) => {
    for (const product of prices) {
      console.log(product.PRODUCT_DESCRIPTION);
      if (product.PRODUCT_DESCRIPTION === productType) {
        return product.UNIT_PRICE;
      }
    }
} 


const displayCart = (cart_data, prices) => {

  //To keep track of and display the number of items in the cart
  let itemNumber = 1;

  let totalPrice = 0;

  //Get table parent element (table body)
  const parent = document.getElementById('tableBody');
  
  for (let cartItem in cart_data) {
    let current_price;
    //determine the type of product being added - different products might have different characteristics
    if(cart_data[cartItem].productType === 'bracelet'){
      
      current_price = findPriceIndex(prices, 'bracelet');
    }  
    else if(cart_data[cartItem].productType === 'necklace') {
      current_price = findPriceIndex(prices, 'necklace');
    }
    const newTr = document.createElement('tr');
    //set id of row added to identify for removal
    newTr.id = cartItem;
    //establish array to hold all cells for the new row
    const newRow = [];
    //6 used as limit due to columns presented on cart table
    for(let i = 0; i < 8; i++) {
        newRow.push(document.createElement('td'));
    }

    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', removeFromCart);
    newRow.push(removeButton);

    
    newRow[0].innerHTML = itemNumber;
    newRow[1].innerHTML = cart_data[cartItem].productType; 
    newRow[2].innerHTML = cart_data[cartItem].metalType; 
    newRow[3].innerHTML = cart_data[cartItem].size; 
    newRow[4].innerHTML = cart_data[cartItem].quantity; 
    newRow[5].innerHTML = `$${current_price.toFixed(2)}`;
    newRow[6].innerHTML = `$${(current_price * cart_data[cartItem].quantity).toFixed(2)}`;
    newRow[7].innerHTML = cart_data[cartItem].orderNotes;
    newRow[8].innerHTML = 'X'; 

    totalPrice += current_price * cart_data[cartItem].quantity;

    //append each new data cell to the new row
    for(let i = 0; i < 9; i++) {
        newTr.appendChild(newRow[i]);
    }
    parent.appendChild(newTr);
    itemNumber++;
  }  




  
  //send this total to the server and attach to the session
  updateTotal(totalPrice);
}

//query the prices for the units here from the database
async function getPrices() {
  const url = "http://localhost:3000/Cart/getProducts";
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

//Function to request an item be removed from the cart/session
async function removeFromCart(event) {//used id of event target to identify the correct row for deletion?
  
  const url = "http://localhost:3000/Cart/removeFromCart";
  const submissionData = {
    method: "DELETE",
    //target the id of the row - this was set to the id from the server
    body: event.currentTarget.parentElement.id,
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
    //execute removal of line item in table - refresh page
    location.reload();

  } catch (error) {
    console.error(error.message);
  }
}




async function updateTotal(totalPrice) {
  
  const url = "http://localhost:3000/Cart/updateTotal";
  const submissionData = {
    method: "PUT",
    //target the id of the row - this was set to the id from the server
    body: totalPrice.toString(),
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
  } catch (error) {
    console.error(error.message);
  }
}


//load the cart each time the page is loaded
populate_cart();
