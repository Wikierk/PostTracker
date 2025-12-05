import React from "react";
import { View, Text } from "react-native";
import { List, useTheme } from "react-native-paper";
import { Package } from "../types";
import { useAuth } from "../hooks/useAuth";

type PackageListItemProps = Package & {
  onPress?: () => void;
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
              color: props.status === "delivered" ? "green" : "orange",
              marginRight: 10,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {props.status === "delivered" ? "ODEBRANA" : "W RECEPCJI"}
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
