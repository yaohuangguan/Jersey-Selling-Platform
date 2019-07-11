async function addToCart(id, quantity) {
  const result = await axios.post('/api/cart', { product_id: id, quantity });

  document.querySelector('#cartCount').innerHTML = result.data.cartCount;
}


async function addCustomPizza(quantity) {
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  console.log(checkedBoxes);

  const customizations = [];
  for (let i = 0; i < checkedBoxes.length; i += 1) {
    checkedBoxes[i].checked = false;
    customizations.push(parseInt(checkedBoxes[i].value));
  }

  console.log(customizations);
  const result = await axios.post('/api/cart', { product_id: 11, quantity, customizations });
  document.querySelector('#cartCount').innerHTML = result.data.cartCount;
}
async function updateItem(ele, cart_id) {
  const quantity = ele.previousElementSibling.value;
  console.log(quantity);
  const result = await axios.put('/api/cart/' + cart_id, { quantity });

  document.querySelector('#cartCount').innerHTML = result.data.cartCount;
 }

async function deleteItem(ele, cart_id) {
  const result = await axios.delete('/api/cart/' + cart_id);
  document.querySelector('#cartCount').innerHTML = result.data.cartCount;
  ele.parentNode.remove();
}

async function deleteCart() {
  const result = await axios.delete('/api/cart');
  document.querySelector('#cartCount').innerHTML = result.data.cartCount;
  const elementsToDelete = document.querySelectorAll('#cartItem > li');
  for (let i = 0; i < elementsToDelete.length; i += 1) {
    elementsToDelete[i].remove();
  }
}
