import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

const ScanScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Brak dostępu do kamery. Wymagany do skanowania przesyłek.
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Przyznaj dostęp
        </Button>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    navigation.navigate("PackageForm", { scannedCode: data });

    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128", "code39"],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.scanText}>Nakieruj kamerę na kod paczki</Text>
        </View>
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.cutout} />
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          {scanned && <Text style={styles.scanText}>Wczytano!</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center" },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  middleRow: { flexDirection: "row", height: 250 },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingTop: 20,
  },
  sideOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  cutout: {
    width: 250,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  scanText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ScanScreen;
