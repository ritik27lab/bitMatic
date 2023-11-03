import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import walletStore from './src/mobxStore/walletStore';

import {Provider} from 'mobx-react';

import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';



export default function App() {


  return (
    <Provider walletStore={walletStore}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator colorScheme={'light'} />
      </NavigationContainer>
    </Provider>
  );
}

export const navigationRef = createNavigationContainerRef();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
