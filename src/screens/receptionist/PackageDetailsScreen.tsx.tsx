import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Alert, Image } from "react-native";
import {
  Button,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  Text,
  Card,
  Avatar,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCard from "../../components/PackageDetailsCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { packageService } from "../../services/packageService";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ReceptionistPackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData: initialPackageData } = route.params;

  const [currentPackage, setCurrentPackage] = useState(initialPackageData);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [pickupCode, setPickupCode] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchPackageDetails = async () => {
        try {
          const updatedData = await packageService.getPackageById(
            initialPackageData.id,
          );

          if (isActive) {
            setCurrentPackage(updatedData);
          }
        } catch (error) {
          console.error("Błąd odświeżania danych:", error);
        }
      };

      fetchPackageDetails();

      return () => {
        isActive = false;
      };
    }, [initialPackageData.id]),
  );

  const showDialog = () => setIsDialogVisible(true);
  const hideDialog = () => {
    setIsDialogVisible(false);
    setPickupCode("");
  };

  const handleDeliver = async () => {
    if (pickupCode.length !== 6) {
      Alert.alert("Błąd", "Kod musi mieć 6 cyfr.");
      return;
    }

    setLoading(true);
    try {
      await packageService.deliverPackage(currentPackage.id, pickupCode);
      setCurrentPackage((prev) => ({ ...prev, status: "delivered" }));
      hideDialog();
      Alert.alert("Sukces", "Paczka została wydana pomyślnie.");
    } catch (error: any) {
      let msg = "Wystąpił błąd.";
      if (error.response?.data?.message) {
        msg = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
      }
      Alert.alert("Błąd", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveProblem = () => {
    const description =
      (currentPackage as any).problemDescription || "Brak opisu problemu.";

    Alert.alert(
      "Rozwiąż problem",
      `Zgłoszenie: "${description}"\n\nCzy problem został wyjaśniony? Paczka wróci do statusu 'W RECEPCJI' i będzie można ją ponownie wydać.`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Tak, rozwiąż",
          onPress: async () => {
            try {
              setLoading(true);
              await packageService.resolveProblem(currentPackage.id);
              setCurrentPackage((prev) => ({ ...prev, status: "registered" }));

              Alert.alert(
                "Sukces",
                "Zgłoszenie rozwiązane. Możesz teraz wydać paczkę.",
              );
            } catch (error: any) {
              let msg = "Wystąpił błąd.";
              if (error.response?.data?.message) {
                msg = Array.isArray(error.response.data.message)
                  ? error.response.data.message[0]
                  : error.response.data.message;
              }
              Alert.alert("Błąd", msg);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    navigation.navigate("PackageForm", {
      packageData: currentPackage,
      isUpdate: true,
    });
  };

  const status = currentPackage.status;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PackageStatusCard status={status} />

        {status === "problem" && (
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <Card.Title
              title="Zgłoszono Problem"
              titleStyle={{
                color: theme.colors.onErrorContainer,
                fontWeight: "bold",
              }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="alert"
                  style={{ backgroundColor: theme.colors.error }}
                />
              )}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onErrorContainer,
                  marginBottom: 10,
                }}
              >
                {(currentPackage as any).problemDescription ||
                  "Pracownik zgłosił problem z tą przesyłką."}
              </Text>
              <Button
                mode="contained"
                buttonColor={theme.colors.error}
                loading={loading}
                disabled={loading}
                onPress={handleResolveProblem}
              >
                Rozwiąż zgłoszenie
              </Button>
            </Card.Content>
          </Card>
        )}

        {status !== "delivered" && status !== "problem" && (
          <Button
            mode="contained"
            icon="hand-coin"
            onPress={showDialog}
            style={styles.mainButton}
            contentStyle={{ height: 50 }}
          >
            Wydaj Przesyłkę
          </Button>
        )}

        {currentPackage.photoUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${API_URL}/${currentPackage.photoUrl}` }}
              style={styles.packageImage}
              resizeMode="cover"
            />
          </View>
        )}

        <PackageDetailsCard package={currentPackage} />

        <Button
          mode="outlined"
          icon="pencil"
          onPress={handleEdit}
          style={styles.editButton}
        >
          Edytuj dane przesyłki
        </Button>
      </ScrollView>

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title>Weryfikacja Odbioru</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
              Poproś pracownika o kod odbioru (dostępny w jego aplikacji).
            </Text>
            <TextInput
              label="Kod Odbioru (6 cyfr)"
              value={pickupCode}
              onChangeText={setPickupCode}
              keyboardType="number-pad"
              maxLength={6}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Anuluj</Button>
            <Button
              onPress={handleDeliver}
              loading={loading}
              disabled={loading}
            >
              Potwierdź
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  mainButton: { marginBottom: 20 },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  packageImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  card: { marginBottom: 16 },
  editButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default ReceptionistPackageDetailsScreen;
