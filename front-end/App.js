import React, { useState, useEffect } from 'react';
import { ScrollView, Button, Text } from 'react-native';
import StripeConnector from './lib/stripe';

export default function App() {

  const [accountId, setAccountId] = useState('');
  const [id1, setId1] = useState('');
  const [id2, setId2] = useState('');
  const [token, setToken] = useState('');
  const [chargeId, setChargeId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [attach, setAttach] = useState('');
  const [paymentIntentCustomerId, setPaymentIntentCustomerId] = useState('');
  const [processPayment, setProcessPayment] = useState('');

  useEffect(() => {
  }, [])

  _onCreateCustomAccount = () => {
    let stripe = StripeConnector.getInstance();
    var info = {
      dob: {
        day: 16,
        month: 3,
        year: 1998
      },
      address: {
          line1: "Place de la concorde",
          city: "Paris",
          state: "France",
          postal_code: "75001",
      },
      email: "max@sisilafamille.fr",
      first_name: "Maxime",
      last_name: "Gfr",
      gender: "male",
      phone: "+33612345678"
    }
    var business_profile = {
      mcc: '7311',
      url: 'https://sinaps.io/@max'
    }
    var promises = [];
    promises.push(stripe.createStripeAccount("FR", "custom", "max@sisilafamille.fr", ["card_payments", "transfers"], 'individual', info, business_profile));
    promises.push(stripe.createStripeAccount("FR", "custom", "contact@sisilafamille.fr", ["card_payments", "transfers"], 'individual', info, business_profile));
    Promise.all(promises).then((res) => {
      //console.log(res[0], res[1]);
      var id_one = res[0].id;
      var id_two =  res[1].id;
      setId1(res[0].id);
      setId2(res[1].id);
      setAccountId('First id : '+res[0].id+'. Second id : '+res[1].id)
    }).catch((err) => {
      console.log(err);
    })
  }

  _onPay = () => {
    let stripe = StripeConnector.getInstance();
    stripe.getPaymentToken('4242424242424242', 5, 2021, '223', 'Maxime Gfr', function(res) {
      //console.log(res);
      setToken(res.id);
    })
  }

  _onPaymentIntent = () => {
    let stripe = StripeConnector.getInstance();
    stripe.createPaymentIntent(15000, 'eur', ['card'], '{ORDER10}', 1000, customerId).then((res) => {
      //console.log(res);
      setChargeId(res.id)
    }).catch((err) => {
      console.log(err);
    })
  }

  _onCreateCustomer= () => {
    let stripe = StripeConnector.getInstance();
    stripe.createCustomer("Maxime Gfr", "max.imko@yahoo.fr").then((res) => {
      //console.log(res);
      setCustomerId(res.id)
    }).catch((err) => {
      console.log(err);
    })
  }

  _addCard = () => {
    let stripe = StripeConnector.getInstance();
    stripe.createPaymentMethodCard('4242424242424242', 5, 2021, '223').then((res) => {
      //console.log(res);
      setPaymentMethodId(res.id)
    }).catch((err) => {
      console.log(err);
    })
  }

  _attachCard = () => {
    let stripe = StripeConnector.getInstance();
    stripe.attachPaymentMethodCard(paymentMethodId, customerId).then((res) => {
      //console.log(res);
      setAttach("Done");
    }).catch((err) => {
      console.log(err);
    })
  }

  _onPaymentIntentCustomer = () => {
    let stripe = StripeConnector.getInstance();
    stripe.paymentIntentsCustomer(15000, 'eur', ['card']).then((res) => {
      //console.log(res);
      setPaymentIntentCustomerId(res.id)
    }).catch((err) => {
      console.log(err);
    })
  }

  _onProcessPaymentCustomer = () => {
    let stripe = StripeConnector.getInstance();
    stripe.processPayment(paymentMethodId, paymentIntentCustomerId).then((res) => {
      //console.log(res);
      setProcessPayment("Done")
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={_onPay} title="Get Payment token (charge)"/>
      <Text>{token}</Text>

      <Button onPress={_onCreateCustomAccount} title="Create custom account"/>
      <Text>{accountId}</Text>
      <Button onPress={_onPaymentIntent} title="Use Payment Intent account"/>
      <Text>{chargeId}</Text>

      <Button onPress={_onCreateCustomer} title="Create customer"/>
      <Text>{customerId}</Text>
      <Button onPress={_addCard} title="Add a card"/>
      <Text>{paymentMethodId}</Text>
      <Button onPress={_attachCard} title="Attach card to customer"/>
      <Text>{attach}</Text>
      <Button onPress={_onPaymentIntentCustomer} title="Use Payment Intent customer"/>
      <Text>{paymentIntentCustomerId}</Text>
      <Button onPress={_onProcessPaymentCustomer} title="Process payment Intent customer"/>
      <Text>{processPayment}</Text>

    </ScrollView>
  );
}
