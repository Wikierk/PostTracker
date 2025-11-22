import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Button, Card, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { PackageStatus } from "../../types";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCardProps from "../../components/PackageDetailsCard";
import { SafeAreaView } from "react-native-safe-area-context";

type PackageDetailsScrenProps = NativeStackScreenProps<
  RootStackParamList,
  "PackageDetails"
>;

const PackageDetailsScreen = (props: PackageDetailsScrenProps) => {
  const theme = useTheme();
  const { packageData } = props.route.params;
  const [status, setStatus] = useState<PackageStatus>(packageData.status);

  const handleOrder = () => {
    props.navigation.navigate("PackageOrder", { packageData: packageData });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <PackageStatusCard status={status} />

        {status !== "delivered" && (
          <Button
            mode="contained"
            icon="hand-coin"
            onPress={handleOrder}
            style={styles.mainButton}
            contentStyle={{ height: 50 }}
          >
            Odbierz przesyłkę
          </Button>
        )}
        <PackageDetailsCardProps package={packageData} />
      </ScrollView>
    </SafeAreaView>
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
