// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'education-7gon91rq0a4f9513'
})
const db = cloud.database()
const users = db.collection('users')
const jwt = require('jsonwebtoken')

// 使用与其他函数相同的密钥
const SECRET_KEY = 'your-food-recommend-secret-key-2024'

// 云函数入口函数
exports.main = async (event, context) => {
  const { token } = event
  const wxContext = cloud.getWXContext()

  try {
    // 验证 token
    const decoded = jwt.verify(token, SECRET_KEY)
    console.log('decoded token:', decoded); // 添加日志
    
    // 验证 openid 是否匹配
    if (decoded.openid !== wxContext.OPENID) {
      console.log('openid不匹配:', decoded.openid, wxContext.OPENID); // 添加日志
      return {
        valid: false,
        message: '无效的 token'
      }
    }
    
    // 获取用户信息
    const user = await users.where({
      username: decoded.username
    }).get()
    
    if (user.data.length === 0) {
      return {
        valid: false,
        message: '用户不存在'
      }
    }

    const currentUser = user.data[0];
    return {
      valid: true,
      userInfo: {
        nickName: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        phone: currentUser.phone
      }
    }

  } catch (err) {
    console.error('[验证token失败]', err)
    if (err.name === 'JsonWebTokenError') {
      return {
        valid: false,
        message: 'token无效'
      }
    }
    if (err.name === 'TokenExpiredError') {
      return {
        valid: false,
        message: 'token已过期'
      }
    }
    return {
      valid: false,
      message: err.message || 'token验证失败'
    }
  }
} 