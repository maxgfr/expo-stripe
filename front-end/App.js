import React from 'react';
import { View, Button } from 'react-native';
import StripeConnector from './lib/stripe';

export default function App() {

  _onPress = () => {
    let stripe = StripeConnector.getInstance();
    stripe.
    console.log('coucou')
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={_onPress} title="Pay"/>
    </View>
  );
}
