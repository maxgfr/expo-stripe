const STRIPE_PK="pk_test_ZF5lBlZVpbU8ca5lzbPIcSij00c6beMC7O";
const BASE_URL="http://localhost:3000/";

const stripe = require('stripe-client')(STRIPE_PK);

export default class StripeConnector {

    static myInstance = null;

    /**
    * @returns {StripeConnector}
    */
    static getInstance() {
        if (StripeConnector.myInstance == null) {
            StripeConnector.myInstance = new StripeConnector();
        }
        return this.myInstance;
    }

    async getPaymentToken(number, expMonth, expYear, cvc, name, callback) {

      var information = {
        card: {
          number: number,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
          name: name
        }
      }

      const card = await stripe.createToken(information);

      callback(card);
    }

    addFileVerification(file, accountId) {
      return new Promise((resolve, reject) => {
        this.uploadDocument(file).then((fileId) => {
          var body = {
            accountId: accountId,
            data: {
              file: fileId
            }
          }
          fetch(BASE_URL+"updateAccount", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
        })
      });
    }

    uploadDocument(file) {
      return new Promise((resolve, reject) => {
        var fd = new FormData();
        fd.set('purpose', 'identity_document');
        fd.set('file', file);
        fetch('https://files.stripe.com/v1/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRIPE_PK}`
          },
          body: fd
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createStripeAccount(country, type, email, requested_capabilities, business_type, individual, business_profile) {
      return new Promise((resolve, reject) => {
        var body = {
          country: country,
          type: type,
          email: email,
          requested_capabilities: requested_capabilities,
          business_type: business_type,
          business_profile: business_profile,
          individual: individual
        }
        fetch(BASE_URL+"createStripeAccount", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createPaymentIntent(amount, currency, payment_method_types, transfer_group, application_fee_amount, destination) {
      return new Promise((resolve, reject) => {
        var body = {
          amount: amount,
          currency: currency,
          payment_method_types: payment_method_types,
          transfer_group: transfer_group,
          application_fee_amount: application_fee_amount,
          destination: destination
        }
        fetch(BASE_URL+"paymentIntents", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createPaymentMethodCard(number, exp_month, exp_year, cvc){
      return new Promise((resolve, reject) => {
        var body = {
          number: number,
          exp_month: exp_month,
          exp_year: exp_year,
          cvc: cvc,
        }
        fetch(BASE_URL+"createPaymentMethodCard", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    attachPaymentMethodCard(paymentMethodId, customerId) {
      return new Promise((resolve, reject) => {
        var body = {
          paymentMethodId: paymentMethodId,
          customerId: customerId
        }
        fetch(BASE_URL+"attachPaymentMethod", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createCustomer(name, email) {
      return new Promise((resolve, reject) => {
        var body = {
          name: name,
          email: email
        }
        fetch(BASE_URL+"createCustomer", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    paymentIntentsCustomer(amount, currency, payment_method_types) {
      return new Promise((resolve, reject) => {
        var body = {
          amount: amount,
          currency: currency,
          payment_method_types: payment_method_types
        }
        fetch(BASE_URL+"paymentIntents", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    processPayment(paymentMethodId, paymentId) {
      return new Promise((resolve, reject) => {
        var body = {
          paymentMethodId: paymentMethodId,
          paymentId: paymentId
        }
        fetch(BASE_URL+"confirmPaymentIntents", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

}
