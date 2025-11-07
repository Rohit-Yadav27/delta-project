const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ //eshe ham backend ko cloudinary ke account ke shath jodege (or ushme ae shab infomation lgega)
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_kEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({ //define storage
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowerdFormats: ["png","jpg","jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage,
};