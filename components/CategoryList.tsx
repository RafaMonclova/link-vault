"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import { getUniqueCategories, getLinksByCategory } from "../utils/storage"

interface CategoryListProps {
  onUpdate: number // Timestamp para forzar actualización
}

export default function CategoryList({ onUpdate }: CategoryListProps) {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [categories, setCategories] = useState<string[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    setLoading(true)
    try {
      // Obtener categorías únicas
      const uniqueCategories = await getUniqueCategories()
      setCategories(uniqueCategories)

      // Obtener conteo de enlaces por categoría
      const counts: Record<string, number> = {}
      for (const category of uniqueCategories) {
        const categoryLinks = await getLinksByCategory(category)
        counts[category] = categoryLinks.length
      }
      setCategoryCounts(counts)
    } catch (error) {
      console.error("Error loading categories:", error)
      Alert.alert("Error", "No se pudieron cargar las categorías")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [onUpdate])

  const handleCategoryPress = (category: string) => {
    // Aquí se podría navegar a una vista filtrada por categoría
    Alert.alert(category, `Ver ${categoryCounts[category]} enlaces en esta categoría`, [{ text: "OK" }])
  }

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: colors.backgroundVariant,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={[styles.categoryText, { color: colors.text }]}>{item}</Text>
      <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>{categoryCounts[item] || 0}</Text>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    )
  }

  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hay categorías disponibles</Text>
      </View>
    )
  }

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
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
})

