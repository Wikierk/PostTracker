import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { PackageStatus } from "../../types";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCardProps from "../../components/PackageDetailsCard";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const PackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;

  const [status, setStatus] = useState<PackageStatus>(packageData.status);

  const handleDeliver = () => {
    Alert.alert(
      "Wydanie przesyłki",
      `Czy na pewno chcesz wydać przesyłkę do: ${packageData.recipient}?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Wydaj",
          onPress: () => {
            setStatus("delivered");
            console.log(
              "Zmieniono status na delivered dla ID:",
              packageData.id
            );
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Usuń przesyłkę",
      "Czy na pewno chcesz usunąć tę przesyłkę z systemu? Operacji nie można cofnąć.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => {
            console.log("Usunięto ID:", packageData.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.card}>
        <PackageStatusCard status={status}/>
      </Card>

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
      <PackageDetailsCardProps package={packageData}/>
      <Text variant="titleMedium" style={styles.sectionHeader}>
        Zarządzanie
      </Text>
      <View style={styles.adminActions}>
        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => console.log("Nawigacja do edycji")}
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
          Usuń przesyłkę
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  mainButton: { marginBottom: 20 },
  sectionHeader: { marginBottom: 10, marginLeft: 5, opacity: 0.7 },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  actionButton: { width: "48%" },
});

export default PackageDetailsScreen;
