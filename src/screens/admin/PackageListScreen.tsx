import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

// TODO: Zbudować właściwy ekran (z listą i filtrowaniem)
const PackageListScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text variant="headlineLarge">Lista Wszystkich Przesyłek</Text>
    <Text>Tu będzie lista i filtry dla admina.</Text>
  </View>
);

export default PackageListScreen;
