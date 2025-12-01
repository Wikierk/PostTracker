import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import React from "react";
import { MaterialCommunityIcons as IconComponent } from "@expo/vector-icons";
import { PackageStatus } from "../types";

type PackageStatusCardProps = {
  status: PackageStatus;
}

const PackageStatusCard = (props: PackageStatusCardProps) => {
  const theme = useTheme();

  const getColor = (s: string) => {
    switch (s) {
      case "delivered":
        return "green";
      case "registered":
        return "orange";
      default:
        return "grey";
    }
  };

  const getLabel = (s: string) => {
    return s === "delivered" ? "ODEBRANA" : "W RECEPCJI";
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.statusHeader}>
        <View>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.secondary }}
          >
            Status przesyłki
          </Text>
          <Text
            variant="headlineMedium"
            style={{ color: getColor(props.status), fontWeight: "bold" }}
          >
            {getLabel(props.status)}
          </Text>
        </View>
        <IconComponent  
          name={props.status === "delivered" ? "check-circle" : "clock-outline"}
          size={40}
          color={getColor(props.status)}
        />
      </Card.Content>
    </Card>
  ) 
};

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PackageStatusCard;