import React from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Button, useTheme, Card, Avatar } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCard from "../../components/PackageDetailsCard";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const PackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;

  const handleDelete = () => {
    Alert.alert(
      "Usuń przesyłkę",
      "Czy na pewno chcesz usunąć tę przesyłkę z systemu? Operacji nie można cofnąć.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń trwale",
          style: "destructive",
          onPress: () => {
            console.log("Admin usunął paczkę ID:", packageData.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleResolveProblem = () => {
    Alert.alert("Rozwiąż problem", "Czy oznaczyć problem jako rozwiązany?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Tak, rozwiąż",
        onPress: () => console.log("Problem rozwiązany"),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PackageStatusCard status={packageData.status} />

        {packageData.status === "problem" && (
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <Card.Title
              title="Zgłoszono Problem"
              titleStyle={{
                color: theme.colors.onErrorContainer,
                fontWeight: "bold",
              }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="alert"
                  style={{ backgroundColor: theme.colors.error }}
                />
              )}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onErrorContainer }}
              >
                Pracownik zgłosił problem z tą przesyłką. Wymagana interwencja
                administratora.
              </Text>
              <Button
                mode="contained"
                buttonColor={theme.colors.error}
                style={{ marginTop: 10 }}
                onPress={handleResolveProblem}
              >
                Rozwiąż zgłoszenie
              </Button>
            </Card.Content>
          </Card>
        )}

        <PackageDetailsCard package={packageData} />

        <Text variant="titleMedium" style={styles.sectionHeader}>
          Panel Zarządzania (Admin)
        </Text>

        <View style={styles.adminActions}>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => console.log("Nawigacja do edycji (TODO)")}
            style={styles.actionButton}
          >
            Edytuj dane
          </Button>
          <Button
            mode="outlined"
            icon="delete"
            textColor={theme.colors.error}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            onPress={handleDelete}
          >
            Usuń rekord
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  card: { marginBottom: 16 },
  sectionHeader: {
    marginBottom: 10,
    marginLeft: 5,
    opacity: 0.7,
    marginTop: 10,
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  actionButton: { width: "48%" },
});

export default PackageDetailsScreen;
