import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Video storage — goes into placeprep/videos folder
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'placeprep/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'webm'],
  },
});

// PDF/notes storage
const notesStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'placeprep/notes',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

// Image storage (thumbnails, company logos)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'placeprep/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const uploadVideo  = multer({ storage: videoStorage });
export const uploadNotes  = multer({ storage: notesStorage });
export const uploadImage  = multer({ storage: imageStorage });

export const deleteFromCloudinary = (publicId, resourceType = 'video') =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

export default cloudinary;