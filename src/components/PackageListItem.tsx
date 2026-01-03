import React from "react";
import { View, Text } from "react-native";
import { List, useTheme } from "react-native-paper";
import { Package } from "../types";
import { useAuth } from "../hooks/useAuth";

type PackageListItemProps = Package & {
  onPress?: () => void;
};

type StatusStyle = {
  color: string;
  label: string;
};

const PackageListItem = (props: PackageListItemProps) => {
  const { user } = useAuth();
  const theme = useTheme();

  const getDescription = () => {
    const recipientName = props.recipient?.fullName || "Nieznany";

    if (user.role === "employee") {
      return `Dotarła: ${props.createdAt} | ${props.trackingNumber}`;
    } else {
      return `Do: ${recipientName} | ${props.trackingNumber}`;
    }
  };

  const getStatusStyles = (): StatusStyle => {
    switch (props.status) {
      case "registered":
        return { color: "orange", label: "W RECEPCJI" };
      case "delivered":
        return { color: "green", label: "ODEBRANA" };
      case "problem":
        return { color: "red", label: "PROBLEM" };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <List.Item
      title={props.sender}
      description={getDescription()}
      left={() => (
        <View
          style={{
            width: 48,
            justifyContent: "center",
            alignItems: "center",
            marginRight: -12,
          }}
        >
          <List.Icon icon="package-variant" />
        </View>
      )}
      right={() => (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 1 }}
        >
          <Text
            style={{
              color: statusStyle.color,
              marginRight: 10,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {statusStyle.label}
          </Text>
          <List.Icon icon="chevron-right" />
        </View>
      )}
      onPress={props.onPress}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
};

export default PackageListItem;
