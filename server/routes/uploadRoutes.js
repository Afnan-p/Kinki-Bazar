const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('image'), (req, res) => {
  console.log('Upload Request Received');
  console.log('File:', req.file);
  
  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
      success: true,
      image: {
        url: req.file.path,
        public_id: req.file.filename
      }
    });
    console.log('Upload Successful:', req.file.path);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
