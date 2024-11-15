import {v2 as cloudinary} from 'cloudinary';
import config from "../../config.js";

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_KEY,
  api_secret: config.CLOUD_SECRET
})

export { cloudinary };