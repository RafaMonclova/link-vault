"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { useTheme } from "../hooks/useTheme"
import FloatingNavbar from "../components/FloatingNavbar"

// Categorías disponibles
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

export default function NewLinkScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()

  // Estados para los campos del formulario
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    title: "",
    url: "",
    category: "",
    iconUrl: "",
  })

  // Estados para el icono
  const [iconType, setIconType] = useState("initials") // 'initials', 'gallery', 'url'
  const [iconImage, setIconImage] = useState(null)
  const [iconUrl, setIconUrl] = useState("")
  const [showIconModal, setShowIconModal] = useState(false)
  const [generatedInitials, setGeneratedInitials] = useState("")

  // Validar URL
  const isValidUrl = (urlString) => {
    try {
      new URL(urlString)
      return true
    } catch (e) {
      return false
    }
  }

  // Generar iniciales para el icono
  const generateIcon = (text) => {
    if (!text) return ""

    const words = text.split(" ")
    if (words.length === 1) {
      return text.substring(0, 2).toUpperCase()
    } else {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
    }
  }

  // Actualizar iniciales cuando cambia el título
  useEffect(() => {
    setGeneratedInitials(generateIcon(title))
  }, [title])

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permisos necesarios", "Necesitamos permisos para acceder a tu galería de imágenes.", [
        { text: "OK" },
      ])
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setIconImage(result.assets[0].uri)
      setIconType("gallery")
      setShowIconModal(false)
    }
  }

  // Validar URL de imagen
  const validateImageUrl = () => {
    if (!iconUrl.trim()) {
      setErrors({ ...errors, iconUrl: "La URL de la imagen es obligatoria" })
      return false
    }

    if (!isValidUrl(iconUrl)) {
      setErrors({ ...errors, iconUrl: "La URL de la imagen no es válida" })
      return false
    }

    setErrors({ ...errors, iconUrl: "" })
    setIconType("url")
    setShowIconModal(false)
    return true
  }

  // Manejar el envío del formulario
  const handleSubmit = () => {
    // Validar campos
    const newErrors = {
      title: "",
      url: "",
      category: "",
      iconUrl: "",
    }
    let isValid = true

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio"
      isValid = false
    }

    if (!url.trim()) {
      newErrors.url = "La URL es obligatoria"
      isValid = false
    } else if (!isValidUrl(url)) {
      newErrors.url = "La URL no es válida"
      isValid = false
    }

    if (!selectedCategory) {
      newErrors.category = "Selecciona una categoría"
      isValid = false
    }

    setErrors(newErrors)

    if (isValid) {
      setIsLoading(true)

      // Simular envío a API
      setTimeout(() => {
        setIsLoading(false)
        Alert.alert("Enlace guardado", `El enlace "${title}" ha sido guardado correctamente.`, [
          {
            text: "OK",
            onPress: () => {
              // Limpiar formulario y volver a la pantalla principal
              setTitle("")
              setUrl("")
              setSelectedCategory("")
              setIsFeatured(false)
              setIconType("initials")
              setIconImage(null)
              setIconUrl("")
              navigation.navigate("Home")
            },
          },
        ])
      }, 1000)
    }
  }

  // Renderizar el icono según el tipo seleccionado
  const renderIconPreview = () => {
    switch (iconType) {
      case "gallery":
        return <Image source={{ uri: iconImage }} style={styles.iconImage} resizeMode="cover" />
      case "url":
        return (
          <Image
            source={{ uri: iconUrl }}
            style={styles.iconImage}
            resizeMode="cover"
            onError={() => {
              Alert.alert("Error de imagen", "No se pudo cargar la imagen. Verifica la URL o selecciona otra opción.", [
                {
                  text: "OK",
                  onPress: () => setIconType("initials"),
                },
              ])
            }}
          />
        )
      case "initials":
      default:
        return <Text style={[styles.iconText, { color: colors.primary }]}>{generatedInitials || "?"}</Text>
    }
  }

  // Modal para seleccionar tipo de icono
  const renderIconModal = () => (
    <Modal
      visible={showIconModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowIconModal(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowIconModal(false)} />
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
          <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Icono</Text>

          <TouchableOpacity
            style={[styles.iconOption, { borderColor: colors.border }]}
            onPress={() => {
              setIconType("initials")
              setShowIconModal(false)
            }}
          >
            <Ionicons name="text" size={24} color={colors.primary} style={styles.iconOptionIcon} />
            <View style={styles.iconOptionContent}>
              <Text style={[styles.iconOptionTitle, { color: colors.text }]}>Iniciales</Text>
              <Text style={[styles.iconOptionDescription, { color: colors.textSecondary }]}>
                Usar iniciales generadas automáticamente
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconOption, { borderColor: colors.border }]} onPress={pickImage}>
            <Ionicons name="image" size={24} color={colors.primary} style={styles.iconOptionIcon} />
            <View style={styles.iconOptionContent}>
              <Text style={[styles.iconOptionTitle, { color: colors.text }]}>Galería</Text>
              <Text style={[styles.iconOptionDescription, { color: colors.textSecondary }]}>
                Seleccionar imagen de la galería
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconOption, { borderColor: colors.border }]}
            onPress={() => {
              setShowIconModal(false)
              setTimeout(() => {
                Alert.prompt(
                  "URL de imagen",
                  "Introduce la URL de la imagen",
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: (url) => {
                        if (url && isValidUrl(url)) {
                          setIconUrl(url)
                          setIconType("url")
                          setErrors({ ...errors, iconUrl: "" })
                        } else if (url) {
                          Alert.alert("URL inválida", "Por favor, introduce una URL válida")
                        }
                      },
                    },
                  ],
                  "plain-text",
                  iconUrl,
                )
              }, 300)
            }}
          >
            <Ionicons name="link" size={24} color={colors.primary} style={styles.iconOptionIcon} />
            <View style={styles.iconOptionContent}>
              <Text style={[styles.iconOptionTitle, { color: colors.text }]}>URL</Text>
              <Text style={[styles.iconOptionDescription, { color: colors.textSecondary }]}>
                Usar imagen desde una URL
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.backgroundVariant }]}
            onPress={() => setShowIconModal(false)}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Nuevo Enlace</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Añade un nuevo enlace a tu colección</Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            {/* Previsualización del icono */}
            <View style={styles.iconPreview}>
              <TouchableOpacity
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: iconType === "initials" ? colors.primaryLight : "transparent",
                    borderWidth: iconType !== "initials" ? 0 : 1,
                    borderColor: colors.border,
                    overflow: "hidden",
                  },
                ]}
                onPress={() => setShowIconModal(true)}
              >
                {renderIconPreview()}
                <View style={[styles.iconEditBadge, { backgroundColor: colors.primary }]}>
                  <Ionicons name="pencil" size={12} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>
                {iconType === "initials" ? "Iniciales" : iconType === "gallery" ? "Galería" : "URL"}
              </Text>
            </View>

            {/* Campo de título */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundVariant,
                    borderColor: errors.title ? "#f87171" : colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Nombre del sitio web"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            {/* Campo de URL */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>URL *</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundVariant,
                    borderColor: errors.url ? "#f87171" : colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="https://ejemplo.com"
                placeholderTextColor={colors.textSecondary}
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
              {errors.url ? <Text style={styles.errorText}>{errors.url}</Text> : null}
            </View>

            {/* Selector de categoría */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Categoría *</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: selectedCategory === category ? colors.primary : colors.backgroundVariant,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: selectedCategory === category ? "white" : colors.text,
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
            </View>

            {/* Opción de destacado */}
            <TouchableOpacity style={styles.featuredOption} onPress={() => setIsFeatured(!isFeatured)}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: colors.border,
                    backgroundColor: isFeatured ? colors.primary : "transparent",
                  },
                ]}
              >
                {isFeatured && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>Marcar como destacado</Text>
            </TouchableOpacity>

            {/* Botones de acción */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color="white" style={styles.buttonIcon} />
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderIconModal()}
      <FloatingNavbar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para la barra flotante
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  formContainer: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  iconText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  iconEditBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#f87171",
    marginTop: 4,
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuredOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "45%",
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButtonText: {
    color: "white",
  },
  buttonIcon: {
    marginRight: 6,
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
    width: "85%",
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
    textAlign: "center",
  },
  iconOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  iconOptionIcon: {
    marginRight: 12,
  },
  iconOptionContent: {
    flex: 1,
  },
  iconOptionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  iconOptionDescription: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

