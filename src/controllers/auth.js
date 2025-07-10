const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
  try {
    const { code } = req.body;
    
    // 调用微信接口获取 openid
    const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WX_APPID,
        secret: process.env.WX_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid } = wxRes.data;

    // 查找或创建用户
    let user = await User.findOne({ openid });
    if (!user) {
      user = await User.create({ 
        openid,
        points: 0,
        monthlyPoints: 0
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 