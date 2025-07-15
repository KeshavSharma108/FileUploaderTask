// FileUploader.js
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as WebBrowser from 'expo-web-browser'
import * as FileSystem from 'expo-file-system'
import { Ionicons } from '@expo/vector-icons'
import { validateFile } from '../helpers/validateFile'
import { supabase } from '../supabaseClient'

export default function FileUploader() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [publicUrl, setPublicUrl] = useState(null)

  const handleFilePick = async () => {
    setError('')
    setPublicUrl(null)

    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    })

    if (result.canceled) {
      setFile(null)
      setError('No file selected.')
      return
    }

    const selected = result.assets[0]
    const { valid, error: validationError } = await validateFile(selected)

    if (!valid) {
      setFile(null)
      setError(validationError)
      return
    }

    setFile(selected)
    uploadFile(selected)
  }

  const uploadFile = async (file) => {
    try {
      setUploading(true)

      const fileData = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      const filePath = `uploads/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, Buffer.from(fileData, 'base64'), {
          contentType: file.mimeType,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath)
      setPublicUrl(data.publicUrl)
      console.log('Public URL:', data.publicUrl)
    } catch (e) {
      console.error('Upload failed:', e.message)
      setError('Upload failed. Please try again.')
      Alert.alert('Upload Error', e.message || 'Something went wrong.')
    } finally {
      setUploading(false)
    }
  }

  const renderPreview = () => {
    if (!publicUrl || !file) return null

    if (file.mimeType.startsWith('image')) {
      return (
        <>
          <Text className="text-center text-sm text-gray-500 mt-2">Uploaded Image Preview</Text>
          <Image
            source={{ uri: publicUrl }}
            resizeMode="contain"
            style={{
              width: '100%',
              aspectRatio: 1,
              marginTop: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#D1D5DB',
            }}
          />
        </>
      )
    }

    if (file.mimeType === 'application/pdf') {
      return (
        <TouchableOpacity
          className="mt-6 bg-red-600 flex-row items-center justify-center px-4 py-3 rounded-lg"
          onPress={() => WebBrowser.openBrowserAsync(publicUrl)}
        >
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text className="text-white text-base font-medium ml-2">Open PDF</Text>
        </TouchableOpacity>
      )
    }

    return null
  }

  return (
    <View className="p-6 space-y-5 w-full max-w-md mx-auto" >
      <Text className="text-2xl font-bold text-gray-800 text-center">Upload File</Text>

      <TouchableOpacity
        className="bg-indigo-600 py-3 px-6 rounded-xl shadow-md"
        onPress={handleFilePick}
      >
        <Text className="text-white text-center text-lg font-semibold">Select File</Text>
      </TouchableOpacity>

      {uploading && (
        <View className="items-center mt-2">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-2 text-gray-600">Uploading...</Text>
        </View>
      )}

      <Text
        className={`text-center text-base ${
          error ? 'text-red-600' : file ? 'text-green-700' : 'text-gray-500'
        }`}
      >
        {error || (file ? file.name : 'No file selected.')}
      </Text>

      {renderPreview()}
    </View>
  )
}
