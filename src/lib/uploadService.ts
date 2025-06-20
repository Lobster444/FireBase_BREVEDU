import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload Service for handling image uploads to Firebase Storage
 */

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface UploadProgress {
  progress: number;
  isComplete: boolean;
  error?: string;
}

/**
 * Allowed image file types
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

/**
 * Maximum file size (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size too large. Please upload an image smaller than 5MB.'
    };
  }

  return { isValid: true };
};

/**
 * Generate a unique filename for the uploaded image
 */
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `course-thumbnails/${timestamp}-${randomString}.${extension}`;
};

/**
 * Upload image file to Firebase Storage
 */
export const uploadImage = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Generate unique filename
    const fileName = generateFileName(file.name);
    const storageRef = ref(storage, fileName);

    // Report initial progress
    onProgress?.({ progress: 0, isComplete: false });

    // Upload file
    console.log('📤 Uploading image to Firebase Storage:', fileName);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Report upload complete
    onProgress?.({ progress: 50, isComplete: false });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Report final completion
    onProgress?.({ progress: 100, isComplete: true });

    console.log('✅ Image uploaded successfully:', downloadURL);

    return {
      url: downloadURL,
      path: fileName,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    
    onProgress?.({ 
      progress: 0, 
      isComplete: false, 
      error: errorMessage 
    });
    
    throw new Error(errorMessage);
  }
};

/**
 * Delete image from Firebase Storage
 */
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    if (!imagePath) {
      console.warn('⚠️ No image path provided for deletion');
      return;
    }

    // Extract path from URL if full URL is provided
    let pathToDelete = imagePath;
    if (imagePath.includes('firebase')) {
      // Extract path from Firebase Storage URL
      const url = new URL(imagePath);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        pathToDelete = decodeURIComponent(pathMatch[1]);
      }
    }

    const storageRef = ref(storage, pathToDelete);
    await deleteObject(storageRef);
    
    console.log('🗑️ Image deleted successfully:', pathToDelete);
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    // Don't throw error for deletion failures to avoid blocking other operations
  }
};

/**
 * Get image dimensions from file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if URL is a Firebase Storage URL
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('firebasestorage.googleapis.com');
  } catch {
    return false;
  }
};