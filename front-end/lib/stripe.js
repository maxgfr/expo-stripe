import { AsyncStorage } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';

const STRIPE_REDIRECT_URI= AuthSession.getRedirectUrl();
const STRIPE_BASE_URL="https://api.Stripe.com/v1";
const STRIPE_OAUTH_URL="https://api.Stripe.com/oauth/authorize";
const STRIPE_OAUTH_URL_SERVER="https://api.Stripe.com/oauth/access_token";
const STRIPE_SCOPES="basic";
const STRIPE_PK="pk_test_ZF5lBlZVpbU8ca5lzbPIcSij00c6beMC7O";

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

    constructor(){
      Stripe.setOptionsAsync({
        publishableKey: STRIPE_PK
      });
    }

    async paymentIntentsTransferDirect(payment_method_types, amount, currency, application_fee_amount, stripe_account) {
      var body = "payment_method_types[]="+payment_method_types+"&amount="+amount+"&currency="+currency+"&application_fee_amount="+application_fee_amount+"&transfer_data[destination]="+stripe_account;
      fetch("https://api.stripe.com/v1/payment_intents", {
        body: body,
        headers: {
          Authorization: "Basic "+STRIPE_SK,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      }).then((res) => {
        console.log(res)
      })
    }

    async paymentIntentsTransferGroup (amount, currency, payment_method_types, application_fee_amount, transfer_group) {
      var body = "amount="+amount+"&currency="+usd+"&payment_method_types[]="+payment_method_types+"&application_fee_amount="+application_fee_amount+"&transfer_group="+transfer_group;
      fetch("https://api.stripe.com/v1/payment_intents", {
        body: body,
        headers: {
          Authorization: "Basic "+STRIPE_PK,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
    }

    async transfer (amount, currency, destination, transfer_group) {
      var body = "amount="+amount+"&currency="+usd+"&destination="+destination+"&transfer_group="+transfer_group;
      fetch("https://api.stripe.com/v1/transfers", {
        body: body,
        headers: {
          Authorization: "Basic "+STRIPE_PK,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
    }


}
