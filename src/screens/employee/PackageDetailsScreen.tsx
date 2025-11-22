import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  useTheme,
} from "react-native-paper";


const PackageDetailsScreen = () => {
  const theme = useTheme()
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text>
        To szczegoly paczki usera
      </Text>
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
