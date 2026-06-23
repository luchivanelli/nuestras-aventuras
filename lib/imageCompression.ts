import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Máximo 1MB por foto
    maxWidthOrHeight: 1920, // Máximo 1920px de ancho/alto
    useWebWorker: true,
    quality: 0.8, // 80% de calidad
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    // Si falla la compresión, retorna el archivo original
    return file;
  }
}

export async function compressMultiple(files: File[]): Promise<File[]> {
  return Promise.all(files.map(f => compressImage(f)));
}
