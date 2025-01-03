import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Pressable,
  Modal,
  Text,
  Alert,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedFlatView } from '@/components/ThemedFlatView'
import FormModal from '@/components/sprint_components/FormModal'

// Componentes de la aplicación
import TaskItem from '@/components/sprint_components/taskItem'
import TaskForm from '@/components/sprint_components/TaskForm'

// Interfaz para el tipo de datos
interface Responsable {
  _id: string
  email: string
  nombre: string
}

interface Item {
  id: string
  nombre: string
  estado: string
  fechaEntrega: string
  fechaInicio: string
  responsable: Responsable
}

const data: Item[] = [
  {
    id: '674faaa332a2f15c16c0ab1f',
    nombre: 'Desarrollar API',
    estado: 'pendiente',
    fechaEntrega: '2024-12-20T00:00:00.000Z',
    fechaInicio: '2024-12-10T00:00:00.000Z',
    responsable: {
      _id: '674fa9750af4be9629c58ce7',
      email: 'carlos@example.com',
      nombre: 'Carlos García',
    },
  },
  // Agrega más datos según sea necesario
]

const numColumns = 2
const ITEM_WIDTH = Dimensions.get('window').width / numColumns - 25

export default function ProyectPage() {
  // recibir las tareas por medio de parametros de router
  const { projectName, projectId, tasks } = useLocalSearchParams<{
    projectName?: string
    projectId?: string
    tasks?: string // Aquí pasamos tasks como string para luego parsearlo
  }>()

  // Parsear tasks si existe
  const parsedTasks = tasks ? JSON.parse(tasks) : []

  // Asegúrate de que `item` sea del tipo `Item`, que coincide con la estructura de `data`
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <TaskItem title={item.nombre} task={item} />
    </View>
  )

  // declaracion del router
  const router = useRouter()
  // funcion para eliminar un proyecto
  const handleDelete = () => {
    // funcion para borrar el proyecto
    deleteProyect()
    // redirijir a la pantalla anterior al borrar el proyecto
    router.back()
  }

  const deleteProyect = async () => {
    try {
      // Hacer la solicitud DELETE usando fetch
      const response = await fetch(
        `http://192.168.0.112:5000/api/proyectos/${projectId}`,
        {
          method: 'DELETE', // Definir el método como DELETE
          headers: {
            'Content-Type': 'application/json', // Cabecera con el tipo de contenido
          },
        }
      )

      // Si la respuesta no es exitosa, lanzar error
      if (!response.ok) {
        throw new Error('Error al eliminar el proyecto')
      }

      // Si la respuesta es exitosa, obtener la respuesta JSON
      const data = await response.json()

      // Mostrar una alerta de éxito
      Alert.alert('Éxito', 'Proyecto eliminado con éxito')
      console.log(data) // Opcional: Ver los datos que se retornan del servidor
    } catch (error: any) {
      // Si ocurre un error, mostrar una alerta de error
      Alert.alert('Error', error.message)
    }
  }

  // metodos para el modal
  // metodos para el modal
  const [isModalVisible, setModalVisible] = useState(false)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  return (
    <ThemedFlatView style={{ flex: 1, padding: 0 }}>
      <ThemedFlatView style={styles.HomeScreenContainer}>
        <View style={styles.titleContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: 80,
              paddingHorizontal: 0,
            }}
          >
            <ThemedText type='title'>Project Page</ThemedText>
            <Pressable onPress={openModal}>
              <ThemedText
                style={{
                  backgroundColor: '#F5A818',
                  paddingVertical: 4,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  textAlign: 'center', // Asegura que el texto esté centrado
                }}
              >
                New Task
              </ThemedText>
            </Pressable>
          </View>
          <ThemedText type='subtitle'>{projectName}</ThemedText>
        </View>
        <FlatList
          data={parsedTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.container}
        />
      </ThemedFlatView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TaskForm
          onClose={closeModal}
          projectIdProp={projectId}
          projectName={projectName}
        />
      </Modal>
      <Pressable style={styles.cancelButton} onPress={handleDelete}>
        <Text style={styles.cancelButtonText}>Eliminar Proyecto</Text>
      </Pressable>
    </ThemedFlatView>
  )
}

const styles = StyleSheet.create({
  HomeScreenContainer: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  titleContainer: {
    margin: 6,
    marginBottom: 22,
  },
  proyectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  // Contenedor de cada elemento para ocupar la mitad del ancho de la pantalla
  itemContainer: {
    width: ITEM_WIDTH, // Tamaño de cada elemento basado en el ancho de la pantalla
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 10,
  },
  // Estilos para FlatList
  container: {
    // paddingHorizontal: 10,
    // paddingTop: 20,
  },
  // button styles
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    width: '45%',
    backgroundColor: '#F44336', // Botón de cancelar en rojo
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#FFFFFF', // Texto blanco en el botón
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
