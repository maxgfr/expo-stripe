import { AsyncStorage } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';

const STRIPE_REDIRECT_URI= AuthSession.getRedirectUrl();
const STRIPE_BASE_URL="https://api.Stripe.com/v1";
const STRIPE_OAUTH_URL="https://api.Stripe.com/oauth/authorize";
const STRIPE_OAUTH_URL_SERVER="https://api.Stripe.com/oauth/access_token";
const STRIPE_SCOPES="basic";
const STRIPE_PK="pk_test_ZF5lBlZVpbU8ca5lzbPIcSij00c6beMC7O";
const STRIPE_SK="sk_test_qu0Z8ojKQxdr6S7SOclgPgKU006M8Tla43";

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

    async pay() {
      const options = {
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Gunilla Haugeh',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: 'Georgia',
            country: 'US',
            postalCode: '31217',
          },
        },
      };

      const token = await stripe.paymentRequestWithCardFormAsync(options);
    }




}
