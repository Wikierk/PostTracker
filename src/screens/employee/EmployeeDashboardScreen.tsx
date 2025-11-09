import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

// TODO: Zbudować właściwy ekran (lista "Moje Przesyłki")
const EmployeeDashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text variant="headlineLarge">Moje Przesyłki</Text>
    <Text>Tu będzie lista paczek tylko dla mnie.</Text>
  </View>
);

export default EmployeeDashboardScreen;
