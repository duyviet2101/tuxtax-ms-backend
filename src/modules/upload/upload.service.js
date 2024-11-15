import {BadRequestError} from "../../exception/errorResponse.js";
import {uploadMultipleCloudinaryByBuffer} from "../../utils/cloudinary.js";

const uploadImages = async ({
  files,
}) => {
  if (!files) {
    throw new BadRequestError('No files provided');
  }

  const res = await uploadMultipleCloudinaryByBuffer({
    files,
    folder: 'tuxtax'
  })

  return res;
}

export default {
  uploadImages
}