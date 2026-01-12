import React, { useState, useCallback } from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import {
  Chip,
  Divider,
  Searchbar,
  useTheme,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Package } from "../../types";
import { RootStackParamList } from "../../types/navigation";
import PackageListItem from "../../components/PackageListItem";
import { packageService } from "../../services/packageService";
import { useAuth } from "../../hooks/useAuth";

const PackageListScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user } = useAuth();

  const [packages, setPackages] = useState<Package[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"registered" | "delivered">(
    "registered"
  );

  const fetchPackages = useCallback(async () => {
    try {
      const data = await packageService.getAllPackages(searchQuery);

      const userId = (user as any)?.id; 
      const mine = userId
        ? data.filter((pkg) => pkg.recipient?.id === userId)
        : data; 

      const filtered = mine.filter((pkg) => {
        if (filterStatus === "registered") {
          return pkg.status === "registered" || pkg.status === "problem";
        }
        return pkg.status === "delivered";
      });

      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPackages(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, filterStatus, user]);

  useFocusEffect(
    useCallback(() => {
      if (packages.length === 0) setInitialLoading(true);
      fetchPackages();
    }, [fetchPackages])
  );

  const onPullToRefresh = () => {
    setRefreshing(true);
    fetchPackages();
  };

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
            Do odbioru
          </Chip>

          <Chip
            selected={filterStatus === "delivered"}
            mode="outlined"
            onPress={() => setFilterStatus("delivered")}
            showSelectedOverlay
          >
            Historia (Odebrane)
          </Chip>
        </View>
      </View>

      {initialLoading && packages.length === 0 ? (
        <ActivityIndicator
          animating
          style={{ marginTop: 50 }}
          color={theme.colors.primary}
        />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onPullToRefresh}
            />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, opacity: 0.6 }}>
              {searchQuery
                ? "Brak wyników wyszukiwania"
                : filterStatus === "registered"
                ? "Nie masz przesyłek do odbioru"
                : "Brak przesyłek w historii"}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { marginBottom: 15, fontWeight: "bold", marginLeft: 5 },
  searchBar: { marginBottom: 10, backgroundColor: "white" },
  filters: { flexDirection: "row" },
});

export default PackageListScreen;
