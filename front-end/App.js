import React from 'react';
import { View, Button } from 'react-native';
import StripeConnector from './lib/stripe';

export default function App() {

  _onPress = () => {
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
      last_name: "Maxime",
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
      var id_one = res[0].id //account id one
      var id_two =  res[1].id //account id two
      console.log(id_one, id_two)
    }).catch((err) => {
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={_onPress} title="Pay"/>
    </View>
  );
}
