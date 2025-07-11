const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission');
const { protect, restrictTo } = require('../middlewares/auth');

// 所有路由都需要登录
router.use(protect);

// 创建提交
router.post('/', restrictTo('student'), submissionController.createSubmission);

// 获取我的提交列表
router.get('/my', restrictTo('student'), submissionController.getMySubmissions);

// 获取提交详情
router.get('/:id', submissionController.getSubmission);

module.exports = router; 