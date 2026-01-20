import React, { useState, useCallback } from "react";
import { FlatList, View, StyleSheet, Alert } from "react-native";
import {
  List,
  FAB,
  Divider,
  ActivityIndicator,
  IconButton,
  useTheme,
  Text,
} from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import {
  PickupPoint,
  pickupPointService,
} from "../../services/pickupPointService";
import { SafeAreaView } from "react-native-safe-area-context";

const PickupPointsListScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoints = async () => {
    setLoading(true);
    try {
      const data = await pickupPointService.getAll();
      setPoints(data);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się pobrać listy punktów.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPoints();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert("Usuń punkt", "Czy na pewno chcesz usunąć ten punkt odbioru?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          try {
            await pickupPointService.delete(id);
            fetchPoints();
          } catch (error) {
            Alert.alert("Błąd", "Nie udało się usunąć punktu.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: PickupPoint }) => (
    <List.Item
      title={item.name}
      description={`Lat: ${item.latitude}, Lon: ${item.longitude}`}
      left={(props) => <List.Icon {...props} icon="map-marker" />}
      right={(props) => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() =>
              navigation.navigate("AdminPickupPointForm", {
                mode: "edit",
                point: item,
              })
            }
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={theme.colors.error}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      )}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
          Punkty Odbioru
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator animating={true} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={points}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, opacity: 0.5 }}>
              Brak zdefiniowanych punktów
            </Text>
          }
        />
      )}

      <FAB
        icon="plus"
        label="Dodaj Punkt"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() =>
          navigation.navigate("AdminPickupPointForm", { mode: "create" })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 10 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
});

export default PickupPointsListScreen;
