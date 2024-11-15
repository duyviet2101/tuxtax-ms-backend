import {cloudinary} from "../config/cloudinary.config.js";

export const uploadSingleCloudinaryByBuffer = async ({file, folder}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      folder: folder,
      public_id: file.originalname,
      overwrite: true,
    }, (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(result.secure_url);
    }).end(file.buffer);
  });
}

export const uploadMultipleCloudinaryByBuffer = async ({files, folder}) => {
  const promises = files.map(file => {
    return uploadSingleCloudinaryByBuffer({file, folder});
  });
  return Promise.all(promises);
};