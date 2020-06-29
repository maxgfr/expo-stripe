const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SK);
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({success: true});
})

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

app.post('/createCustomer', (req, res, next) => {
    stripe.customers.create({
      name: req.body.name,
      email: req.body.email
    }).then((resultat) => {
      console.log(resultat)
      res.json(resultat);
    }).catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.post('/createToken', (req, res, next) => {
  stripe.tokens.create({
      customer: req.body.customerId,
    }, {
      stripeAccount: req.body.accountId,
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

app.post('/paymentIntents', (req, res, next) => {
  stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: req.body.currency,
    payment_method_types: req.body.payment_method_types,
    transfer_group: req.body.transfer_group,
    application_fee_amount: req.body.application_fee_amount,
    transfer_data: {
      destination: req.body.destination
    }
  }).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.post('/createPaymentMethodCard', (req, res, next) => {
  stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: req.body.number,
      exp_month: req.body.exp_month,
      exp_year: req.body.exp_year,
      cvc: req.body.cvc,
    }
  }).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.post('/paymentIntentsCustomer', (req, res, next) => {
  stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: req.body.currency,
    payment_method_types: req.body.payment_method_types
  }).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.post('/attachPaymentMethod', (req, res, next) => {
  stripe.paymentMethods.attach(
    req.body.paymentMethodId,
    {
      customer: req.body.customerId
    }).then((resultat) => {
      console.log(resultat)
      res.json(resultat);
    }).catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.post('/confirmPaymentIntents', (req, res, next) => {
  stripe.paymentIntents.confirm(req.body.paymentId, {
      payment_method: req.body.paymentMethodId
    })
  .then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

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

app.post('/topUp', (req, res, next) => {
  stripe.topups.create({
    amount: req.body.amount,
    currency: req.body.currency,
    description: req.body.description,
    statement_descriptor: req.body.statement_descriptor
  }).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.post('/payout', (req, res, next) => {
  stripe.payouts.create({
    amount: req.body.amount,
    currency: req.body.currency
  }).then((resultat) => {
    console.log(resultat)
    res.json(resultat);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.listen(port, () => console.log(`The application is listening on port ${port}!`))
