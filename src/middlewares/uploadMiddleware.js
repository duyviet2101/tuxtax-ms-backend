import multer from "multer";
import {ACCEPTED_FILE_TYPES} from "../constants/index.js";
import {BadRequestError} from "../exception/errorResponse.js";


const upload = multer({
  fileFilter: (req, file, cb) => {
    if (ACCEPTED_FILE_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new BadRequestError(`File type ${file.mimetype} is not supported!`));
    }
  },
});

const handleMulterError = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          next(new BadRequestError(`${err.message}`));
        } else {
          next(new BadRequestError(`${err.message}`));
        }
      } else {
        next();
      }
    });
  };
};

export const multerUploadSingleMiddleware = (name) => {
  return handleMulterError(upload.single(name));
};

export const multerUploadArrayMiddleware = (name, maxCount = 5) => {
  return handleMulterError(upload.array(name, maxCount));
};

