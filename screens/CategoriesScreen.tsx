"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"
import FloatingNavbar from "../components/FloatingNavbar"

// Categorías iniciales
const initialCategories = [
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

export default function CategoriesScreen() {
  const { colors } = useTheme()
  const [categories, setCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [editMode, setEditMode] = useState(false)

  // Animaciones
  const slideAnim = useRef(new Animated.Value(0)).current
  const { width } = Dimensions.get("window")

  // Mostrar/ocultar botones de eliminar
  const toggleEditMode = () => {
    setEditMode(!editMode)
    Animated.timing(slideAnim, {
      toValue: editMode ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  // Añadir nueva categoría
  const addCategory = () => {
    const trimmedCategory = newCategory.trim()

    // Validar que no esté vacío
    if (!trimmedCategory) {
      setError("La categoría no puede estar vacía")
      return
    }

    // Validar que no exista ya
    if (categories.some((cat) => cat.toLowerCase() === trimmedCategory.toLowerCase())) {
      setError("Esta categoría ya existe")
      return
    }

    // Añadir la categoría
    setCategories([...categories, trimmedCategory])
    setNewCategory("")
    setError("")
    setIsModalVisible(false)
  }

  // Eliminar categoría
  const deleteCategory = (category) => {
    Alert.alert("Eliminar categoría", `¿Estás seguro de que quieres eliminar la categoría "${category}"?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setCategories(categories.filter((cat) => cat !== category))
        },
      },
    ])
  }

  // Renderizar cada categoría
  const renderCategory = ({ item }) => {
    const translateX = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -50],
    })

    return (
      <Animated.View style={[styles.categoryContainer, { transform: [{ translateX }] }]}>
        <View
          style={[
            styles.category,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.categoryContent}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.categoryIconText, { color: colors.primary }]}>{item.charAt(0)}</Text>
            </View>
            <Text style={[styles.categoryText, { color: colors.text }]}>{item}</Text>
          </View>

          {editMode && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: "#FEE2E2" }]}
              onPress={() => deleteCategory(item)}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    )
  }

  // Modal para añadir categoría
  const renderModal = () => (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalVisible(false)} />
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Categoría</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundVariant,
                borderColor: error ? "#f87171" : colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Nombre de la categoría"
            placeholderTextColor={colors.textSecondary}
            value={newCategory}
            onChangeText={setNewCategory}
            autoFocus={true}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => {
                setIsModalVisible(false)
                setNewCategory("")
                setError("")
              }}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addCategory}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Categorías</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: editMode ? colors.backgroundVariant : "transparent" }]}
            onPress={toggleEditMode}
          >
            <Ionicons name={editMode ? "close-outline" : "create-outline"} size={22} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.primaryLight }]}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 100 }, // Espacio para la barra flotante
        ]}
      />

      {renderModal()}
      <FloatingNavbar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "#f87171",
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: "45%",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  addButton: {
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

