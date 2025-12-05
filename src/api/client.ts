import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.error(
    "BŁĄD KRYTYCZNY: Brak zdefiniowanego EXPO_PUBLIC_API_URL w pliku .env. " +
      "Utwórz plik .env w głównym folderze i dodaj tam adres swojego API."
  );
}

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
