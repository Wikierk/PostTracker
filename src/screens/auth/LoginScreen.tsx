import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationType = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationType>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uwaga", "Proszę wypełnić wszystkie pola.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      let title = "Błąd logowania";
      let message = "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Nieprawidłowe dane. Sprawdź format adresu email.";
            break;
          case 401:
            message = "Nieprawidłowy adres email lub hasło.";
            break;
          case 403:
            message = "Konto zablokowane lub brak uprawnień.";
            break;
          case 404:
            message =
              "Nie można połączyć się z serwerem (404). Sprawdź konfigurację IP.";
            break;
          case 500:
            message = "Błąd wewnętrzny serwera. Przepraszamy za utrudnienia.";
            break;
          default:
            message = `Błąd serwera (Kod: ${error.response.status}).`;
        }
      } else if (error.request) {
        title = "Problem z połączeniem";
        message =
          "Brak odpowiedzi z serwera. Sprawdź połączenie internetowe lub konfigurację IP API.";
      } else {
        message = error.message || message;
      }

      Alert.alert(title, message);
    } finally {
      setLoading(false);
    }
  };

  // const handleRegister = () => {
  //   navigation.navigate("Register");
  // };

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={styles.container}
    >
      <Text variant="headlineMedium" style={styles.header}>
        PostTracker
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        disabled={loading}
      />

      <TextInput
        label="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        loading={loading}
        disabled={loading}
        contentStyle={{ height: 48 }}
      >
        Zaloguj się
      </Button>

      {/* <Button
        mode="text"
        onPress={handleRegister}
        style={styles.registerButton}
        disabled={loading}
      >
        Nie masz konta? Zarejestruj się
      </Button> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 40,
    fontWeight: "bold",
    color: "rgb(0, 104, 116)",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 12,
  },
  loginButton: {
    width: "100%",
    maxWidth: 300,
    marginTop: 10,
    justifyContent: "center",
  },
  registerButton: {
    marginTop: 20,
  },
});

export default LoginScreen;
