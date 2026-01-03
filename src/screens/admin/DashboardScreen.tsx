import React, { useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Card, Text, Button, useTheme, Avatar } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminStats, packageService } from "../../services/packageService";

const AdminDashboardScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          const data = await packageService.getAdminStats();
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
        Panel Administratora
      </Text>

      <View style={styles.statsRow}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {loading || stats == null ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Avatar.Icon
                  size={48}
                  icon="account-group"
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                  color={theme.colors.onSecondaryContainer}
                />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {stats.employeesCount}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Pracowników
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {loading || stats == null ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Avatar.Icon
                  size={48}
                  icon="package-variant"
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                  color={theme.colors.onSecondaryContainer}
                />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {stats.packagesThisMonth}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Paczki (Msc)
                </Text>
              </>
            )}
          </Card.Content>
        </Card>
      </View>

      <Text variant="titleMedium" style={styles.subtitle}>
        Zarządzanie Systemem
      </Text>

      <Button
        mode="contained"
        icon="account-multiple-plus"
        style={styles.button}
        contentStyle={{ height: 55 }}
        onPress={() => console.log("Nawigacja do zarządzania użytkownikami")}
      >
        Zarządzaj Użytkownikami
      </Button>

      <Button
        mode="outlined"
        icon="package-variant-closed"
        style={styles.button}
        contentStyle={{ height: 55 }}
        onPress={() =>
          navigation.navigate("AdminApp", { screen: "PackagesList" })
        }
      >
        Przeglądaj Wszystkie Paczki
      </Button>

      <Button
        mode="outlined"
        icon="file-chart"
        style={styles.button}
        contentStyle={{ height: 55 }}
        onPress={() => console.log("Generowanie raportów")}
      >
        Generuj Raporty
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    marginTop: 10,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 15,
    marginTop: 30,
    fontWeight: "bold",
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  statNumber: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 24,
  },
  statLabel: {
    opacity: 0.7,
  },
  button: {
    marginTop: 12,
    justifyContent: "center",
    borderRadius: 8,
  },
});

export default AdminDashboardScreen;
