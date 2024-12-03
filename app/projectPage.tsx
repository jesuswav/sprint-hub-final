import React from 'react'
import { StyleSheet, View, FlatList, Dimensions } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedFlatView } from '@/components/ThemedFlatView'

// Componentes de la aplicación
import TaskItem from '@/components/sprint_components/taskItem'

// Simulación de datos
interface Item {
  id: string
  title: string
}

const data: Item[] = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 5' },
  { id: '6', title: 'Item 6' },
]

const numColumns = 2
const ITEM_WIDTH = Dimensions.get('window').width / numColumns - 25

export default function ProyectPage() {
  const { proyectName } = useLocalSearchParams<{ proyectName?: string }>()

  // Asegúrate de que `item` sea del tipo `Item`, que coincide con la estructura de `data`
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <TaskItem title={item.title} />
    </View>
  )

  return (
    <ThemedFlatView style={styles.HomeScreenContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type='title'>Proyect Page</ThemedText>
        <ThemedText type='subtitle'>{proyectName}</ThemedText>
      </View>
      <FlatList
        data={data}
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
