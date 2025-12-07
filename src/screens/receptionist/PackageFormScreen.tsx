import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  Text,
  List,
  ActivityIndicator,
  Divider,
  Searchbar,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { packageService } from "../../services/packageService";
import { userService, User } from "../../services/userService";

type Props = NativeStackScreenProps<RootStackParamList, "PackageForm">;

const PackageFormScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const scannedCode = route.params?.scannedCode || "";

  const [trackingNumber, setTrackingNumber] = useState(scannedCode);
  const [sender, setSender] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [pickupPoint, setPickupPoint] = useState("Recepcja Główna");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserListExpanded, setIsUserListExpanded] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (scannedCode) {
      setTrackingNumber(scannedCode);
    }
  }, [scannedCode]);

  const toggleUserList = async () => {
    if (!isUserListExpanded) {
      if (usersList.length === 0) {
        setIsLoadingUsers(true);
        setIsUserListExpanded(true);
        try {
          const users = await userService.getAllUsers();
          setUsersList(users);
        } catch (error) {
          console.error(error);
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

  const handleSave = async () => {
    if (!trackingNumber || !sender || !recipientId || !pickupPoint) {
      Alert.alert("Błąd", "Wypełnij wszystkie wymagane pola.");
      return;
    }

    setIsSubmitting(true);
    try {
      await packageService.registerPackage({
        trackingNumber,
        sender,
        recipientId,
        pickupPoint,
        // photoUrl:
      });

      Alert.alert("Sukces", "Przesyłka zarejestrowana", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Wystąpił błąd podczas zapisu.";
      Alert.alert("Błąd", msg);
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
            Rejestracja Przesyłki
          </Text>
          <TextInput
            label="Numer przesyłki / Kod"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="barcode-scan" onPress={() => {}} />}
          />
          <TextInput
            label="Nadawca (Firma/Osoba)"
            value={sender}
            onChangeText={setSender}
            mode="outlined"
            style={styles.input}
          />
          <View>
            <TextInput
              label="Odbiorca (Pracownik)"
              placeholder="Wybierz z listy..."
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
                  placeholder="Szukaj pracownika..."
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
                          description={`${user.email} (${user.role})`}
                          left={(props) => (
                            <List.Icon {...props} icon="account" />
                          )}
                          onPress={() => handleSelectUser(user)}
                          style={styles.listItem}
                        />
                        <Divider />
                      </React.Fragment>
                    ))}
                    {filteredUsers.length === 0 && (
                      <Text
                        style={{
                          padding: 15,
                          textAlign: "center",
                          opacity: 0.5,
                        }}
                      >
                        Brak wyników
                      </Text>
                    )}
                  </ScrollView>
                )}
              </View>
            )}
          </View>
          <TextInput
            label="Punkt Odbioru"
            value={pickupPoint}
            onChangeText={setPickupPoint}
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.saveButton}
          >
            Zarejestruj Paczkę
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
  saveButton: { marginTop: 24, paddingVertical: 6 },
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
  listItem: {
    paddingLeft: 4,
  },
});

export default PackageFormScreen;
