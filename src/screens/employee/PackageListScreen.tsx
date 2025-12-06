import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Chip, Divider, Searchbar, useTheme, Text } from "react-native-paper";
import { Package } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import PackageListItem from "../../components/PackageListItem";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_PACKAGES: Package[] = [
  {
    id: "1",
    trackingNumber: "DHL-12345",
    sender: "Amazon",
    recipient: { id: "1", fullName: "Ja (Pracownik)" },
    status: "registered",
    pickupPoint: "Recepcja A",
    createdAt: "2023-11-20",
  },
];

const PackageListScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const renderItem = ({ item }: { item: Package }) => (
    <PackageListItem
      {...item}
      onPress={() =>
        navigation.navigate("PackageDetails", { packageData: item })
      }
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Moje Przesyłki
        </Text>
        <Searchbar
          placeholder="Szukaj..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.filters}>
          <Chip selected mode="outlined" style={{ marginRight: 8 }}>
            Do odbioru
          </Chip>
          <Chip mode="outlined">Historia</Chip>
        </View>
      </View>

      <FlatList
        data={MOCK_PACKAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { marginBottom: 15, fontWeight: "bold" },
  searchBar: { marginBottom: 10, backgroundColor: "white" },
  filters: { flexDirection: "row" },
});

export default PackageListScreen;
