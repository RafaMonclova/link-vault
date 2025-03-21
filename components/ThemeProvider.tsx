"use client"

import { createContext, useState } from "react"
import { useColorScheme } from "react-native"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colors: {
    background: string
    backgroundVariant: string
    card: string
    text: string
    textSecondary: string
    border: string
    primary: string
    primaryLight: string
    shadow: string
  }
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

import { ReactNode } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>("system")

  const isDark = theme === "dark" || (theme === "system" && systemColorScheme === "dark")

  const lightColors = {
    background: "#F5F7FA",
    backgroundVariant: "#EEF2F6",
    card: "#FFFFFF",
    text: "#1A202C",
    textSecondary: "#718096",
    border: "#E2E8F0",
    primary: "#3182CE",
    primaryLight: "#EBF8FF",
    shadow: "#000000",
  }

  const darkColors = {
    background: "#1A202C",
    backgroundVariant: "#2D3748",
    card: "#2D3748",
    text: "#F7FAFC",
    textSecondary: "#A0AEC0",
    border: "#4A5568",
    primary: "#63B3ED",
    primaryLight: "#2C5282",
    shadow: "#000000",
  }

  const colors = isDark ? darkColors : lightColors

  return <ThemeContext.Provider value={{ theme, setTheme, colors }}>{children}</ThemeContext.Provider>
}

