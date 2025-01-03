import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'

interface FormModalProps {
  onClose: () => void
}

const FormModal: React.FC<FormModalProps> = ({ onClose }) => {
  const [name, setName] = useState('')
  const [desciption, setDescription] = useState('')

  const handleSubmit = async () => {
    console.log({ name, desciption })
    // enviar los datos al servidor
    const url = 'http://192.168.0.112:5000/api/proyectos'
    const body = {
      nombre: name,
      descripcion: desciption,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        Alert.alert('Éxito', 'Proyecto creado correctamente', [{ text: 'OK' }])
        console.log('Respuesta:', data)
      } else {
        const errorData = await response.json()
        Alert.alert(
          'Error',
          `Error al crear el proyecto: ${errorData.message}`,
          [{ text: 'OK' }]
        )
      }
    } catch (error) {
      console.error('Error en la petición:', error)
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor.', [
        { text: 'OK' },
      ])
    }
    onClose()
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.modalBackground}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add a new member</Text>

        {/* Input de nombre */}
        <TextInput
          style={styles.input}
          placeholder='Project Name'
          placeholderTextColor='#888'
          value={name}
          onChangeText={setName}
        />

        {/* Input de correo */}
        <TextInput
          style={styles.input}
          placeholder='Description'
          placeholderTextColor='#888'
          value={desciption}
          onChangeText={setDescription}
        />

        {/* Botones */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1E1E1E', // Color de fondo oscuro
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF', // Texto claro para modo oscuro
  },
  input: {
    width: '100%',
    backgroundColor: '#2C2C2C', // Fondo oscuro para el input
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#EDEDED', // Texto claro en el input
    borderWidth: 1,
    borderColor: '#3A3A3A', // Borde más oscuro
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#F5A818', // Botón de enviar en verde
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#FFFFFF', // Texto blanco en el botón
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    width: '100%',
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

export default FormModal
