import multer from 'multer';
import { FILE_SIZE_AVATAR_LIMIT } from '../constants/common';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_AVATAR_LIMIT, 
  },
  fileFilter: fileFilter,
});