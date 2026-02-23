import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [legendaryOnly, setLegendaryOnly] = useState(false);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        legendaryOnly,
        setLegendaryOnly
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}