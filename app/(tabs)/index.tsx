import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Modal,
  Pressable,
} from 'react-native'
import useApi from '@/hooks/useApi'

import { HelloWave } from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import ProjectItem from '@/components/sprint_components/projectItem'
import FormModal from '@/components/sprint_components/FormModal'

type Project = {
  status: string // Estado del proyecto (ej. "Pendiente")
  _id: string // ID único del proyecto
  name: string // Nombre del proyecto
  description: string // Descripción del proyecto
  owners: string[] // Arreglo de IDs de propietarios
  members: string[] // Arreglo de IDs de miembros
  tasks: string[] // Arreglo de IDs de tareas
  createdAt: string // Fecha de creación en formato ISO
  updatedAt: string // Fecha de última actualización en formato ISO
}

export default function HomeScreen() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener datos desde un endpoint
  const getData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://192.168.0.112:5000/api/proyectos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setProjects(data) // Actualizar el estado con los datos recibidos
      // console.log('Response:', data)
    } catch (err: any) {
      setError(err.message)
      console.error('Fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Llama a la función al montar el componente
    getData()
  }, [])

  // metodos para el modal
  const [isModalVisible, setModalVisible] = useState(false)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  return (
    <ThemedView style={styles.HomeScreenContainer}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row', // Cambiado a 'row' para disposición horizontal
          alignItems: 'center', // Opcional: Alinea los elementos verticalmente
          justifyContent: 'space-between', // Opcional: Espaciado uniforme
          width: '100%',
          height: 80,
          paddingHorizontal: 28,
        }}
      >
        <ThemedText type='title'>Projects</ThemedText>
        {/* Botón */}
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
            Button
          </ThemedText>
        </Pressable>
      </View>
      {/* contenido de la pagina */}
      <ThemedView style={{ gap: 18 }}>
        {projects.map((item, index) => (
          <ThemedView key={index}>
            <ProjectItem projectName={item.nombre} tasks={item.tareas} />
          </ThemedView>
        ))}
      </ThemedView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <FormModal onClose={closeModal} />
      </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  HomeScreenContainer: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
