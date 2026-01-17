import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { PackageStatus } from "../../types";
import PackageStatusCard from "../../components/PackageStatusCard";
import { SafeAreaView } from "react-native-safe-area-context";
import PackageDetailsCard from "../../components/PackageDetailsCard";

type PackageDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PackageDetails"
>;

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const PackageDetailsScreen = (props: PackageDetailsScreenProps) => {
  const theme = useTheme();
  const { packageData } = props.route.params;

  const [status] = useState<PackageStatus>(packageData.status);

  const handleOrder = () => {
    props.navigation.navigate("PackageOrder", { packageData: packageData });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {packageData.photoUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${API_URL}/${packageData.photoUrl}` }}
              style={styles.packageImage}
              resizeMode="cover"
            />
          </View>
        )}

        <PackageDetailsCard package={packageData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  mainButton: { marginBottom: 20 },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  packageImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default PackageDetailsScreen;
