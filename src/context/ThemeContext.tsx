import React from "react";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  mode: ThemeMode;
  toggle: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<ThemeMode>("light");

  const value = React.useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode musi być użyte wewnątrz ThemeProvider");
  return ctx;
};
