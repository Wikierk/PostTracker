import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  Button,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  packageService,
  ReceptionistStats,
} from "../../services/packageService";

const DashboardScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [stats, setStats] = useState<ReceptionistStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          const data = await packageService.getReceptionistStats();
          setStats(data);
        } catch (e) {
          console.error("Błąd pobierania statystyk:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }, [])
  );

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
          <Card.Content style={{ alignItems: "center" }}>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text
                variant="displayMedium"
                style={{ color: theme.colors.primary, fontWeight: "bold" }}
              >
                {stats?.toDeliver || 0}
              </Text>
            )}
            <Text variant="bodyMedium">Do wydania</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: "center" }}>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text
                variant="displayMedium"
                style={{ color: theme.colors.primary, fontWeight: "bold" }}
              >
                {stats?.receivedToday || 0}
              </Text>
            )}
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
      <Button
        mode="outlined"
        icon="alert-circle-outline"
        style={[styles.button, { borderColor: theme.colors.error }]}
        textColor={theme.colors.error}
        contentStyle={{ height: 50 }}
        onPress={() => navigation.navigate("ReceptionistProblems")}
      >
        Zgłoszone Problemy
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 20, marginTop: 10 },
  subtitle: { marginBottom: 10, marginTop: 20, fontWeight: "bold" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between" },
  card: { width: "48%", justifyContent: "center" },
  button: { marginTop: 10, justifyContent: "center" },
});

export default DashboardScreen;
