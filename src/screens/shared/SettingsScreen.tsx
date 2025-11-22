import React from "react";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: Zbudować właściwy ekran
const SettingsScreen = () => {
  const [, setUser] = useAuth();

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      edges={["top", "left", "right"]}
    >
      <Text variant="headlineLarge">Ustawienia</Text>
      <Text>Tu będzie profil użytkownika itp.</Text>
      <Button
        mode="contained"
        onPress={() => setUser({ loggedIn: false, role: null })}
        style={{ marginTop: 20 }}
      >
        Wyloguj
      </Button>
    </SafeAreaView>
  );
};

export default SettingsScreen;
