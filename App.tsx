import React from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useThemeMode } from "./src/context/ThemeContext";
import {
  navigationDarkTheme,
  navigationLightTheme,
  paperDarkTheme,
  paperLightTheme,
} from "./src/theme/theme";

function AppShell() {
  const { mode } = useThemeMode();

  const paperTheme = mode === "dark" ? paperDarkTheme : paperLightTheme;
  const navigationTheme =
    mode === "dark" ? navigationDarkTheme : navigationLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
