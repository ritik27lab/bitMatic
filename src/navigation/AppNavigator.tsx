import React, { useState, useEffect, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ColorSchemeName,
} from "react-native";

import { TransactionScreen } from "../screens/TransactionScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MainTransactionScreen } from "../screens/MainTransactionScreen";
import { BitcoinScreen } from "../screens/BitcoinScreen";


export const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  const initialRoute =
    "HomeScreen";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animation: "slide_from_left",
      }}
      initialRouteName={initialRoute}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
        <Stack.Screen name="MainTransactionScreen" component={MainTransactionScreen} />
        <Stack.Screen name="BitcoinScreen" component={BitcoinScreen} />
    </Stack.Navigator>
  );
};

export default function AppNavigator({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return <StackNavigator />;
}
