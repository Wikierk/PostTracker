import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Text,
  List,
  useTheme,
  Avatar,
  Divider,
  Switch,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

const SettingsScreen = () => {
  const { user, logout } = useAuth();

  const theme = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const getRoleName = () => {
    switch (user.role) {
      case "admin":
        return "Administrator";
      case "receptionist":
        return "Recepcja";
      case "employee":
        return "Pracownik";
      default:
        return "Użytkownik";
    }
  };

  const email = user.email || "brak-emaila@system.pl";
  const displayName = getRoleName();

  const handleLogout = () => {
    logout();
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text variant="headlineMedium" style={styles.header}>
          Ustawienia
        </Text>

        <Divider style={styles.divider} />

        <List.Item
          title={displayName}
          description={email}
          left={() => (
            <Avatar.Icon
              size={40}
              icon={user.role === "admin" ? "security" : "account"}
              style={{ backgroundColor: theme.colors.primary }}
            />
          )}
          style={[
            styles.profileItem,
            { backgroundColor: theme.colors.surface },
          ]}
        />

        <List.Section
          title="WYGLĄD I FUNKCJE"
          style={[
            styles.listSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <List.Item
            title="Ciemny motyw"
            description={isDarkTheme ? "Motyw: Ciemny" : "Motyw: Jasny"}
            left={() => (
              <List.Icon
                icon={
                  isDarkTheme ? "moon-waning-crescent" : "white-balance-sunny"
                }
              />
            )}
            right={() => (
              <Switch value={isDarkTheme} onValueChange={handleThemeToggle} />
            )}
            style={styles.listItem}
            onPress={handleThemeToggle}
          />
          <List.Item
            title="Powiadomienia"
            description="Zarządzaj alertami"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => console.log("Przejście do Powiadomień")}
          />
          <List.Item
            title="Wersja aplikacji"
            description="v1.0.0 (Beta)"
            left={() => <List.Icon icon="information-outline" />}
            style={styles.listItem}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
          contentStyle={{ height: 48 }}
        >
          Wyloguj się
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  divider: {
    marginVertical: 15,
  },
  profileItem: {
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 8,
  },
  listSection: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  listItem: {
    paddingHorizontal: 16,
  },
  logoutButton: {
    marginTop: 10,
    borderColor: "red",
    borderWidth: 1,
  },
});

export default SettingsScreen;
