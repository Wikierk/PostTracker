import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Chip, Divider, FAB, List, Searchbar, Text, useTheme } from "react-native-paper";
import { Package } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import PackageListItem from "../../components/PackageListItem";

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
    recipient: "Jan Kowalski",
    status: "delivered",
    pickupPoint: "Recepcja B",
    createdAt: "2023-11-19",
  }
];

const PackageListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const renderItem = ({ item }: { item: Package }) => (
    <PackageListItem {...item}/>
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
