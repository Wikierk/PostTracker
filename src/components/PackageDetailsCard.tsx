import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Divider, IconButton } from "react-native-paper";
import { Package } from "../types";

type PackageDetailsCardProps = {
  package: Package;
};

const PackageDetailsCard = (props: PackageDetailsCardProps) => {
  const recipientName = props.package.recipient?.fullName || "Brak danych";
  return (
    <Card style={styles.card}>
      <Card.Title title="Informacje o przesyłce" />
      <Divider />
      <Card.Content style={styles.detailsContent}>
        <DetailRow
          label="Numer przesyłki"
          value={props.package.trackingNumber}
        />
        <DetailRow label="Nadawca" value={props.package.sender} />
        <DetailRow label="Odbiorca" value={recipientName} icon="account" />
        <DetailRow
          label="Punkt odbioru"
          value={props.package.pickupPoint}
          icon="map-marker"
        />
        <DetailRow
          label="Data przyjęcia"
          value={props.package.createdAt}
          icon="calendar"
        />
      </Card.Content>
    </Card>
  );
};

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) => (
  <View style={styles.row}>
    <View>
      <Text variant="labelMedium" style={{ color: "#666" }}>
        {label}
      </Text>
      <Text variant="bodyLarge">{value}</Text>
    </View>
    {icon && <IconButton icon={icon} size={20} />}
  </View>
);

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  detailsContent: { paddingTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
});

export default PackageDetailsCard;
