import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  Text,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "PackageForm">;

const PackageFormScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const scannedCode = route.params?.scannedCode || "";

  const [trackingNumber, setTrackingNumber] = useState(scannedCode);
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [pickupPoint, setPickupPoint] = useState("Recepcja Główna");

  useEffect(() => {
    if (scannedCode) {
      setTrackingNumber(scannedCode);
    }
  }, [scannedCode]);

  const handleSave = () => {
    console.log("Zapisuję przesyłkę:", {
      trackingNumber,
      sender,
      recipient,
      pickupPoint,
    });

    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.form}>
        <Text variant="headlineSmall" style={styles.header}>
          Nowa Przesyłka
        </Text>

        <TextInput
          label="Numer przesyłki / Kod"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              icon="barcode-scan"
              onPress={() =>
                navigation.navigate("AdminApp", { screen: "Scan" })
              }
            />
          }
        />

        {scannedCode ? (
          <HelperText type="info" visible={true}>
            Kod został wczytany automatycznie ze skanera.
          </HelperText>
        ) : null}

        <TextInput
          label="Nadawca (np. DHL, Amazon)"
          value={sender}
          onChangeText={setSender}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Adresat (Pracownik)"
          value={recipient}
          onChangeText={setRecipient}
          mode="outlined"
          style={styles.input}
          right={<TextInput.Icon icon="account-search" />}
        />

        <TextInput
          label="Punkt odbioru"
          value={pickupPoint}
          onChangeText={setPickupPoint}
          mode="outlined"
          style={styles.input}
        />

        <Button
          icon="camera"
          mode="outlined"
          onPress={() => console.log("Otwórz aparat do zdjęcia paczki")}
          style={styles.photoButton}
        >
          Dodaj zdjęcie paczki (Opcjonalne)
        </Button>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={{ height: 50 }}
        >
          Zarejestruj Przesyłkę
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginBottom: 20, textAlign: "center" },
  form: { padding: 20 },
  input: { marginBottom: 12 },
  photoButton: {
    marginVertical: 10,
    borderColor: "#ccc",
    borderStyle: "dashed",
  },
  saveButton: { marginTop: 20 },
});

export default PackageFormScreen;
