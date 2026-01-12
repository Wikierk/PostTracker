import {
  MD3LightTheme as PaperLight,
  MD3DarkTheme as PaperDark,
} from "react-native-paper";
import {
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
} from "@react-navigation/native";

const LightColors = {
  primary: "rgb(0, 104, 116)",
  background: "rgb(242, 242, 242)",
  card: "rgb(255, 255, 255)",
  text: "rgb(28, 28, 30)",
  border: "rgb(199, 199, 204)",
  notification: "rgb(255, 69, 58)",
};

const DarkColors = {
  primary: "rgb(90, 200, 250)",
  background: "rgb(18, 18, 18)",
  card: "rgb(28, 28, 30)",
  text: "rgb(242, 242, 242)",
  border: "rgb(60, 60, 67)",
  notification: "rgb(255, 69, 58)",
};

export const paperLightTheme = {
  ...PaperLight,
  colors: { ...PaperLight.colors, ...LightColors },
};

export const paperDarkTheme = {
  ...PaperDark,
  colors: { ...PaperDark.colors, ...DarkColors },
};

export const navigationLightTheme = {
  ...NavLight,
  colors: { ...NavLight.colors, ...LightColors },
};

export const navigationDarkTheme = {
  ...NavDark,
  colors: { ...NavDark.colors, ...DarkColors },
};
