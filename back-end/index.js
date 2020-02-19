const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const stripe = require('stripe')('sk_test_qu0Z8ojKQxdr6S7SOclgPgKU006M8Tla43');
const app = express();
const port = 3000;
const STRIPE_SK="sk_test_qu0Z8ojKQxdr6S7SOclgPgKU006M8Tla43";

stripe.oauth.token({
  grant_type: 'authorization_code',
  code: 'ac_123456789',
}).then(function(response) {
  // asynchronously called
  var connected_account_id = response.stripe_user_id;
});

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.json({success: true});
})

app.post('/transfer', (req, res, next) => {
  var body = "amount="+req.body.amount+"&currency="+req.body.usd+"&destination="+req.body.destination+"&transfer_group="+req.body.transfer_group;
  fetch("https://api.stripe.com/v1/transfers", {
    body: body,
    headers: {
      Authorization: "Basic "+STRIPE_PK,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }).then((res) => {
    console.log(res);
    res.json({success: true});
  })

})

app.post('/paymentIntent', (req, res, next) => {
  var body = "amount="+req.body.amount+"&currency="+req.body.usd+"&payment_method_types[]="+req.body.payment_method_types+"&application_fee_amount="+req.body.application_fee_amount+"&transfer_group="+req.body.transfer_group;
  fetch("https://api.stripe.com/v1/payment_intents", {
    body: body,
    headers: {
      Authorization: "Basic "+STRIPE_PK,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }).then((res) => {
    console.log(res);
    res.json({success: true});
  })
})


app.listen(port, () => console.log(`The application is listening on port ${port}!`))
