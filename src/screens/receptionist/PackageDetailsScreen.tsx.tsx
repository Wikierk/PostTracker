import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Package, PackageStatus } from "../../types";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCard from "../../components/PackageDetailsCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { packageService } from "../../services/packageService";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const PackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;
  const [status, setStatus] = useState<PackageStatus>(packageData.status);
  const [packageFromApi, setPackageFromApi] = useState<Package>(packageData);

  useFocusEffect(() => {
    packageService.getPackageById(packageData.id).then(setPackageFromApi);
  });

  const handleDeliver = () => {
    Alert.alert(
      "Wydanie przesyłki",
      `Czy potwierdzasz wydanie przesyłki do: ${
        packageData.recipient?.fullName || "Nieznany"
      }?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Potwierdź wydanie",
          onPress: async () => {
            try {
              await packageService.deliverPackage(packageData.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Błąd", "Nie udało się potwierdzić odbioru paczki.");
            } finally {
              setStatus("delivered");
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Usuń przesyłkę",
      "Czy na pewno chcesz trwale usunąć tą paczkę?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            try {
              await packageService.deletePackage(packageData.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Błąd", "Nie udało się usunąć przesyłki.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PackageStatusCard status={status} />
        {status !== "delivered" && (
          <Button
            mode="contained"
            icon="hand-coin"
            onPress={handleDeliver}
            style={styles.mainButton}
            contentStyle={{ height: 50 }}
          >
            Wydaj Przesyłkę
          </Button>
        )}
        <PackageDetailsCard package={packageFromApi} />
        <View style={styles.adminActions}>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() =>
              navigation.navigate("PackageForm", {
                packageData,
                isUpdate: true,
              })
            }
            style={styles.actionButton}
          >
            Edytuj dane
          </Button>
          <Button
            mode="outlined"
            icon="delete"
            textColor={theme.colors.error}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            onPress={handleDelete}
          >
            Usuń rekord
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  mainButton: { marginBottom: 20 },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  actionButton: { width: "48%" },
});

export default PackageDetailsScreen;
