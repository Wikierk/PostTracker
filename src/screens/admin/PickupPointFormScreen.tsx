import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, useTheme, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickupPointService } from "../../services/pickupPointService";
import * as Location from "expo-location";

type Props = NativeStackScreenProps<RootStackParamList, "AdminPickupPointForm">;

const PickupPointFormScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const { mode } = route.params;
  const point = mode === "edit" ? route.params.point : null;

  const [name, setName] = useState(point?.name || "");
  const [latitude, setLatitude] = useState(point?.latitude.toString() || "");
  const [longitude, setLongitude] = useState(point?.longitude.toString() || "");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleGetLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do lokalizacji.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się pobrać lokalizacji.");
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    if (!name || !latitude || !longitude) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert("Błąd", "Nazwa punktu musi mieć co najmniej 3 znaki.");
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      Alert.alert("Błąd", "Współrzędne muszą być liczbami.");
      return;
    }

    if (lat < -90 || lat > 90) {
      Alert.alert(
        "Błąd",
        "Szerokość geograficzna musi być w zakresie -90 do 90.",
      );
      return;
    }

    if (lon < -180 || lon > 180) {
      Alert.alert(
        "Błąd",
        "Długość geograficzna musi być w zakresie -180 do 180.",
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        latitude: lat,
        longitude: lon,
      };

      if (mode === "create") {
        await pickupPointService.create(payload);
        Alert.alert("Sukces", "Punkt dodany", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else if (point) {
        await pickupPointService.update(point.id, payload);
        Alert.alert("Sukces", "Punkt zaktualizowany", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Błąd", "Wystąpił problem podczas zapisywania.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.header}>
          {mode === "create" ? "Nowy Punkt Odbioru" : "Edytuj Punkt"}
        </Text>

        <TextInput
          label="Nazwa (np. Recepcja A)"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.row}>
          <TextInput
            label="Szerokość (Lat)"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
            mode="outlined"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            label="Długość (Lon)"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <Button
          mode="outlined"
          icon="crosshairs-gps"
          loading={locating}
          onPress={handleGetLocation}
          style={styles.gpsButton}
        >
          Pobierz moją lokalizację
        </Button>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
          contentStyle={{ height: 50 }}
        >
          Zapisz
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 20, textAlign: "center", marginTop: 10 },
  input: { marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  gpsButton: { marginBottom: 20, borderColor: "#ccc" },
  saveButton: { marginTop: 10 },
});

export default PickupPointFormScreen;
