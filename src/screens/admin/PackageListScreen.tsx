import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  List,
  FAB,
  Searchbar,
  Chip,
  useTheme,
  Text,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Package } from "../../types";

const MOCK_PACKAGES: Package[] = [
  {
    id: "1",
    trackingNumber: "DHL-12345",
    sender: "Amazon",
    recipient: "Jan Kowalski",
    status: "registered",
    pickupPoint: "Recepcja A",
    createdAt: "2023-11-20",
  },
  {
    id: "2",
    trackingNumber: "UPS-99999",
    sender: "Zalando",
    recipient: "Anna Nowak",
    status: "delivered",
    pickupPoint: "Recepcja B",
    createdAt: "2023-11-19",
  },
  {
    id: "3",
    trackingNumber: "INPOST-555",
    sender: "Allegro",
    recipient: "Piotr Wiśniewski",
    status: "registered",
    pickupPoint: "Recepcja A",
    createdAt: "2023-11-21",
  },
  {
    id: "4",
    trackingNumber: "FEDEX-001",
    sender: "Apple",
    recipient: "Marek Zegarek",
    status: "registered",
    pickupPoint: "Recepcja A",
    createdAt: "2023-11-21",
  },
];

const PackageListScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const renderItem = ({ item }: { item: Package }) => (
    <List.Item
      title={item.sender}
      description={`Do: ${item.recipient} | ${item.trackingNumber}`}
      left={(props) => <List.Icon {...props} icon="package-variant" />}
      right={(props) => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: item.status === "delivered" ? "green" : "orange",
              marginRight: 10,
              fontSize: 12,
            }}
          >
            {item.status === "delivered" ? "ODEBRANA" : "W RECEPCJI"}
          </Text>
          <List.Icon {...props} icon="chevron-right" />
        </View>
      )}
      onPress={() =>
        navigation.navigate("PackageDetails", { packageData: item })
      }
      style={{ backgroundColor: theme.colors.surface }}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Searchbar
          placeholder="Szukaj..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.filters}>
          <Chip selected mode="outlined" style={{ marginRight: 8 }}>
            Wszystkie
          </Chip>
          <Chip mode="outlined">Do odbioru</Chip>
        </View>
      </View>

      <FlatList
        data={MOCK_PACKAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <FAB
        icon="plus"
        label="Dodaj"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() => navigation.navigate("PackageForm")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  searchBar: { marginBottom: 10, backgroundColor: "white" },
  filters: { flexDirection: "row" },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PackageListScreen;
