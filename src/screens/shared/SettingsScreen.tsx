import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

// TODO: Zbudować właściwy ekran
const SettingsScreen = () => {
  const [, setUser] = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineLarge">Ustawienia</Text>
      <Text>Tu będzie profil użytkownika itp.</Text>
      <Button
        mode="contained"
        onPress={() => setUser({ loggedIn: false, role: null })}
        style={{ marginTop: 20 }}
      >
        Wyloguj
      </Button>
    </View>
  );
};

export default SettingsScreen;
