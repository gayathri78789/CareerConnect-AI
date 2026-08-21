import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

/**
 * Checks if Cloudinary credentials are fully configured.
 */
export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Uploads a memory buffer to Cloudinary using upload_stream.
 * @param {Object} options
 * @param {Buffer} options.buffer - File buffer from Multer
 * @param {string} [options.folder='careerprep'] - Cloudinary folder path
 * @param {string} [options.fileName] - Original or sanitized file name
 * @param {string} [options.resourceType='auto'] - Resource type ('image', 'raw', 'auto', 'video')
 * @returns {Promise<{ key: string, url: string, bytes: number, format: string }>}
 */
export async function uploadToCloudinary({ buffer, folder = 'careerprep', fileName, resourceType = 'auto' }) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid upload payload: Memory buffer is required.');
  }

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured.');
  }

  const cleanName = fileName
    ? fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
    : `file_${Date.now()}`;
  const publicId = `${cleanName}_${Date.now()}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve({
          key: result.public_id,
          url: result.secure_url,
          bytes: result.bytes,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Uploads an image buffer to Cloudinary with automatic format and quality optimization.
 * @param {Object} options
 * @param {Buffer} options.buffer - Image buffer from Multer
 * @param {string} [options.folder='careerprep/images'] - Folder path
 * @param {string} [options.fileName] - File name
 * @param {Array} [options.transformations] - Optional custom Cloudinary transformations
 * @returns {Promise<{ key: string, url: string, bytes: number, format: string, width: number, height: number }>}
 */
export async function uploadImageToCloudinary({ buffer, folder = 'careerprep/images', fileName, transformations = [] }) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid image payload: Memory buffer is required.');
  }

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured.');
  }

  const cleanName = fileName
    ? fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
    : `img_${Date.now()}`;
  const publicId = `${cleanName}_${Date.now()}`;

  const defaultTransformations = [
    { quality: 'auto', fetch_format: 'auto' },
    ...transformations,
  ];

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        transformation: defaultTransformations,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Image Upload Error]:', error);
          return reject(new Error(`Cloudinary image upload failed: ${error.message}`));
        }
        resolve({
          key: result.public_id,
          url: result.secure_url,
          bytes: result.bytes,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 * @param {string} publicId - Cloudinary public_id
 * @param {string} [resourceType='image'] - Resource type ('image', 'raw', 'video')
 * @returns {Promise<{ success: boolean, result: string }>}
 */
export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  if (!publicId || typeof publicId !== 'string') {
    return { success: false, message: 'Invalid public ID' };
  }

  if (!isCloudinaryConfigured()) {
    return { success: true, isMock: true };
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return { success: res.result === 'ok', result: res.result };
  } catch (error) {
    console.error(`[Cloudinary Delete Error] Public ID: ${publicId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Returns optimized image URL using Cloudinary auto-format and auto-quality.
 * @param {string} publicId
 * @returns {string}
 */
export function getOptimizedImageUrl(publicId) {
  if (!publicId) return '';
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
}

/**
 * Returns auto-cropped image URL with smart gravity.
 * @param {string} publicId
 * @param {number} [width=500]
 * @param {number} [height=500]
 * @returns {string}
 */
export function getAutoCropImageUrl(publicId, width = 500, height = 500) {
  if (!publicId) return '';
  return cloudinary.url(publicId, {
    crop: 'auto',
    gravity: 'auto',
    width,
    height,
    secure: true,
  });
}

