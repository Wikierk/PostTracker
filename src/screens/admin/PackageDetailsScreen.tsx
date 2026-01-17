import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Button, useTheme, Card, Avatar } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import PackageStatusCard from "../../components/PackageStatusCard";
import PackageDetailsCard from "../../components/PackageDetailsCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { packageService } from "../../services/packageService";

type Props = NativeStackScreenProps<RootStackParamList, "PackageDetails">;

const PackageDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Usuń przesyłkę",
      "Czy na pewno chcesz usunąć tę przesyłkę z systemu? Operacji nie można cofnąć.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń trwale",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSubmitting(true);
              await packageService.deletePackage(packageData.id);
              console.log("Admin usunął paczkę ID:", packageData.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Błąd", "Nie udało się usunąć przesyłki.");
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const handleResolveProblem = () => {
    const description =
      (packageData as any).problemDescription || "Brak opisu problemu";

    Alert.alert(
      "Rozwiąż zgłoszenie",
      `Opis problemu: "${description}"\n\nCzy oznaczyć problem jako rozwiązany? Status paczki wróci do 'W RECEPCJI'.`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Tak, rozwiąż",
          onPress: async () => {
            try {
              setIsSubmitting(true);
              await packageService.updatePackage(packageData.id, {
                status: "registered",
              });
              Alert.alert("Sukces", "Zgłoszenie zostało rozwiązane.", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Błąd",
                "Nie udało się zaktualizować statusu paczki.",
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
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
                style={{
                  color: theme.colors.onErrorContainer,
                  marginBottom: 10,
                }}
              >
                {(packageData as any).problemDescription ||
                  "Pracownik zgłosił problem z tą przesyłką. Wymagana interwencja administratora."}
              </Text>
              <Button
                mode="contained"
                buttonColor={theme.colors.error}
                loading={isSubmitting}
                disabled={isSubmitting}
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
            icon="delete"
            textColor={theme.colors.error}
            style={[
              styles.actionButton,
              { borderColor: theme.colors.error, width: "100%" },
            ]}
            onPress={handleDelete}
            loading={isSubmitting}
            disabled={isSubmitting}
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
    justifyContent: "center",
    marginBottom: 40,
  },
  actionButton: {},
});

export default PackageDetailsScreen;
