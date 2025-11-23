import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, List, useTheme, Avatar, Divider, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

const SettingsScreen = () => {
  const [userState, setUser] = useAuth();
  const theme = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
  const displayName = userState.role === 'admin' ? "Administrator" : 
                      userState.role === 'employee' ? "Pracownik" : "Użytkownik";
  const email = "userl@example.com"; 

  const handleLogout = () => {
    setUser({ loggedIn: false, role: null });
  };
  
  const handleThemeToggle = () => {
    setIsDarkTheme(prev => !prev);
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
                    icon={userState.role === 'admin' ? "security" : "account"} 
                    style={{ backgroundColor: theme.colors.primary }}
                />
            )}
            right={() => <List.Icon icon="chevron-right" />}
            style={[styles.profileItem, { backgroundColor: theme.colors.surface }]}
        />
        <List.Section title="WYGLĄD I FUNKCJE" style={styles.listSection}>
          <List.Item
            title="Ciemny motyw"
            description={isDarkTheme ? "Motyw: Ciemny" : "Motyw: Jasny"}
            left={() => <List.Icon icon={isDarkTheme ? "moon-waning-crescent" : "white-balance-sunny"} />}
            right={() => <Switch value={isDarkTheme} onValueChange={handleThemeToggle} />}
            style={styles.listItem}
            onPress={handleThemeToggle}
          />
          <List.Item
            title="Powiadomienia"
            description="Zarządzaj alertami i powiadomieniami"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => console.log('Przejście do Powiadomień')}
          />
          <List.Item
            title="Wersja aplikacji"
            description="v1.0.0 (Build 20251122)"
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
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  divider: {
    marginVertical: 15,
  },
  profileItem: {
    paddingHorizontal: 16, 
    borderRadius: 8,
    marginBottom: 10,
  },
  listSection: {
    backgroundColor: 'white', 
    borderRadius: 8,
    overflow: 'hidden', 
    marginBottom: 15,
  },
  listItem: {
      paddingHorizontal: 16,
  },
  logoutButton: {
    marginTop: 20,
    borderColor: 'red',
    borderWidth: 1,
    paddingVertical: 8,
  }
});

export default SettingsScreen;