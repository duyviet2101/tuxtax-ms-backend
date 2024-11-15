import catchAsync from "../../utils/catchAsync.js";
import UploadService from "./upload.service.js";


const uploadImages = catchAsync(async (req, res, next) => {
  const data = await UploadService.uploadImages({
    files: req?.files,
  })
  return res.json(data);
});

export default {
  uploadImages
}