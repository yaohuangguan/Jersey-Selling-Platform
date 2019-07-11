const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET home page. */
router.post('/cart', async (req, res) => {
  const query = 'SELECT name FROM products WHERE id = $1';
  const parameters = [req.body.product_id];
  const result = await db.query(query, parameters);
  const itemToAdd = {
    cart_id: req.session.nextCartId,
    product_id: result.rows[0].id,
    name: result.rows[0].name,
    quantity: req.body.quantity,
  };

  if (req.body.customizations) {
    const customizations = [];
    for (let i = 0; i < req.body.customizations.length; i += 1) {
      const customizationQuery = 'SELECT * FROM customizations WHERE id = $1';
      const customizationParameters = [req.body.customizations[i]];
      const customizationResult = await db.query(customizationQuery, customizationParameters);

      customizations.push({ id: req.body.customizations[i], name: customizationResult.rows[0].name });
    }

    itemToAdd.customizations = customizations;
  }

  req.session.cart.push(itemToAdd);
  req.session.cartCount += req.body.quantity;
  req.session.nextCartId += 1;

  res.json({
    cartCount: req.session.cartCount, cart: req.session.cart });
});


router.put('/cart/:id', (req, res) => {
  for (let i = 0; i < req.session.cart.length; i += 1) {
    if (req.session.cart[i].cart_id == req.params.id) {
      if (req.body.quantity > req.session.cart[i].quantity) {
        req.session.cartCount += req.body.quantity - req.session.cart[i].quantity;
      } else {
        req.session.cartCount -= req.session.cart[i] - req.body.quantity;
      }
      req.session.cart[i].quantity = req.body.quantity;
      break;
    }
  }
  res.json({ cartCount: req.session.cartCount });
});

router.delete('/cart/:id', (req, res) => {
  for (let i = 0; i < req.session.cart.length; i += 1) {
    if (req.session.cart[i].cart_id === req.params.id) {
      req.session.cartCount -= req.session.cart[i].quantity;
      req.session.cart.splice(i, 1);
      break;
    }
  }
  res.json({ cartCount: req.session.cartCount });
});

router.delete('/cart', (req, res) => {
  req.session.cart = [];
  req.session.cartCount = 0;
  req.session.nextCartId = 1;

  res.json({ cartCount: req.session.cartCount });
});

module.exports = router;
