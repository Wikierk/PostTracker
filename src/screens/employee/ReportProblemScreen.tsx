import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import {
  Button,
  Card,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { packageService } from "../../services/packageService";

type Props = NativeStackScreenProps<RootStackParamList, "ReportProblem">;

const ReportProblemScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const { packageData } = route.params;

  const [type, setType] = useState<"damaged" | "other">("damaged");
  const [description, setDescription] = useState("");

  const onSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Brak opisu", "Opisz problem, zanim wyślesz zgłoszenie.");
      return;
    }
  try {
    await packageService.reportProblem(packageData.id, description);
    Alert.alert("Wysłano", "Twoje zgłoszenie zostało zapisane.");
    navigation.goBack();
  } catch (e) {
    Alert.alert("Błąd", "Nie udało się wysłać zgłoszenia.");
  }
};

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Title title="Zgłoszenie problemu" />
          <Card.Content>
            <Text variant="labelLarge" style={{ marginBottom: 6 }}>
              Przesyłka
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.8 }}>
              Nadawca: {packageData.sender}
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.8 }}>
              Punkt odbioru: {packageData.pickupPoint}
            </Text>

            <Text variant="labelLarge" style={{ marginTop: 16 }}>
              Rodzaj problemu
            </Text>

            <RadioButton.Group
              onValueChange={(v) => setType(v as "damaged" | "other")}
              value={type}
            >
              <RadioButton.Item label="Paczka uszkodzona" value="damaged" />
              <RadioButton.Item label="Inny problem" value="other" />
            </RadioButton.Group>

            <TextInput
              label="Opis problemu"
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              style={{ marginTop: 12 }}
            />

            <Button
              mode="contained"
              onPress={onSubmit}
              style={{ marginTop: 16, borderRadius: 10 }}
            >
              Wyślij zgłoszenie
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 8 }}
            >
              Anuluj
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderRadius: 12 },
});

export default ReportProblemScreen;
