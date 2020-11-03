const multer = require('multer');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

exports.upload = (fieldName) => {
  // set storage
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      const originalName = file.originalname.toLowerCase().split(' ').join('-');
      const fileName = originalName.split('.');
      const extension = fileName[fileName.length - 1];
      console.log('fieldname: ', file);

      return {
        folder: `literature/${file.fieldname}s`,
        resource_type: extension === 'pdf' ? 'raw' : 'image',
        format: extension === 'pdf' ? 'pdf' : '',
        public_id: Date.now() + '-' + fileName[0],
      };
    },
  });

  let fileType, limitSize;

  // set filter
  const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'attache') {
      fileType = 'pdf';
      limitSize = '5 MB';
    } else {
      fileType = 'image';
      limitSize = '2 MB';
    }

    // console.log('FILE MIME TYPE: ', file.mimetype);

    const extname = path.extname(file.originalname).toLowerCase();
    if (!file.mimetype.match(fileType)) {
      req.fileValidationError = {
        status: 'fail',
        message: `Please select an ${fileType} file`,
        code: 400,
      };
      return cb(new Error(`Please select an ${fileType} file!`), false);
    }

    cb(null, true);
  };

  // init upload
  let upload;
  if (fieldName === 'avatar') {
    upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 2 * 1000 * 1000,
      },
    }).single('avatar');
  } else {
    upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1000 * 1000,
      },
    }).fields([{ name: 'attache' }, { name: 'image' }]);
  }

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (!req.file && !req.files && !err) {
        return res.status(400).send({
          error: {
            message: 'Please upload both image and file of your literature',
          },
        });
      }

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            error: {
              message: `Max file size ${limitSize}`,
            },
          });
        }
        return res.status(400).send(err);
      }
      return next();
    });
  };
};
