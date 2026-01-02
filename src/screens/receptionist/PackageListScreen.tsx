import React, { useState, useCallback } from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import {
  Chip,
  Divider,
  FAB,
  Searchbar,
  useTheme,
  ActivityIndicator,
  Text,
} from "react-native-paper";
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

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"registered" | "delivered">(
    "registered"
  );

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await packageService.getAllPackages(searchQuery);

      const filtered = data.filter((pkg) => {
        if (filterStatus === "registered") {
          return pkg.status === "registered" || pkg.status === "problem";
        } else {
          return pkg.status === "delivered";
        }
      });

      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPackages(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  useFocusEffect(
    useCallback(() => {
      fetchPackages();
    }, [fetchPackages])
  );

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
        <Searchbar
          placeholder="Szukaj nadawcy lub numeru..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          onSubmitEditing={fetchPackages}
          onIconPress={fetchPackages}
        />
        <View style={styles.filters}>
          <Chip
            selected={filterStatus === "registered"}
            mode="outlined"
            style={{ marginRight: 8 }}
            onPress={() => setFilterStatus("registered")}
            showSelectedOverlay
          >
            Do wydania
          </Chip>
          <Chip
            selected={filterStatus === "delivered"}
            mode="outlined"
            onPress={() => setFilterStatus("delivered")}
            showSelectedOverlay
          >
            Historia (Wydane)
          </Chip>
        </View>
      </View>

      {loading && packages.length === 0 ? (
        <ActivityIndicator
          animating={true}
          style={{ marginTop: 50 }}
          color={theme.colors.primary}
        />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchPackages} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, opacity: 0.6 }}>
              {searchQuery
                ? "Brak wyników wyszukiwania"
                : "Brak przesyłek w tej kategorii"}
            </Text>
          }
        />
      )}

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
