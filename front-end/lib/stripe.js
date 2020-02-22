import { AsyncStorage } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';

const STRIPE_PK="pk_test_ZF5lBlZVpbU8ca5lzbPIcSij00c6beMC7O";
const BASE_URL="http://localhost:3000/"

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

    constructor() {
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

}
