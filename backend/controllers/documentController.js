const Document = require('../models/Document');
const { uploadDocumentToCloudinary } = require('../middleware/uploadDoc');

// @desc    Upload new document (Invert or Outvert)
// @route   POST /api/documents/upload
// @access  Private (Admin, Manager, Staff) // Assuming staff can also upload for now, can be restricted via middleware later
exports.uploadDocument = async (req, res, next) => {
  try {
    const { title, description, type, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    // Determine basic file type group
    let fileType = 'other';
    const mime = req.file.mimetype;
    if (mime.includes('pdf')) fileType = 'pdf';
    else if (mime.includes('excel') || mime.includes('spreadsheetml')) fileType = 'excel';
    else if (mime.includes('image')) fileType = 'image';

    // Upload to Cloudinary
    const result = await uploadDocumentToCloudinary(
      req.file.buffer, 
      req.file.originalname,
      req.file.mimetype
    );

    // Save to database
    const document = await Document.create({
      title,
      description,
      type: type || 'invert', // default to invert if not specified
      fileType,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileSize: req.file.size,
      tags: tags ? JSON.parse(tags) : [], // If sent as stringified JSON from frontend
      uploadedBy: req.user.id,
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents with filtering
// @route   GET /api/documents
// @access  Private
exports.getAllDocuments = async (req, res, next) => {
  try {
    const { type, fileType, search, tags, limit = 50, page = 1 } = req.query;

    const query = { isArchived: false };

    // Apply filters
    if (type) query.type = type; // 'invert' or 'outvert'
    if (fileType) query.fileType = fileType;
    
    // Search by title or original file name
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags) {
        const tagsArray = tags.split(',').map(t => t.trim());
        query.tags = { $in: tagsArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name role email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

    res.status(200).json({
      documents,
      count: documents.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get document stats for dashboard
// @route   GET /api/documents/stats
// @access  Private
exports.getDocumentStats = async (req, res, next) => {
    try {
        const totalInvert = await Document.countDocuments({ type: 'invert', isArchived: false });
        const totalOutvert = await Document.countDocuments({ type: 'outvert', isArchived: false });
        
        // Aggregate file sizes
        const sizeResult = await Document.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: null, totalSize: { $sum: "$fileSize" } } }
        ]);
        const totalSizeBytes = sizeResult.length > 0 ? sizeResult[0].totalSize : 0;

        // Count by file type
        const typeAggregation = await Document.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: "$fileType", count: { $sum: 1 } } }
        ]);

        const types = {
            pdf: 0,
            excel: 0,
            image: 0,
            other: 0
        };

        typeAggregation.forEach(item => {
            if (types[item._id] !== undefined) {
                types[item._id] = item.count;
            }
        });

        res.status(200).json({
            totalInvert,
            totalOutvert,
            totalDocuments: totalInvert + totalOutvert,
            totalSizeBytes,
            breakdown: types
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'name role email');

    if (!document || document.isArchived) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

// @desc    Download document (Get URL and increment counter)
// @route   POST /api/documents/:id/download
// @access  Private
exports.downloadDocument = async (req, res, next) => {
    try {
      const document = await Document.findById(req.params.id);
  
      if (!document || document.isArchived) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Increment download count
      document.downloadCount += 1;
      await document.save();
  
      // Send the cloudinary secure URL to the frontend to initiate download
      res.status(200).json({ 
          fileUrl: document.fileUrl,
          fileName: document.fileName
      });
    } catch (error) {
      next(error);
    }
};

// @desc    Update document metadata
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;

    let document = await Document.findById(req.params.id);

    if (!document || document.isArchived) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only allow admin or the original uploader to update
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this document' });
    }

    document.title = title || document.title;
    document.description = description !== undefined ? description : document.description;
    
    if (tags) {
        document.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    }

    await document.save();

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document (Archive / Hard delete from DB and Cloudinary)
// @route   DELETE /api/documents/:id
// @access  Private (Admin only or uploader)
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.isArchived) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Require admin or original uploader
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    const { cloudinary } = require('../middleware/upload');
    
    // Delete from Cloudinary
    if (document.publicId) {
        let resourceType = 'image';
        if (document.fileType !== 'image') {
           resourceType = 'raw'; // For PDFs, Excels
        }
        
        try {
            // Need to delete based on resource type.
            // Cloudinary API is somewhat tricky with raw files
            await cloudinary.uploader.destroy(document.publicId, { resource_type: resourceType });
        } catch(cloudErr) {
            console.error("Cloudinary deletion error:", cloudErr);
        }
    }

    // Hard delete from DB
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Document removed' });
  } catch (error) {
    next(error);
  }
};
