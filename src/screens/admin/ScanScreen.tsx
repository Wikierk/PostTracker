import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

// TODO: Zbudować właściwy ekran (z expo-camera)
const ScanScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text variant="headlineLarge">Ekran Skanowania</Text>
    <Text>Tu będzie widok kamery (expo-camera).</Text>
  </View>
);

export default ScanScreen;
