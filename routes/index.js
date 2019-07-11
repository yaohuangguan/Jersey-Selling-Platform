const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET home page. */ 
router.get('/', async (req, res) => {
  res.render('guest', { user: req.session.user });
});

router.get('/order', async (req, res) => {
  if (req.session.user) {
    const query = 'SELECT * FROM products WHERE id NOT IN (11)';
    const result = await db.query(query);

    const customizationsQuery = 'SELECT * FROM customizations';
    const customizationsResult = await db.query(customizationsQuery);
    console.log(customizationsResult);

    res.render('order', {
      user: req.session.user, products: result.rows, cartCount: req.session.cartCount, customizations: customizationsResult.rows,
    
    })

  }
  else {
    res.redirect('/users/login');
  }
})


router.get('/cart', (req, res) => {
  res.render('cart', { cart: req.session.cart, cartCount: req.session.cartCount });
});

router.get('/cart/submit', async (req, res) => {
  const orderQuery = 'INSERT INTO orders (customer_id, created_at) VALUES ($1, NOW()) RETURNING id';
  const orderParameters = [req.session.user.id];
  const orderResult = await db.query(orderQuery, orderParameters);
  const orderId = orderResult.rows[0].id;

  const cart = req.session.cart;

  for (let i =0; i < cart.length; i += 1) {
    const orderLineQuery = 'INSERT INTO order_lines (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id';
    const orderLineParameters = [orderId, cart[i].product_id, cart[i].quantity];
    const orderLineResult = await db.query(orderLineQuery, orderLineParameters);
    const orderLineId = orderLineResult.rows[0].id;

    if (cart[i].customizations) {
      const customizations = cart[i].customizations;
      for (let j = 0; j < customizations.length; j += 1) {
        const orderLineCustomizationQuery = 'INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES ($1, $2)';
        const orderLineCustomizationParameters = [orderLineId, customizations[j].id];
        const orderLineCustomizationResult = await db.query(orderLineCustomizationQuery,orderLineCustomizationParameters);
      }
    }
  }
  req.session.cart = [];
  req.session.cartCount = 0;
  req.session.nextCartId = 1;

  res.render('submit',{ orderId });
});

module.exports = router;
