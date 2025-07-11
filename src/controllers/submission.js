const Submission = require('../models/submission');
const User = require('../models/user');

// 创建积分提交
exports.createSubmission = async (req, res) => {
  try {
    const { title, content, imageUrls } = req.body;

    // 验证必填字段
    if (!title || !content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '标题和内容为必填项'
      });
    }

    // 创建提交记录
    const submission = await Submission.create({
      studentId: req.user._id,
      title,
      content,
      imageUrls: imageUrls || [],
      status: 'pending'
    });

    res.status(201).json({
      message: '提交成功，等待审核',
      submission
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

// 获取学生的提交列表
exports.getMySubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({ studentId: req.user._id });

    res.json({
      submissions,
      pagination: {
        current: page,
        size: limit,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

// 获取提交详情
exports.getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('studentId', 'name')
      .populate('reviewerId', 'name');

    if (!submission) {
      return res.status(404).json({
        error: 'Not Found',
        message: '未找到该提交记录'
      });
    }

    // 验证访问权限
    if (submission.studentId._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'parent') {
      return res.status(403).json({
        error: 'Forbidden',
        message: '没有权限查看该记录'
      });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}; 