import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../types/navigation"; 

type NavigationType = NativeStackNavigationProp<RootStackParamList, "Register">;

const LoginScreen = () => {
  const [, setUser] = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NavigationType>(); 

  const handleLogin = () => {
    setUser({ loggedIn: true, role: "employee" });
  };

  const handleRegister = () => {
    navigation.navigate("Register"); 
  };


  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        PostTracker
      </Text>

      <TextInput label="Login" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput label="Hasło" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Zaloguj się
      </Button>

      <Button mode="outlined" onPress={handleRegister} style={styles.registerButton}>
        Zarejestruj się
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  input: {
    width: 250,
    marginBottom: 12,
  },
  loginButton: {
    width: 250,
    marginBottom: 20,
  },
  registerButton: {
    width: 250,
  },
});

export default LoginScreen;
