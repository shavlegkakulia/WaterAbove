/**
 * Image Validation Utilities
 * Validates image file size and type according to backend requirements
 */

// Image upload constraints from backend
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
] as const;

export type AcceptedMimeType = typeof ACCEPTED_MIME_TYPES[number];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file size
 * @param fileSize File size in bytes
 * @returns true if file size is within limit (5MB)
 */
export const validateImageSize = (fileSize: number | undefined): ImageValidationResult => {
  if (!fileSize) {
    // If file size is not available, we can't validate it
    // But we'll allow it and let the backend handle it
    return { valid: true };
  }

  if (fileSize > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Image size is too large. Maximum size is ${maxSizeMB}MB, but the selected image is ${fileSizeMB}MB.`,
    };
  }

  return { valid: true };
};

/**
 * Validate image MIME type
 * @param mimeType Image MIME type (e.g., 'image/png', 'image/jpeg')
 * @returns true if MIME type is accepted
 */
export const validateImageType = (mimeType: string | undefined): ImageValidationResult => {
  if (!mimeType) {
    return {
      valid: false,
      error: 'Image type could not be determined.',
    };
  }

  const normalizedType = mimeType.toLowerCase();
  const isAccepted = ACCEPTED_MIME_TYPES.some(type => type.toLowerCase() === normalizedType);
console.log('isAccepted', mimeType, normalizedType, isAccepted);
  if (!isAccepted) {
    const acceptedTypes = ACCEPTED_MIME_TYPES.join(', ');
    return {
      valid: false,
      error: `Image type "${mimeType}" is not supported. Accepted types are: ${acceptedTypes}.`,
    };
  }

  return { valid: true };
};

/**
 * Validate image file
 * @param fileSize File size in bytes
 * @param mimeType Image MIME type
 * @returns Validation result with error message if invalid
 */
export const validateImage = (
  fileSize: number | undefined,
  mimeType: string | undefined
): ImageValidationResult => {
  // First check type (more specific error)
  const typeValidation = validateImageType(mimeType);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Then check size
  const sizeValidation = validateImageSize(fileSize);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
};

