import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Alert } from "react-native";
import { Chip, Divider, FAB, Searchbar, useTheme } from "react-native-paper";
import { Package } from "../../types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import PackageListItem from "../../components/PackageListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { packageService } from "../../services/packageService";

const PackageListScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);

  const renderItem = ({ item }: { item: Package }) => (
    <PackageListItem
      {...item}
      onPress={() =>
        navigation.navigate("PackageDetails", { packageData: item })
      }
    />
  );

  useFocusEffect(() => {
    packageService.getAllPackages().then((data) => {
      const formattedPackages = data.map((pkg: Package) => ({
        ...pkg,
        createdAt: pkg.createdAt.slice(0, 10),
      }));
      setPackages(formattedPackages);
    });
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
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
        data={packages}
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
    </SafeAreaView>
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
