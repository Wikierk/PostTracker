import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

// TODO: Zbudować właściwy ekran
const AdminDashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text variant="headlineLarge">Panel Admina</Text>
    <Text>Tu będą statystyki i szybkie akcje.</Text>
  </View>
);

export default AdminDashboardScreen;
