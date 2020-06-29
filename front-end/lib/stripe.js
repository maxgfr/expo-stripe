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

    async getPaymentToken(number, expMonth, expYear, cvc, name, currency, callback) {

      var information = {
        card: {
          number: number,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
          name: name,
          currency: currency
        }
      }

      const card = await stripe.createToken(information);

      callback(card);
    }

    addFileVerification(file, account_id) {
      return new Promise((resolve, reject) => {
        this.uploadDocument(file).then((res) => {
          var body = {
            account_id: account_id,
            data: {
              individual: {
                verification: {
                  document: {
                    front: res.id,
                    back: null
                  }
                },
              }
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
        fd.append('purpose', 'identity_document');
        fd.append('file', {uri: file, name: Date.now()+Math.floor(Math.random() * 100)+'.jpg', type: 'image/jpeg'});
        fetch('https://files.stripe.com/v1/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRIPE_PK}`,
            'Content-Type': 'multipart/form-data'
          },
          body: fd
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createStripeAccount(country, type, email, requested_capabilities, business_type, individual, business_profile) {
      return new Promise((resolve, reject) => {
        var body = {
          country, type, email, requested_capabilities, business_type, individual, business_profile
        }
        fetch(BASE_URL+"createStripeAccount", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createPaymentIntent(amount, currency, payment_method_types, transfer_group, application_fee_amount, destination, customer) {
      return new Promise((resolve, reject) => {
        var body = {
          amount, currency, payment_method_types, transfer_group, application_fee_amount, destination, customer
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

    paymentIntentsCustomer(amount, currency, payment_method_types, customer) {
      return new Promise((resolve, reject) => {
        var body = {
          amount, currency, payment_method_types, customer
        }
        fetch(BASE_URL+"paymentIntentsCustomer", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    processPayment(paymentMethodId, paymentId ) {
      return new Promise((resolve, reject) => {
        var body = {
          paymentMethodId, paymentId
        }
        fetch(BASE_URL+"confirmPaymentIntents", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    topUp(amount, currency, description, statement_descriptor) {
      return new Promise((resolve, reject) => {
        var body = { amount, currency, description, statement_descriptor }
        fetch(BASE_URL+"topUp", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    addBankAccount(account_id, country, currency, account_number, routing_number) {
      return new Promise((resolve, reject) => {
        var body = { account_id, country, currency, account_number, routing_number }
        fetch(BASE_URL+"addBankAccount", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    addCard(account_id, token) {
      return new Promise((resolve, reject) => {
        var body = { account_id, token }
        fetch(BASE_URL+"addCard", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }

    createTransfer(amount, currency, destination, transfer_group) {
      return new Promise((resolve, reject) => {
        var body = {
          amount, currency, destination, transfer_group
        }
        fetch(BASE_URL+"transfer", {
          body: JSON.stringify(body),
          headers: { 'Content-type': 'application/json' },
          method: "POST"
        }).then((response) => response.json()).then((responseJson) => resolve(responseJson)).catch((err) => reject(err));
      });
    }
}
