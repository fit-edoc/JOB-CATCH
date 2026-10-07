import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'job_portal_resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'auto', // Using auto allows Cloudinary to handle PDFs and retain their format
    format: async (req, file) => {
      // Extract the original extension so the Cloudinary URL ends in .pdf
      const ext = file.originalname.split('.').pop();
      return ext;
    },
  },
});

export const upload = multer({ storage: storage });
