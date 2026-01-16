import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  Divider,
  FAB,
  IconButton,
  List,
  Searchbar,
  Text,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { userService, User } from "../../services/userService";

const UsersListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [users, setUsers] = useState<User[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (users.length === 0) setInitialLoading(true);
      fetchUsers();
    }, [fetchUsers])
  );

  const onPullToRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  const goToUserForm = (params: any) => {
    const parent = navigation.getParent?.();
    if (parent) parent.navigate("AdminUserForm", params);
    else navigation.navigate("AdminUserForm", params);
  };

  const openCreate = () => {
    goToUserForm({ mode: "create" });
  };

  const openEdit = (user: User) => {
    goToUserForm({ mode: "edit", user });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Searchbar
          placeholder="Szukaj po imieniu lub emailu..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {initialLoading && users.length === 0 ? (
        <ActivityIndicator
          animating
          style={{ marginTop: 50 }}
          color={theme.colors.primary}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onPullToRefresh}
            />
          }
          renderItem={({ item }) => (
            <List.Item
              title={item.fullName}
              description={`${item.email} • ${item.role}`}
              left={(props) => <List.Icon {...props} icon="account" />}
              right={() => (
                <IconButton
                  icon="pencil"
                  onPress={() => openEdit(item)}
                  accessibilityLabel="Edytuj użytkownika"
                />
              )}
              onPress={() => openEdit(item)}
              style={[
                styles.listItem,
                { backgroundColor: theme.colors.surface },
              ]}
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, opacity: 0.6 }}>
              {searchQuery ? "Brak wyników wyszukiwania" : "Brak użytkowników"}
            </Text>
          }
        />
      )}

      <FAB
        icon="plus"
        label="Dodaj"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={openCreate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 8 },
  searchBar: { marginBottom: 10, backgroundColor: "white" },
  listItem: { paddingHorizontal: 16 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default UsersListScreen;
