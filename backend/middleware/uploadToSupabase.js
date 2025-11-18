const { supabase } = require('../config/supabase');
const multer = require('multer');
const path = require('path');

// Store files in memory temporarily
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// Middleware to upload to Supabase after multer processes files
const uploadToSupabase = async (req, res, next) => {
  try {
    console.log('DEBUG uploadToSupabase - req.file:', req.file);
    console.log('DEBUG uploadToSupabase - req.files:', req.files);
    
    // Handle both single file (req.file) and multiple files (req.files)
    let files = [];
    if (req.file) {
      files = [req.file]; // Single file upload
    } else if (req.files && req.files.length > 0) {
      files = req.files; // Multiple files upload
    }

    // If no files, continue
    if (files.length === 0) {
      console.log('DEBUG uploadToSupabase - No files to upload, continuing...');
      return next();
    }

    console.log(`DEBUG uploadToSupabase - Processing ${files.length} file(s)`);

    const uploadedFiles = [];

    // Upload each file to Supabase
    for (const file of files) {
      // Generate unique filename
      const fileExt = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
      const filePath = `lampiran/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('lampiran')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        console.error('File details:', { originalName: file.originalname, mimetype: file.mimetype, size: file.size });
        throw new Error(`Failed to upload ${file.originalname}: ${error.message}`);
      }

      console.log(`DEBUG uploadToSupabase - Successfully uploaded ${file.originalname} to ${filePath}`);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lampiran')
        .getPublicUrl(filePath);

      uploadedFiles.push({
        originalName: file.originalname,
        filename: fileName,
        path: filePath,
        url: publicUrl,
        mimetype: file.mimetype,
        size: file.size
      });
    }

    // Attach uploaded file info to request
    req.uploadedFiles = uploadedFiles;
    console.log('DEBUG uploadToSupabase - All files uploaded successfully:', uploadedFiles.length);
    next();

  } catch (error) {
    console.error('Upload middleware error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'File upload failed', 
      error: error.message 
    });
  }
};

module.exports = { upload, uploadToSupabase };