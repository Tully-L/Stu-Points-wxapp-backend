const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  imageUrls: [{
    type: String,
    trim: true
  }],
  points: { 
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComment: {
    type: String,
    trim: true
  },
  reviewedAt: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 添加索引以提高查询性能
submissionSchema.index({ studentId: 1, createdAt: -1 });
submissionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema); 