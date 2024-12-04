import React, { useState } from 'react'
import { StyleSheet, View, FlatList, Dimensions } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedFlatView } from '@/components/ThemedFlatView'

// Componentes de la aplicación
import TaskItem from '@/components/sprint_components/taskItem'

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
  const { projectName, tasks } = useLocalSearchParams<{
    projectName?: string
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

  return (
    <ThemedFlatView style={styles.HomeScreenContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type='title'>Project Page</ThemedText>
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
})
