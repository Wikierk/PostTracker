import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { userService, UserRole } from "../../services/userService";

type Props = NativeStackScreenProps<RootStackParamList, "AdminUserForm">;

const AdminUserFormScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();

  const isEdit = route.params.mode === "edit";
  const editUser = isEdit ? route.params.user : undefined;

  const [email, setEmail] = useState(editUser?.email ?? "");
  const [fullName, setFullName] = useState(editUser?.fullName ?? "");
  const [role, setRole] = useState<UserRole>(
    (editUser?.role as UserRole) ?? "employee"
  );
  const [password, setPassword] = useState("");

  const title = useMemo(
    () => (isEdit ? "Edytuj użytkownika" : "Dodaj użytkownika"),
    [isEdit]
  );

  const onSave = async () => {
    if (!email.trim() || !fullName.trim()) {
      Alert.alert("Błąd", "Email i imię/nazwisko są wymagane.");
      return;
    }

    if (!isEdit && !password.trim()) {
      Alert.alert("Błąd", "Hasło jest wymagane przy tworzeniu użytkownika.");
      return;
    }

    try {
      if (isEdit && editUser) {
        const payload: any = { email, fullName, role };
        if (password.trim()) payload.password = password;
        await userService.updateUser(editUser.id, payload);
        Alert.alert("Sukces", "Zapisano zmiany.");
      } else {
        await userService.createUser({ email, fullName, role, password });
        Alert.alert("Sukces", "Utworzono użytkownika.");
      }

      navigation.goBack();
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się zapisać użytkownika.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <View style={styles.content}>
        <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
          {title}
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          label="Imię i nazwisko"
          mode="outlined"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        <SegmentedButtons
          value={role}
          onValueChange={(v) => setRole(v as UserRole)}
          buttons={[
            { value: "employee", label: "Pracownik" },
            { value: "receptionist", label: "Recepcja" },
            { value: "admin", label: "Admin" },
          ]}
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label={isEdit ? "Nowe hasło (opcjonalnie)" : "Hasło"}
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <Button mode="contained" onPress={onSave} style={styles.saveBtn}>
          Zapisz
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 6 }}
        >
          Anuluj
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  input: { marginBottom: 12 },
  saveBtn: { marginTop: 8, borderRadius: 10 },
});

export default AdminUserFormScreen;
