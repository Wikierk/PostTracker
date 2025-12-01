import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../types/navigation"; 

type NavigationType = NativeStackNavigationProp<RootStackParamList, "Login">; 

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation<NavigationType>();

  const handleRegister = () => {
    navigation.navigate("Login"); 
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Rejestracja
      </Text>

      <TextInput
        label="Imię"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        label="Nazwisko"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Potwierdź hasło"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.registerButton}
      >
        Zarejestruj się
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")} 
        style={styles.loginRedirectButton}
      >
        Masz już konto? Zaloguj się
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
    marginBottom: 30,
  },
  input: {
    width: 250,
    marginBottom: 12,
  },
  registerButton: {
    width: 250,
    marginBottom: 20,
  },
  loginRedirectButton: {
    width: 250,
  },
});

export default RegisterScreen;
