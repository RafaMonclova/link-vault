"use client"
import { Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { useTheme } from "../hooks/useTheme"

const categories = [
  "Trabajo",
  "Educación",
  "Entretenimiento",
  "Redes Sociales",
  "Noticias",
  "Compras",
  "Herramientas",
  "Desarrollo",
  "Diseño",
  "Otros",
]

export default function CategoryList() {
  const { colors } = useTheme()

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: colors.backgroundVariant,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.categoryText, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryItem: {
    flex: 0.48,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
})

