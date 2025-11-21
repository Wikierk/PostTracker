import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Text,
  Button,
  Card,
  Chip,
  Divider,
  useTheme,
  Menu,
  IconButton,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Package } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const PackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;

  const [status, setStatus] = useState(packageData.status);

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

  const getStatusColor = (s: string) => {
    switch (s) {
      case "delivered":
        return "green";
      case "registered":
        return "orange";
      default:
        return "grey";
    }
  };

  const getStatusLabel = (s: string) => {
    return s === "delivered" ? "ODEBRANA" : "W RECEPCJI";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.statusHeader}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.secondary }}
            >
              Status przesyłki
            </Text>
            <Text
              variant="headlineMedium"
              style={{ color: getStatusColor(status), fontWeight: "bold" }}
            >
              {getStatusLabel(status)}
            </Text>
          </View>
          <Icon
            name={status === "delivered" ? "check-circle" : "clock-outline"}
            size={40}
            color={getStatusColor(status)}
          />
        </Card.Content>
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

      <Card style={styles.card}>
        <Card.Title title="Informacje o przesyłce" />
        <Divider />
        <Card.Content style={styles.detailsContent}>
          <DetailRow
            label="Numer przesyłki"
            value={packageData.trackingNumber}
          />
          <DetailRow label="Nadawca" value={packageData.sender} />
          <DetailRow
            label="Odbiorca"
            value={packageData.recipient}
            icon="account"
          />
          <DetailRow
            label="Punkt odbioru"
            value={packageData.pickupPoint}
            icon="map-marker"
          />
          <DetailRow
            label="Data przyjęcia"
            value={packageData.createdAt}
            icon="calendar"
          />
        </Card.Content>
      </Card>

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

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) => (
  <View style={styles.row}>
    <View>
      <Text variant="labelMedium" style={{ color: "#666" }}>
        {label}
      </Text>
      <Text variant="bodyLarge">{value}</Text>
    </View>
    {icon && <IconButton icon={icon} size={20} />}
  </View>
);

import { MaterialCommunityIcons as IconComponent } from "@expo/vector-icons";
const Icon = (props: any) => <IconComponent {...props} />;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainButton: { marginBottom: 20 },
  detailsContent: { paddingTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionHeader: { marginBottom: 10, marginLeft: 5, opacity: 0.7 },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  actionButton: { width: "48%" },
});

export default PackageDetailsScreen;
