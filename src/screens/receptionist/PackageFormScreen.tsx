import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  Text,
  ActivityIndicator,
  Searchbar,
  List,
  Divider,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { packageService } from "../../services/packageService";
import { userService, User } from "../../services/userService";
import { pickupPointService } from "../../services/pickupPointService";
import { Package } from "../../types";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

type Props = NativeStackScreenProps<RootStackParamList, "PackageForm">;

const PackageFormScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const scannedCode = route.params?.scannedCode || "";
  const packageData: Package | undefined = route.params?.packageData;
  const isUpdate = route.params?.isUpdate || false;

  const [trackingNumber, setTrackingNumber] = useState(
    scannedCode || packageData?.trackingNumber || ""
  );
  const [sender, setSender] = useState(packageData?.sender || "");
  const [recipientId, setRecipientId] = useState(
    packageData?.recipient?.id || ""
  );
  const [recipientName, setRecipientName] = useState(
    packageData?.recipient?.fullName || ""
  );
  const [pickupPoint, setPickupPoint] = useState(
    packageData?.pickupPoint || "Recepcja Główna"
  );
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserListExpanded, setIsUserListExpanded] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (scannedCode) setTrackingNumber(scannedCode);
  }, [scannedCode]);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do aparatu.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do lokalizacji.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const result = await pickupPointService.findNearest(latitude, longitude);

      if (result.found && result.point) {
        setPickupPoint(result.point.name);
        Alert.alert(
          "Lokalizacja wykryta",
          `Znajdujesz się w pobliżu: ${result.point.name}`
        );
      } else {
        const rawCoords = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setPickupPoint(rawCoords);
        Alert.alert(
          "Nieznana lokalizacja",
          "Nie wykryto zdefiniowanego punktu odbioru w pobliżu. Wstawiono współrzędne GPS."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Błąd",
        "Nie udało się pobrać lokalizacji lub połączyć z serwerem."
      );
    } finally {
      setIsLocating(false);
    }
  };

  const toggleUserList = async () => {
    if (!isUserListExpanded) {
      if (usersList.length === 0) {
        setIsLoadingUsers(true);
        setIsUserListExpanded(true);
        try {
          const users = await userService.getAllUsers();
          setUsersList(users);
        } catch (error) {
          Alert.alert("Błąd", "Nie udało się pobrać listy pracowników.");
          setIsUserListExpanded(false);
        } finally {
          setIsLoadingUsers(false);
        }
      } else {
        setIsUserListExpanded(true);
      }
    } else {
      setIsUserListExpanded(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setRecipientId(user.id);
    setRecipientName(user.fullName);
    setIsUserListExpanded(false);
    setSearchQuery("");
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!trackingNumber || !sender || !recipientId || !pickupPoint) {
      Alert.alert("Błąd", "Wypełnij wszystkie wymagane pola.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isUpdate && packageData) {
        await packageService.updatePackage(packageData.id, {
          trackingNumber,
          sender,
          recipientId,
          pickupPoint,
        });
        Alert.alert("Sukces", "Przesyłka zaktualizowana", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await packageService.registerPackage({
          trackingNumber,
          sender,
          recipientId,
          pickupPoint,
          photo: photoUri,
        });
        Alert.alert("Sukces", "Przesyłka zarejestrowana", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Wystąpił błąd.";
      Alert.alert("Błąd", Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text variant="headlineSmall" style={styles.header}>
            {isUpdate ? "Aktualizuj Przesyłkę" : "Rejestracja Przesyłki"}
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
                  navigation.navigate("ReceptionistApp", { screen: "Scan" })
                }
              />
            }
          />
          {scannedCode ? (
            <HelperText type="info" visible={true}>
              Kod wczytany ze skanera.
            </HelperText>
          ) : null}

          <TextInput
            label="Nadawca"
            value={sender}
            onChangeText={setSender}
            mode="outlined"
            style={styles.input}
          />

          <View>
            <TextInput
              label="Odbiorca"
              placeholder="Wybierz..."
              value={recipientName || recipientId}
              mode="outlined"
              style={styles.input}
              editable={false}
              right={
                <TextInput.Icon
                  icon={isUserListExpanded ? "chevron-up" : "account-search"}
                  onPress={toggleUserList}
                />
              }
            />
            {isUserListExpanded && (
              <View
                style={[
                  styles.inlineListContainer,
                  { borderColor: theme.colors.outline },
                ]}
              >
                <Searchbar
                  placeholder="Szukaj..."
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={styles.searchBar}
                  inputStyle={{ minHeight: 0 }}
                />
                {isLoadingUsers ? (
                  <ActivityIndicator animating={true} style={{ padding: 20 }} />
                ) : (
                  <ScrollView
                    style={{ maxHeight: 200 }}
                    nestedScrollEnabled={true}
                  >
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <List.Item
                          title={user.fullName}
                          description={user.email}
                          left={(props) => (
                            <List.Icon {...props} icon="account" />
                          )}
                          onPress={() => handleSelectUser(user)}
                          style={styles.listItem}
                        />
                        <Divider />
                      </React.Fragment>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              label="Punkt Odbioru"
              value={pickupPoint}
              onChangeText={setPickupPoint}
              mode="outlined"
              style={[styles.input, { flex: 1 }]}
            />
            <Button
              mode="outlined"
              icon="crosshairs-gps"
              loading={isLocating}
              onPress={handleGetLocation}
              style={{
                marginLeft: 10,
                marginTop: -10,
                height: 50,
                justifyContent: "center",
              }}
            >
              GPS
            </Button>
          </View>

          <Button
            icon="camera"
            mode="outlined"
            onPress={handleTakePhoto}
            style={styles.photoButton}
          >
            {photoUri ? "Zmień zdjęcie" : "Zrób zdjęcie paczki"}
          </Button>

          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.saveButton}
            contentStyle={{ height: 50 }}
          >
            {isUpdate ? "Zapisz Zmiany" : "Zarejestruj"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { marginBottom: 20, textAlign: "center", marginTop: 10 },
  form: { padding: 20 },
  input: { marginBottom: 12 },
  photoButton: {
    marginVertical: 10,
    borderColor: "#ccc",
    borderStyle: "dashed",
  },
  saveButton: { marginTop: 20 },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  inlineListContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: -5,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    height: 50,
  },
  listItem: { paddingLeft: 4 },
});

export default PackageFormScreen;
