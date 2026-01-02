import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  List,
  Text,
  useTheme,
  Divider,
  ActivityIndicator,
  Avatar,
} from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Package } from "../../types";
import { packageService } from "../../services/packageService";
import { SafeAreaView } from "react-native-safe-area-context";

const ReceptionistProblemsScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [problems, setProblems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchProblems = async () => {
        try {
          const data = await packageService.getProblems();
          setProblems(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProblems();
    }, [])
  );

  const renderItem = ({ item }: { item: Package }) => (
    <List.Item
      title={`Problem: ${item.trackingNumber}`}
      description={`Od: ${item.sender} | Zgłosił: ${
        item.recipient?.fullName || "Pracownik"
      }`}
      left={(props) => (
        <Avatar.Icon
          {...props}
          icon="alert-circle"
          style={{ backgroundColor: theme.colors.errorContainer }}
          color={theme.colors.error}
          size={40}
        />
      )}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={() =>
        navigation.navigate("PackageDetails", { packageData: item })
      }
      style={{ backgroundColor: theme.colors.surface }}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      {loading ? (
        <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={problems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text variant="bodyLarge" style={{ opacity: 0.6 }}>
                Brak zgłoszonych problemów.
              </Text>
              <Text variant="bodySmall" style={{ opacity: 0.4 }}>
                Dobra robota!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ReceptionistProblemsScreen;
