import React from "react";
import { View, ScrollView, StyleSheet, Alert, Share } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme,
  IconButton,
  Divider,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type PackageOrderScreenProps = NativeStackScreenProps<RootStackParamList, "PackageOrder">;

const PackageOrderScreen = (props: PackageOrderScreenProps) => {
  const theme = useTheme();
  const { packageData } = props.route.params;
  const pickupCode = "530629";
  
  const handleCopyCode = async () => {
    try {
      await Share.share({
        message: pickupCode,
        title: 'Kod odbioru przesyłki',
      });
    } catch (error: any) {
      Alert.alert("Błąd", "Nie udało się skopiować kodu.");
    }
  };

  const handleConfirmPickup = () => {
    Alert.alert(
      "Potwierdź odbiór",
      `Czy na pewno chcesz potwierdzić wydanie przesyłki od ${packageData.sender}?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Potwierdź",
          onPress: () => {
            props.navigation.goBack(); 
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.readyCard}>
        <Card.Content style={styles.statusHeader}>
          <View>
            <Text variant="headlineMedium" style={styles.readyText}>
              GOTOWA DO ODBIORU
            </Text>
          </View>
          <IconButton icon="package-variant-closed" size={40} iconColor={theme.colors.primary} />
        </Card.Content>
      </Card>
      <Card style={styles.pickupCodeCard}>
        <Card.Title 
          title="KOD ODBIORU" 
          titleStyle={styles.pickupCodeTitle} 
        />
        <Card.Content style={styles.pickupCodeContent}>
          <Text variant="displayMedium" style={styles.pickupCodeText}>
            {pickupCode}
          </Text>
          <Button
            mode="contained"
            icon="content-copy"
            onPress={handleCopyCode}
            style={styles.copyButton}
            labelStyle={styles.copyButtonLabel}
          >
            Kopiuj Kod
          </Button>
        </Card.Content>
      </Card>
      <Card style={styles.infoCard}>
        <Card.Title title="Szczegóły" titleStyle={{ marginBottom: -10 }}/>
        <Card.Content>
          <DetailRow label="Nadawca" value={packageData.sender} />
          <Divider style={styles.divider}/>
          <DetailRow label="Punkt odbioru" value={packageData.pickupPoint} icon="map-marker" />
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        icon="check-circle"
        onPress={handleConfirmPickup}
        style={styles.confirmButton}
        labelStyle={styles.confirmButtonLabel}
      >
        Potwierdź odbiór
      </Button>

    </ScrollView>
  );
};

type DetailRowProps = {
  label: string;
  value: string;
  icon?: string;
}

const DetailRow = (props: DetailRowProps) => (
  <View style={styles.detailRow}>
    <View style={{ flex: 1 }}>
      <Text variant="labelMedium" style={{ color: "#666" }}>
        {props.label}
      </Text>
      <Text variant="bodyLarge">{props.value}</Text>
    </View>
    {props.icon && <IconButton icon={props.icon} size={20} />}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  readyCard: { 
    marginBottom: 16, 
    backgroundColor: '#d4edda',
    borderRadius: 10,
  },
  readyText: {
    color: '#155724',
    fontWeight: 'bold',
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  pickupCodeCard: {
    marginBottom: 16,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 10,
  },
  pickupCodeTitle: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pickupCodeContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pickupCodeText: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 52,
    letterSpacing: 3,
    color: '#333',
  },
  copyButton: {
    width: '80%',
    borderRadius: 8,
    backgroundColor: '#0770e1ff', 
  },
  copyButtonLabel: {
    fontSize: 16,
  },
  infoCard: {
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  divider: {
    marginVertical: 10,
    marginHorizontal: -5,
  },
  confirmButton: {
    marginHorizontal: 16,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  confirmButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PackageOrderScreen;