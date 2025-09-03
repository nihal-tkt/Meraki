import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'media'; // Default folder
    let resourceType = 'raw'; // Default resource type for general files

    // Determine the folder and resource type based on file type
    if (file.mimetype.startsWith('image/')) {
      folder = 'images';
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'videos';
      resourceType = 'video';
    } else if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      folder = 'documents';
    }

    return {
      folder,
      resource_type: resourceType, // Specify the resource type for Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'pdf', 'txt', 'doc', 'docx'], // Add all necessary formats
    };
  },
});

const upload = multer({ storage });

export default upload;
