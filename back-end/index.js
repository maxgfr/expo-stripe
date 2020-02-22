const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const stripe = require('stripe')(process.env.STRIPE_SK);
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({success: true});
})

app.post('/transfer', (req, res, next) => {
    stripe.transfers.create({
      amount: req.body.amount,
      currency: req.body.currency,
      destination: req.body.destination,
      transfer_group: req.body.transfer_group,
    }).then((resultat) => {
      console.log(resultat)
      res.json(resultat);
    }).catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.post('/paymentIntent', (req, res, next) => {
    stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: req.body.currency,
      payment_method_types: req.body.payment_method_types,
      transfer_group: req.body.transfer_group,
      application_fee_amount: req.body.application_fee_amount,
    }).then((resultat) => {
      console.log(resultat)
      res.json(resultat);
    }).catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.post('/createStripeAccount', (req, res, next) => {
  stripe.accounts.create({
    type: req.body.type,
    country: req.body.country,
    email: req.body.email,
    requested_capabilities: req.body.requested_capabilities,
    individual: req.body.individual,
    business_type: req.body.business_type,
    business_profile: req.body.business_profile,
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: req.connection.remoteAddress
    }
  }).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.post('/updateAccount', (req, res, next) => {
  stripe.accounts.update(req.body.account_id, req.body.data).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.listen(port, () => console.log(`The application is listening on port ${port}!`))
