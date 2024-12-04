import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'

// Definir interfaces para los datos
interface Proyecto {
  id: string
  nombre: string
}

interface Responsable {
  id: string
  nombre: string
}

interface FormularioProps {
  proyectos: Proyecto[]
  responsables: Responsable[]
  // onSubmit: (data: TaskData) => void
}

// Estructura de los datos que se enviarán al presionar el botón de submit
interface TaskData {
  nombre: string
  fechaInicio: string
  fechaEntrega: string
  estado: string
  idProyecto: string
  responsableId: string
}

const TaskFormModal: React.FC<FormularioProps> = ({
  proyectos,
  responsables,
  //   onSubmit,
}) => {
  const [nombre, setNombre] = useState<string>('')
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined)
  const [fechaEntrega, setFechaEntrega] = useState<Date | undefined>(undefined)
  const [idProyecto, setIdProyecto] = useState<string>('')
  const [responsableId, setResponsableId] = useState<string>('')
  const [showInicioPicker, setShowInicioPicker] = useState<boolean>(false)
  const [showEntregaPicker, setShowEntregaPicker] = useState<boolean>(false)

  // Función para manejar el cambio de fecha
  const handleDateChange = (
    event: any,
    selectedDate?: Date, // selectedDate es ahora opcional
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  ) => {
    // Si selectedDate es undefined, no se actualiza el estado
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  // Función para manejar el submit
  const handleSubmit = () => {
    if (
      !nombre ||
      !fechaInicio ||
      !fechaEntrega ||
      !idProyecto ||
      !responsableId
    ) {
      console.log('Por favor complete todos los campos')
      return
    }

    const taskData: TaskData = {
      nombre,
      fechaInicio: fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
      fechaEntrega: fechaEntrega.toISOString().split('T')[0], // Formato YYYY-MM-DD
      estado: 'pendiente',
      idProyecto,
      responsableId,
    }

    // onSubmit(taskData) // Llamar a la función onSubmit con los datos
  }

  return (
    <View style={styles.container}>
      {/* Input Nombre */}
      <TextInput
        style={styles.input}
        placeholder='Nombre de la tarea'
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Fecha Inicio */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowInicioPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {fechaInicio
            ? fechaInicio.toISOString().split('T')[0]
            : 'Seleccionar fecha de inicio'}
        </Text>
      </TouchableOpacity>

      {showInicioPicker && (
        <DateTimePicker
          value={fechaInicio || new Date()}
          mode='date'
          display='default'
          onChange={(event: any, date: any) =>
            handleDateChange(event, date, setFechaInicio)
          }
        />
      )}

      {/* Fecha Entrega */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowEntregaPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {fechaEntrega
            ? fechaEntrega.toISOString().split('T')[0]
            : 'Seleccionar fecha de entrega'}
        </Text>
      </TouchableOpacity>

      {showEntregaPicker && (
        <DateTimePicker
          value={fechaEntrega || new Date()}
          mode='date'
          display='default'
          onChange={(event: any, date: any) =>
            handleDateChange(event, date, setFechaEntrega)
          }
        />
      )}

      {/* Select Proyecto */}
      <Picker
        selectedValue={idProyecto}
        onValueChange={(itemValue: any) => setIdProyecto(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label='Seleccionar proyecto' value='' />
        {proyectos.map((proyecto) => (
          <Picker.Item
            key={proyecto.id}
            label={proyecto.nombre}
            value={proyecto.id}
          />
        ))}
      </Picker>

      {/* Select Responsable */}
      <Picker
        selectedValue={responsableId}
        onValueChange={(itemValue: any) => setResponsableId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label='Seleccionar responsable' value='' />
        {responsables.map((responsable) => (
          <Picker.Item
            key={responsable.id}
            label={responsable.nombre}
            value={responsable.id}
          />
        ))}
      </Picker>

      {/* Botón de submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#EDEDED',
    marginBottom: 10,
  },
  dateButton: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#EDEDED',
  },
  picker: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    marginBottom: 10,
    color: '#EDEDED',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
})

export default TaskFormModal
