export const validateFile = async (file) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']
  const maxSize = 5 * 1024 * 1024 // 5 MB

  if (!file) {
    return { valid: false, error: 'No file selected.' }
  }

  if (!allowedTypes.includes(file.mimeType)) {
    return { valid: false, error: 'Only PNG/JPG/PDF allowed.' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File must be under 5 MB.' }
  }

  return { valid: true }
}
