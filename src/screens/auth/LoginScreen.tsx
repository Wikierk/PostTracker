import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = () => {
  const [, setUser] = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        PostTracker
      </Text>
      <Button
        mode="contained"
        onPress={() => setUser({ loggedIn: true, role: "admin" })}
        style={{ marginBottom: 10, width: 200 }}
      >
        Zaloguj jako Admin
      </Button>
      <Button
        mode="outlined"
        onPress={() => setUser({ loggedIn: true, role: "employee" })}
        style={{ width: 200 }}
      >
        Zaloguj jako Pracownik
      </Button>
    </View>
  );
};

export default LoginScreen;
