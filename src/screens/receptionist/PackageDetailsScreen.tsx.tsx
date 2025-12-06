import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { PackageStatus } from "../../types";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCard from "../../components/PackageDetailsCard";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const PackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;
  const [status, setStatus] = useState<PackageStatus>(packageData.status);

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
          onPress: () => {
            setStatus("delivered");
            console.log("Recepcjonista wydał paczkę ID:", packageData.id);
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

        {/* Przycisk akcji widoczny tylko gdy paczka nie jest wydana */}
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

        <PackageDetailsCard package={packageData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  mainButton: { marginBottom: 20 },
});

export default PackageDetailsScreen;
