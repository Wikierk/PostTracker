import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";

const DashboardScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Panel Recepcji
      </Text>

      <View style={styles.statsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              5
            </Text>
            <Text variant="bodyMedium">Do wydania</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              12
            </Text>
            <Text variant="bodyMedium">Dziś przyjęte</Text>
          </Card.Content>
        </Card>
      </View>

      <Text variant="titleMedium" style={styles.subtitle}>
        Operacje
      </Text>

      <Button
        mode="contained"
        icon="barcode-scan"
        style={styles.button}
        contentStyle={{ height: 60 }}
        // Nawigujemy do ReceptionistApp -> Scan
        onPress={() =>
          navigation.navigate("ReceptionistApp", { screen: "Scan" })
        }
      >
        Skanuj nową przesyłkę
      </Button>

      <Button
        mode="outlined"
        icon="pencil-plus"
        style={styles.button}
        contentStyle={{ height: 50 }}
        onPress={() => navigation.navigate("PackageForm")}
      >
        Rejestracja ręczna
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 20, marginTop: 10 },
  subtitle: { marginBottom: 10, marginTop: 20, fontWeight: "bold" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between" },
  card: { width: "48%", alignItems: "center", justifyContent: "center" },
  button: { marginTop: 10, justifyContent: "center" },
});

export default DashboardScreen;
