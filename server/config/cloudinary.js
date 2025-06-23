const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dvtdeeajy',
  api_key: '283145712797423',
  api_secret: '_K7cQHD5NexihiizxSKDvMqWrMg'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat_files', // 👈 Change this folder name if needed
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'mp4', 'zip'], // customize as needed
    resource_type: 'auto', // Allows images, videos, files, etc.
  }
});

module.exports = { cloudinary, storage };
